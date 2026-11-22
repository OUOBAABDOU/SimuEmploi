(() => {
  const data = JSON.parse(document.getElementById('review-data').textContent);
  let evidence = data.evidence;
  let dirty = false;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const get = path => path.split('.').reduce((item, key) => item?.[key], evidence);
  const set = (path, value) => {
    const keys = path.split('.');
    const last = keys.pop();
    keys.reduce((item, key) => item[key], evidence)[last] = value;
    dirty = true;
  };
  const field = (label, path, type='text') => `<label class="field">${esc(label)}<input data-path="${esc(path)}" type="${type}" value="${esc(get(path))}" ${type==='number'?'min="0" max="80" step="1"':''}></label>`;
  const note = (label,path) => `<label class="field full">${esc(label)}<textarea data-path="${esc(path)}">${esc(get(path))}</textarea></label>`;
  const select = (label,path,options) => `<label class="field">${esc(label)}<select data-path="${esc(path)}">${options.map(([key,text])=>`<option value="${esc(key)}" ${get(path)===key?'selected':''}>${esc(text)}</option>`).join('')}</select></label>`;
  const checkbox = (label,path) => `<label class="check"><input type="checkbox" data-path="${esc(path)}" ${get(path)?'checked':''}>${esc(label)}</label>`;
  const verdicts = [['pending','À relire'],['approved','Approuvé après lecture'],['revise','Modifications demandées']];
  const review = (prefix,label) => `<div class="review-fields"><h3>${esc(label)}</h3><div class="grid">${field('Nom ou pseudonyme du relecteur',prefix+'.reviewer')}${field('Date réelle de relecture',prefix+'.reviewed_at','date')}${select('Avis',prefix+'.verdict',verdicts)}${note('Notes, périmètre relu et raisons de l’avis',prefix+'.notes')}</div></div>`;

  function renderApi() {
    const plan=evidence.api_qualification_plan;
    document.getElementById('api-plan').textContent=plan?.primary_candidate==='agentrouter_external'
      ? 'Orientation reçue : AgentRouter est le premier candidat à qualifier pour les entretiens texte. Aucun modèle, endpoint, budget ou traitement de données n’est déclaré qualifié par ce choix ; les appels restent désactivés.'
      : 'Orientation fournisseur à confirmer dans la relecture S0. AgentRouter est une option étudiée ; aucun appel IA n’est activé.';
  }

  function renderCorpus() {
    document.getElementById('corpus').innerHTML = `<h2>Relire la banque et la politique adaptative</h2><p>Banque de référence version 3 pour des entretiens adaptatifs. Lire chaque question avec son aide et ses critères avant de donner un avis sur le scénario.</p><p class="muted">Deux critères ont été ajustés : une question de démarche ou de lien au poste n’impose plus un nouvel exemple vécu.</p>` + data.corpus.map((s,i) => `<article class="card"><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><span class="tag">Version ${s.version} · ${s.question_count} axes · jusqu’à 7 questions adaptées · avis métier en attente de saisie</span>${s.questions.map((q,n)=>`<details class="question"><summary>${n+1}. ${esc(q.prompt)}</summary><p class="criterion">Type : ${esc(q.response_kind)} · critères : ${esc(q.criteria.map(k=>s.rubric.find(c=>c.key===k)?.label).join(', '))}</p><ul>${q.guidance.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details>`).join('')}<details><summary>Grille du scénario</summary>${s.rubric.map(c=>`<p><strong>${esc(c.label)}</strong> : ${esc(c.description)}</p>`).join('')}</details>${review('business_reviews.'+i,'Avis métier sur la banque, la grille et la politique adaptative')}</article>`).join('');
  }
  function renderTeam() {
    const roles={D1:'Identité, compte, droits',D2:'Catalogue, questions, sessions',D3:'Évaluation, preuves, travaux IA',D4:'Parcours, maquettes, essais UX',D5:'Données, livraison, exploitation'};
    document.getElementById('team').innerHTML=`<h2>Confirmer les personnes et la capacité</h2><p>OUOBA Abdou Rasmané est l’interlocuteur nommé. Renseignez les cinq places sans inventer de développeur ni de disponibilité. Une personne peut tenir plusieurs rôles ; ses heures ne se multiplient pas.</p><div class="grid">${field('Responsable produit','responsible_product')}${field('Responsable relecture métier','responsible_business_review')}${field('Coordination de l’équipe','team_coordinator')}</div>`+Object.entries(roles).map(([key,label])=>`<article class="card"><h3>${key} · ${label}</h3><div class="grid">${field('Nom ou pseudonyme','developers.'+key+'.name')}${field('Heures disponibles par sprint de deux semaines','developers.'+key+'.availability_hours_per_sprint','number')}</div>${checkbox('La personne a relu et compris son périmètre','developers.'+key+'.scope_acknowledged')}</article>`).join('');
  }
  function renderTests() {
    const plan=evidence.candidate_test_plan;
    const planned=plan?.planned_date ? `<p class="notice">Première boucle prévue le ${esc(plan.planned_date.split('-').reverse().join('/'))} : ${esc(plan.target_participants)} personnes. Date de planification reçue ; les séances et leurs résultats restent à consigner après réalisation.</p>` : '';
    document.getElementById('tests').innerHTML=`<h2>Consigner des séances réellement réalisées</h2><p>Cible exploratoire proposée : cinq personnes, première boucle de trois. Les codes P01, P02… sont attribués à la séance. Aucun test n’est créé automatiquement.</p>${planned}<details class="question"><summary>Préparer la première séance</summary><ol><li>Ouvrir la maquette candidat dans un autre onglet et commencer en présentation guidée.</li><li>Lire l’introduction du protocole et demander l’accord de participation et de prise de notes.</li><li>Ajouter une fiche, attribuer un code anonyme, puis renseigner la date réellement observée et l’appareil.</li><li>Faire les dix tâches avec des réponses fictives ; noter ce qui a été compris et l’aide fournie.</li><li>Consigner les difficultés, puis exporter le fichier avant de fermer la page.</li></ol><p>La date prévue ne remplit pas automatiquement la date de séance. Aucun micro ni caméra n’est nécessaire à cette boucle texte.</p></details><div class="links"><a href="03_PROTOCOLE_ESSAIS.md" target="_blank" rel="noopener">Lire le protocole</a><a href="maquettes/candidat.html" target="_blank" rel="noopener">Ouvrir la maquette pour la séance</a></div><button id="add-session">Ajouter une fiche de séance</button>`+(evidence.participant_sessions.length?'':`<p class="empty">Aucune observation candidate renseignée. La possibilité d’organiser des essais est confirmée ; leurs résultats restent à recueillir.</p>`)+evidence.participant_sessions.map((session,i)=>`<article class="card"><h3>Séance ${i+1}</h3><div class="grid">${field('Code anonyme du participant','participant_sessions.'+i+'.participant_code')}${field('Animateur','participant_sessions.'+i+'.facilitator')}${field('Date réelle de séance','participant_sessions.'+i+'.observed_at','date')}${field('Appareil et contexte utiles','participant_sessions.'+i+'.device')}${select('Objectif du candidat','participant_sessions.'+i+'.objective',[['','À renseigner'],['internship','Premier stage'],['first_job','Premier emploi']])}</div>${checkbox('La personne a accepté cette séance et les notes minimales','participant_sessions.'+i+'.participation_agreed')}${data.tasks.map((task,n)=>`<div class="task"><p>${task.id} · ${esc(task.instruction)}</p><div class="grid">${select('Résultat observé','participant_sessions.'+i+'.tasks.'+n+'.outcome',[['not_run','Non réalisée'],['success','Réussie sans aide'],['assisted','Réussie avec aide'],['failed','Échec observé']])}${note('Observation factuelle et aide éventuellement fournie','participant_sessions.'+i+'.tasks.'+n+'.observation')}</div></div>`).join('')}${note('Bilan de la séance et difficultés à traiter','participant_sessions.'+i+'.summary')}</article>`).join('');
  }
  function renderReview() {
    document.getElementById('review').innerHTML=`<h2>Revoir les décisions et la réception</h2><p>La nomination des responsables n’approuve pas le contenu. Les avis ci-dessous sont à renseigner après lecture et examen des observations.</p><div class="links"><a href="02_PARCOURS_ET_CONTRATS.md" target="_blank" rel="noopener">Parcours et contrats</a><a href="04_RESPONSABLES_DECISIONS_BACKLOG.md" target="_blank" rel="noopener">Décisions et backlog</a><a href="05_RECEPTION.md" target="_blank" rel="noopener">Conditions de réception</a></div>${review('decisions_review','Contrats et décisions de conception')}${review('backlog_review','Backlog, estimations et capacité de l’équipe')}${review('product_review','Avis produit sur la référence S0-0.4 et les essais')}
    <article class="card"><h3>Difficultés et corrections</h3><p>Une absence de note ne signifie pas qu’aucun problème n’a été observé.</p><button id="add-finding">Ajouter une difficulté</button>${evidence.findings.map((f,i)=>`<div class="task"><h3>${esc(f.id)}</h3><div class="grid">${select('Gravité','findings.'+i+'.severity',[['critical','Critique'],['major','Majeure'],['minor','Mineure']])}${select('État','findings.'+i+'.status',[['open','Ouverte'],['resolved','Corrigée et revérifiée'],['accepted','Limite acceptée explicitement']])}${field('Responsable du traitement','findings.'+i+'.owner')}${note('Problème et référence de séance/tâche','findings.'+i+'.description')}${note('Correction, nouvel essai ou justification de la limite','findings.'+i+'.retest_notes')}</div></div>`).join('')}</article><article class="card"><h3>Complétude des saisies</h3><ul id="completeness" class="status-list"></ul><p class="muted">Ce compteur aide à relire les saisies. La décision S0 dépend du registre vérifié et des personnes responsables ; aucun résultat humain n’est inventé.</p></article>`;
    summary();
  }
  function renderApprovalLabels() {
    document.querySelectorAll('#corpus article.card .tag').forEach((tag,i)=>{
      const scenario=data.corpus[i], r=evidence.business_reviews[i];
      const approved=r?.verdict==='approved' && r.reviewer && r.reviewed_at && r.notes;
      const status=approved ? `avis métier approuvé le ${r.reviewed_at.split('-').reverse().join('/')}`
        : r?.verdict==='revise' ? 'modifications demandées' : 'avis métier à renseigner';
      tag.textContent=`Version ${scenario.version} · ${scenario.question_count} axes · jusqu’à 7 questions adaptées · ${status}`;
    });
    const section=document.getElementById('review');
    let notice=document.getElementById('design-review-status');
    if(!notice && section.querySelector('h2')) {
      notice=document.createElement('p');notice.id='design-review-status';notice.className='notice';
      section.querySelector('h2').insertAdjacentElement('afterend',notice);
    }
    const teamReady=Object.values(evidence.developers).every(r=>r.scope_acknowledged);
    const backlogReady=evidence.backlog_review?.verdict==='approved';
    if(notice) notice.textContent=evidence.design_review?.verdict==='approved'
      ? `Référence de conception S0 approuvée le 22/11/2026. ${teamReady&&backlogReady?'Les cinq périmètres et le backlog sont confirmés. ':''}La réception finale attend l’examen des essais candidats et les corrections${teamReady&&backlogReady?'':', ainsi que la confirmation du backlog et des périmètres de l’équipe'}.`
      : 'Référence de conception à relire ; la réception finale attend aussi les essais candidats.';
  }
  const hasText = value => typeof value==='string' && value.trim().length>0;
  const isObservedDate = value => {
    if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
    const parsed=new Date(value+'T00:00:00Z');
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10)===value && value<=new Date().toISOString().slice(0,10);
  };
  const completeSession = s => {
    const ids=new Set(s.tasks.map(t=>t.id));
    return s.participation_agreed===true && isObservedDate(s.observed_at)
      && hasText(s.participant_code) && hasText(s.facilitator) && hasText(s.device) && hasText(s.summary)
      && ['internship','first_job'].includes(s.objective) && s.tasks.length===data.tasks.length
      && ids.size===data.tasks.length && data.tasks.every(t=>ids.has(t.id))
      && s.tasks.every(t=>['success','assisted','failed'].includes(t.outcome) && hasText(t.observation));
  };
  function nextParticipantCode() {
    const used=new Set(evidence.participant_sessions.map(s=>String(s.participant_code??'').trim()));
    let number=1;
    while(used.has('P'+String(number).padStart(2,'0')))number++;
    return 'P'+String(number).padStart(2,'0');
  }
  function summary() {
    renderApprovalLabels();
    const list=document.getElementById('completeness'); if(!list)return;
    const reviewed=evidence.business_reviews.filter(r=>r.verdict==='approved'&&r.reviewer&&r.reviewed_at&&r.notes).length;
    const people=Object.values(evidence.developers).filter(r=>r.name&&r.availability_hours_per_sprint!==null&&r.scope_acknowledged).length;
    const complete=evidence.participant_sessions.filter(completeSession);
    const codes=new Set(complete.map(s=>s.participant_code.trim()));
    list.innerHTML=`<li>${reviewed}/3 avis métier complets déclarés</li><li>${people}/5 places avec disponibilité et périmètre confirmés</li><li>${codes.size}/3 personnes avec une fiche complète déclarée</li><li>${complete.length-codes.size} code(s) répété(s) parmi les fiches complètes</li><li>${evidence.findings.filter(f=>f.severity==='critical'&&f.status!=='resolved').length} difficulté(s) critique(s) non résolue(s) déclarée(s)</li>`;
  }
  function render() {renderCorpus();renderApi();renderTeam();renderTests();renderReview();}
  document.addEventListener('input',e=>{const path=e.target.dataset.path;if(!path)return;set(path,e.target.type==='checkbox'?e.target.checked:e.target.type==='number'?(e.target.value===''?null:Number(e.target.value)):e.target.value);summary();});
  document.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.dataset.panel){document.querySelectorAll('.panel').forEach(p=>p.hidden=p.id!==button.dataset.panel);document.querySelectorAll('nav button').forEach(b=>{if(b.dataset.panel===button.dataset.panel)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(button.dataset.focus)document.querySelector(`[data-path="${button.dataset.focus}"]`)?.focus();}
    if(button.id==='add-session'){evidence.participant_sessions.push({participant_code:nextParticipantCode(),facilitator:'',observed_at:'',device:'',objective:'',participation_agreed:false,tasks:data.tasks.map(t=>({id:t.id,outcome:'not_run',observation:''})),summary:''});dirty=true;renderTests();summary();}
    if(button.id==='add-finding'){evidence.findings.push({id:'F'+String(evidence.findings.length+1).padStart(2,'0'),severity:'critical',status:'open',owner:'',description:'',retest_notes:''});dirty=true;renderReview();}
    if(button.id==='export'){const blob=new Blob([JSON.stringify(evidence,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='SimuEmploi_S0_preuves.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);dirty=false;document.getElementById('message').textContent='Export demandé. Conservez le fichier téléchargé ; il ne modifie pas automatiquement le registre du projet.';}
  });
  document.getElementById('import').addEventListener('change',async e=>{
    const file=e.target.files[0];if(!file)return;
    try{const value=JSON.parse(await file.text());if(value.schema_version!=='S0-0.4'||!value.developers||!Array.isArray(value.business_reviews)||value.business_reviews.length!==3||!Array.isArray(value.participant_sessions)||!Array.isArray(value.findings)||!value.product_review||!value.decisions_review||!value.backlog_review)throw new Error('Format de registre incompatible.');
      if(!['D1','D2','D3','D4','D5'].every(k=>value.developers[k]))throw new Error('Affectations incomplètes.');
      if(!value.participant_sessions.every(s=>Array.isArray(s.tasks)&&s.tasks.length===data.tasks.length))throw new Error('Fiches de séance incompatibles.');
      evidence=value;dirty=true;render();document.getElementById('message').textContent='Fichier repris dans cette page ; relisez puis exportez après modification.';
    }catch(error){document.getElementById('message').textContent=error.message;}
  });
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
  render();
})();
