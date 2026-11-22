(() => {
  const root = document.getElementById('simuemploi-candidat-v1');
  /* ILLUSTRATION_DATA */
  const screens = [['welcome','C01 · Découvrir'],['login','C02 · Connexion'],['preferences','C03 · Mon objectif'],['home','C04 · Accueil candidat'],['catalog','C05 · Exercices'],['prepare','C06 · Préparer la session'],['practice','C07 · Répondre'],['feedback','C08 · Retour sur la réponse'],['finish','C09 · Fin de session'],['history','C10 · Historique'],['report','C11 · Rapport'],['account','C12 · Compte et données']];
  const selector = root.querySelector('#se-screen');
  selector.innerHTML = screens.map(([id,label])=>`<option value="${id}">${label}</option>`).join('');
  const saved = globalThis.openai?.widgetState?.modelContent;
  const validScreen = screens.some(s=>s[0]===saved?.screen) ? saved.screen : 'home';
  const sampleAnswer = 'Lors de mon stage dans une boutique à Ouagadougou, j’ai accueilli les clients et suivi leurs demandes. Une cliente avait reçu une commande incomplète. J’ai vérifié la livraison avec mon responsable et organisé l’envoi du produit manquant. La cliente a confirmé sa réception le lendemain.';
  const exercises = [
    {name:'Service client',domain:'Commerce',art:'commerce',goal:'Présenter une expérience et traiter une réclamation.',questions:['Présentez une expérience où vous avez aidé un client à résoudre un problème.','Comment réagiriez-vous face à un client insatisfait ?','Comment organisez-vous plusieurs demandes en même temps ?','Comment vérifiez-vous qu’une demande est bien résolue ?','Que souhaitez-vous améliorer dans votre manière de communiquer ?']},
    {name:'Assistant administratif',domain:'Administration',art:'organiser',goal:'Organiser les demandes et expliquer vos priorités.',questions:['Décrivez une situation où vous avez organisé plusieurs tâches.','Deux demandes urgentes arrivent en même temps. Comment choisissez-vous votre priorité ?','Comment vérifiez-vous les informations d’un dossier ?','Comment expliquez-vous un retard à un collègue ?','Quelle habitude souhaitez-vous améliorer dans votre organisation ?']},
    {name:'Premier entretien de stage',domain:'Début de parcours',art:'preparer',goal:'Exprimer votre motivation avec un exemple de votre parcours.',questions:['Pourquoi souhaitez-vous faire ce stage, et qu’aimeriez-vous y apprendre ?','Présentez un projet scolaire, associatif ou personnel dont vous êtes fier.','Comment réagiriez-vous face à une tâche que vous ne connaissez pas ?','Comment préparez-vous une échéance importante ?','Quelle compétence souhaitez-vous développer pendant ce stage ?']},
    {name:'Présentation professionnelle',domain:'Tous domaines',art:'progresser',goal:'Relier votre parcours à votre prochain objectif.',questions:['Présentez votre parcours et ce que vous recherchez aujourd’hui.','Quelle expérience illustre un de vos points forts ?','Comment expliquez-vous votre intérêt pour ce poste ?','Comment vous adaptez-vous à une nouvelle équipe ?','Quel point de votre présentation souhaitez-vous retravailler ?']}
  ];
  const variants = [...root.querySelectorAll('.se-product')].map((element,index)=>({element,index,screen:validScreen,situation:'normal',answer:sampleAnswer,question:1,message:'',error:false,confirmDelete:false,paused:false,sessionStarted:false,finished:false,readOnly:false,scenario:'Service client',domain:'Tous les domaines',info:'',signalOpen:false,density:26,radius:18,accent:index?'#21598a':'#12675d',customAccent:false}));
  selector.value = validScreen;
  variants.forEach(v=>{v.preparedScenario=v.scenario;v.confirmRestart=false;});
  const icon = name=>`<i data-lucide="${name}" aria-hidden="true"></i>`;
  const esc = value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button = (label,action,kind='primary',extra='')=>`<button type="button" class="se-btn cursor-interaction ${kind==='primary'?'se-btn-primary':kind==='danger'?'se-btn-danger':kind==='quiet'?'se-btn-quiet':''}" data-action="${esc(action)}" ${extra}>${label}</button>`;
  const go = (label,screen,kind='primary')=>button(label,'go:'+screen,kind);
  const art = name=>`<picture class="se-art" aria-hidden="true"><source media="(prefers-color-scheme: dark)" srcset="${illustrations[name].sombre}"><img src="${illustrations[name].clair}" width="480" height="320" alt="" decoding="async"></picture>`;
  const title = (kicker,heading,sub)=>`<div class="se-heading"><span class="se-kicker">${esc(kicker)}</span><h1>${esc(heading)}</h1><p class="se-sub">${esc(sub)}</p></div>`;
  const scenario = v=>exercises.find(e=>e.name===v.scenario)||exercises[0];
  function save(v) { if(globalThis.openai?.setWidgetState)globalThis.openai.setWidgetState({modelContent:{screen:v.screen,variant:v.index?'Espace autonome':'Parcours guidé'},privateContent:null}).catch(()=>{}); }
  let stageFrame;
  function syncStage() {
    cancelAnimationFrame(stageFrame);
    stageFrame=requestAnimationFrame(()=>{
      const width=variants.find(v=>!v.element.parentElement.hidden)?.element.getBoundingClientRect().width;
      if(!width)return;
      let tallest=0;
      variants.forEach(v=>{
        const section=v.element.parentElement, original=section.getAttribute('style');
        v.element.style.minHeight='0px';
        if(section.hidden)section.style.cssText=`display:block!important;position:absolute;visibility:hidden;width:${width}px;`;
        tallest=Math.max(tallest,v.element.getBoundingClientRect().height);
        if(original===null)section.removeAttribute('style');else section.setAttribute('style',original);
      });
      variants.forEach(v=>{v.element.style.minHeight=Math.ceil(tallest)+'px';});
    });
  }
  function notices(v) {
    let html=v.situation==='offline'?'<div class="se-note" role="status">Connexion interrompue. Une réponse conservée sur cet appareil attend le retour du réseau avant son envoi et son analyse.</div>':'';
    if(v.message&&!v.error)html+=`<div class="se-note" role="status">${esc(v.message)}</div>`;
    return html;
  }
  function framework(v) {
    const first=v.question===1;
    let steps = first&&v.scenario==='Service client' ? [['Situation','Où étiez-vous ? Quel était votre rôle ?'],['Actions','Qu’avez-vous fait personnellement ?'],['Résultat','Qu’avez-vous constaté ou appris ?']] : first&&v.scenario==='Premier entretien de stage' ? [['Motivation','Pourquoi ce stage vous intéresse-t-il ?'],['Exemple','Quel projet ou apprentissage vous y prépare ?'],['Objectif','Que souhaitez-vous apprendre ?']] : first&&v.scenario==='Présentation professionnelle' ? [['Parcours','Présentez brièvement votre expérience.'],['Exemple','Choisissez un fait utile pour votre projet.'],['Objectif','Expliquez ce que vous recherchez.']] : [['Contexte','Précisez la situation ou la demande.'],['Votre démarche','Expliquez vos choix et vos actions.'],['Vérification','Dites comment vous vérifiez le résultat.']];
    if(v.question===5)steps=[['Un point à travailler','Choisissez une difficulté concrète.'],['Une action','Expliquez comment vous allez vous entraîner.'],['Un repère','Comment observerez-vous votre progrès ?']];
    return `<details class="se-help" ${v.index?'open':''}><summary class="cursor-interaction">Un coup de main pour répondre ?</summary><div class="se-help-content"><ol class="se-framework">${steps.map(([label,detail],i)=>`<li><span class="se-step" aria-hidden="true">${i+1}</span><div><strong>${label}</strong><span class="se-sub">${detail}</span></div></li>`).join('')}</ol><p class="se-sub">Un projet scolaire, associatif ou personnel peut aussi servir d’exemple. Restez fidèle à ce que vous avez vécu.</p></div></details>`;
  }
  function exerciseCard(e) {
    return `<article class="se-panel">${artCover(e.art)}<div class="se-row"><span class="se-pill">${e.domain}</span><span class="se-sub">Texte</span></div><h3>${e.name}</h3><p class="se-sub">${e.goal}</p><div class="se-meta"><span>5 questions</span><span>Environ 12 min</span></div>${button('Préparer cet exercice','scenario:'+e.name,'secondary',`aria-label="Préparer : ${e.name}"`)}</article>`;
  }
  const artCover = name=>`<div class="se-exercise-cover">${art(name)}</div>`;
  function content(v) {
    const q=v.question, exercise=v.screen==='prepare'?(exercises.find(e=>e.name===v.preparedScenario)||scenario(v)):scenario(v), question=exercise.questions[q-1];
    const sampleNotice='<p class="se-note">Exemple de maquette : ce retour est fictif et ne constitue pas une analyse de votre saisie.</p>';
    switch(v.screen) {
      case 'welcome': return `${title('Préparation à l’emploi','Un entretien se prépare, une réponse à la fois.','Entraînez-vous avec des exercices proches de votre métier et du contexte burkinabè.')}<div class="se-hero se-hero-feature"><div class="se-hero-copy"><h2>Votre prochain entretien commence ici.</h2><p class="se-sub">Choisissez une situation, répondez avec vos mots et identifiez un point à améliorer.</p><div class="se-actions">${go('Découvrir les exercices','catalog')}${go('Créer ou retrouver mon compte','login','secondary')}</div></div>${art('preparer')}</div><ol class="se-list"><li><span class="se-step">1</span><span>Choisir un exercice lié à votre objectif.</span></li><li><span class="se-step">2</span><span>Répondre en texte, à votre rythme.</span></li><li><span class="se-step">3</span><span>Lire un conseil et préparer le prochain essai.</span></li></ol><div class="se-grid"><article class="se-panel"><h3>Un smartphone suffit</h3><p class="se-sub">Aucun microphone ni caméra nécessaire.</p></article><article class="se-panel"><h3>Un entraînement privé</h3><p class="se-sub">Vos essais servent à votre préparation.</p></article></div><p class="se-sub">SimuEmploi aide à se préparer et ne garantit pas une embauche.</p>`;
      case 'login': return `<div class="se-login se-section">${title('Mon espace','Gardez une trace de vos entraînements','Créez votre compte ou retrouvez votre accès.')}<div class="se-panel"><p class="se-sub">La prochaine étape vous permettra de vous connecter en toute sécurité, puis de retrouver vos essais.</p>${button('Créer ou retrouver mon compte','connect')}<p class="se-sub">Dans cette maquette, ce bouton permet seulement de découvrir l’étape suivante.</p><div class="se-line"></div>${go('Continuer à découvrir les exercices','catalog','quiet')}<div class="se-actions">${button('Conditions d’utilisation','terms','quiet')}${button('Confidentialité','privacy','quiet')}</div></div></div>`;
      case 'preferences': return `${title('Votre objectif','Quel entretien préparez-vous ?','Quelques choix pour vous proposer un premier exercice.')}<div class="se-panel"><label class="se-field">Mon objectif<select><option>Un entretien d’emploi</option><option>Un entretien de stage</option><option>Un oral professionnel</option></select></label><label class="se-field">Domaine professionnel<select><option>Service client et commerce</option><option>Administration</option><option>Comptabilité</option><option>Logistique</option></select></label><label class="se-field">Mon expérience<select><option>Première recherche ou stage</option><option>Expérience professionnelle</option><option>Reconversion</option></select></label><p class="se-sub">Vous pourrez modifier ces préférences depuis votre compte.</p><div class="se-actions">${go('Enregistrer mon objectif','home')}${go('Choisir plus tard','home','secondary')}</div></div>`;
      case 'home': return `${title('Votre espace privé','Bonjour Aminata','Une étape simple pour préparer votre prochain entretien.')}${v.sessionStarted&&!v.finished?`<div class="se-resume"><span class="se-kicker">Mon entraînement en cours</span><h2>${esc(v.scenario)}</h2><p class="se-sub">Question ${q} sur 5 · ${v.paused?'session en pause':'session à reprendre'}</p><p class="se-sub">Votre brouillon reste sur cet appareil tant que son envoi n’est pas confirmé.</p><div class="se-actions">${button('Reprendre mon entraînement','resume-session')}${go('Voir mes essais','history','quiet')}</div></div>`:''}<div class="se-home-layout"><div class="se-hero se-hero-feature"><div class="se-hero-copy"><span class="se-kicker">Un exercice pour commencer</span><h2>Racontez une expérience avec clarté</h2><p class="se-sub">Expliquez une situation, ce que vous avez fait et le résultat obtenu.</p><div class="se-meta"><span>5 questions</span><span>Environ 12 min</span><span>Texte</span></div><div class="se-actions">${button('Préparer cet exercice','scenario:Service client')}${go('Explorer les exercices','catalog','secondary')}</div></div>${art('preparer')}</div>${v.index?`<div class="se-panel"><h3>Choisir mon point de travail</h3><ul class="se-list"><li><span class="se-step">1</span><span>Illustrer une expérience</span></li><li><span class="se-step">2</span><span>Réagir à une situation difficile</span></li><li><span class="se-step">3</span><span>Présenter mon projet</span></li></ul>${go('Choisir un exercice','catalog','secondary')}</div>`:''}</div><section class="se-section"><div class="se-row"><h2>Mon dernier entraînement</h2>${go('Tout l’historique','history','quiet')}</div>${v.situation==='empty'?`<div class="se-panel se-empty">${art('progresser')}<h3>Votre premier essai vous attend</h3><p class="se-sub">Vous retrouverez ici vos entraînements après une session.</p>${go('Choisir mon premier exercice','catalog')}</div>`:`<article class="se-panel"><div class="se-row"><h3>Service client · Expliquer une expérience</h3><span class="se-pill">Rapport disponible</span></div><p class="se-sub">Exemple de démonstration · Prochain point à travailler : préciser le résultat.</p>${go('Relire le rapport','report','secondary')}</article>`}</section>`;
      case 'catalog': {
        const selected=exercises.filter(e=>v.domain==='Tous les domaines'||e.domain===v.domain);
        return `${title('Exercices','Choisissez une situation à pratiquer','Chaque fiche indique ce que vous allez travailler.')}<div class="se-tools"><label class="se-field">Domaine<select data-field="domain">${['Tous les domaines','Commerce','Administration','Début de parcours','Logistique'].map(d=>`<option ${v.domain===d?'selected':''}>${d}</option>`).join('')}</select></label><span class="se-sub" role="status">${selected.length} exercice${selected.length>1?'s':''}</span></div>${selected.length?`<div class="se-grid" data-exercises>${selected.map(exerciseCard).join('')}</div>`:`<div class="se-panel se-empty">${art('organiser')}<h2>Aucun exercice dans ce domaine pour le moment</h2><p class="se-sub">Vous pouvez choisir une présentation professionnelle ou consulter les autres domaines.</p>${button('Voir tous les exercices','reset-filter','secondary')}</div>`}`;
      }
      case 'prepare': return `${title('Avant de commencer',exercise.name,exercise.goal)}<div class="se-grid"><div class="se-panel">${artCover(exercise.art)}<h3>Votre exercice</h3><div class="se-meta"><span>5 questions</span><span>Environ 12 min</span></div><ol class="se-list"><li><span class="se-step">1</span><span>Répondre à une question à la fois.</span></li><li><span class="se-step">2</span><span>Relire et valider sa réponse.</span></li><li><span class="se-step">3</span><span>Lire le retour, puis continuer.</span></li></ol></div><div class="se-panel"><h3>À votre rythme, en texte</h3><p class="se-sub">Vous pouvez faire une pause. Le temps indiqué est un repère, sans compte à rebours.</p><p class="se-sub">L’analyse demande une connexion. Un brouillon local n’est pas encore sauvegardé en ligne.</p><div class="se-note">Évitez de nommer d’autres personnes ou de saisir leurs informations personnelles.</div></div></div>${v.confirmRestart?`<div class="se-note"><h3>Un entraînement est déjà en cours</h3><p>Vous pouvez le reprendre. Dans cette démonstration, un nouvel essai remplacera le brouillon courant.</p><div class="se-actions">${button('Reprendre mon entraînement','resume-session')}${button('Commencer un nouvel essai','start-new','secondary')}</div></div>`:`<div class="se-actions">${button('Commencer la session','start')}${go('Choisir un autre exercice','catalog','secondary')}</div>`}`;
      case 'practice': return `${title('Session en cours',v.scenario,'Répondez avec vos propres mots, puis relisez avant de valider.')}<div class="se-row"><span class="se-sub">Question ${q} sur 5 · ${q-1} réponse${q>2?'s':''} validée${q>2?'s':''}</span>${button('Faire une pause','pause','quiet')}</div><div class="se-meter" role="progressbar" aria-label="Réponses validées dans la session" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${q-1}"><span style="width:${(q-1)*20}%"></span></div>${v.paused?`<div class="se-panel se-empty"><h2>Session en pause</h2><p class="se-sub">Votre brouillon est conservé sur cet appareil pendant cette démonstration. L’envoi en ligne doit être confirmé avant toute analyse.</p><div class="se-actions">${button('Reprendre ma réponse','resume')}${go('Retour à mon accueil','home','secondary')}</div></div>`:`<div class="se-practice-layout"><div class="se-panel"><p class="se-question" id="${v.element.id}-question">${esc(question)}</p><label class="se-field">Votre réponse<textarea data-field="answer" ${v.readOnly?'readonly':''} aria-describedby="${v.element.id}-draft${v.error?' '+v.element.id+'-error':''}" ${v.error?'aria-invalid="true"':''} placeholder="Décrivez votre exemple ou votre démarche…">${esc(v.answer)}</textarea></label>${v.error?`<p class="se-field-error" role="alert" id="${v.element.id}-error">${esc(v.message)}</p>`:''}<div class="se-row"><div class="se-save-state" id="${v.element.id}-draft"><strong>${v.readOnly?'Réponse validée · lecture seule':v.situation==='offline'?'Brouillon sur cet appareil · à synchroniser':'Brouillon sur cet appareil'}</strong><span>${v.readOnly?'Votre réponse est figée pour cet essai.':'Validez pour demander son envoi et un retour.'}</span></div><span class="se-sub" data-word-count>${v.answer.trim().split(/\s+/).filter(Boolean).length} mots</span></div><div class="se-actions">${button(v.readOnly?'Retour au commentaire':v.situation==='offline'?'Conserver mon brouillon':'Valider ma réponse','submit')}</div><p class="se-sub">Le nombre de mots est un repère, pas une note.</p></div>${framework(v)}</div>`}`;
      case 'feedback':
        if(v.situation==='loading')return `${title('Réponse sauvegardée','Votre retour est en préparation','Vous pouvez quitter cette page et revenir depuis votre historique.')}<div class="se-panel se-empty"><h3>Analyse en cours</h3><p class="se-sub">La réponse est conservée. Le temps d’attente peut varier.</p><div class="se-actions">${button('Consulter à nouveau','retry','secondary')}${go('Revenir à mon accueil','home','quiet')}</div></div>`;
        if(v.situation==='failed')return `${title('Réponse sauvegardée','Le retour est temporairement indisponible','Votre réponse reste dans la session.')}<div class="se-alert" role="alert">L’analyse n’a pas abouti. Vous pouvez continuer sans attendre un retour.</div><div class="se-actions">${button('Réessayer l’analyse','retry')}${button('Continuer sans retour','next','secondary')}</div>`;
        if(v.situation==='offline')return `${title('Réponse en attente','Retrouvons votre connexion','L’analyse pourra commencer après confirmation de l’envoi.')}<div class="se-panel"><p class="se-sub">Votre brouillon reste sur cet appareil. Son envoi n’est pas encore confirmé.</p>${button('Vérifier la connexion','retry','secondary')}</div>`;
        return `${title('Question '+q+' sur 5','Un retour pour votre prochain essai','Un point d’appui, puis une piste concrète pour progresser.')}${sampleNotice}<div class="se-grid"><article class="se-panel"><span class="se-pill">Point d’appui</span><h3>Une action concrète</h3><p class="se-sub">Extrait de la réponse fictive de démonstration :</p><blockquote class="se-quote">« J’ai vérifié la livraison avec mon responsable et organisé l’envoi du produit manquant. »</blockquote><p class="se-sub">On comprend le rôle joué dans la résolution du problème.</p></article><article class="se-panel"><span class="se-pill se-pill-warm">Prochain point à travailler</span><h3>Préciser le résultat</h3><p class="se-sub">Au prochain essai, ajoutez une phrase sur ce qui a changé et ce que vous avez appris.</p></article></div><div class="se-actions">${button(q===5?'Terminer la session':'Passer à la question suivante','next')}${go('Relire ma réponse','practice','secondary')}${button('Signaler un retour inexact','signal','quiet')}</div>${signalPanel(v)}`;
      case 'finish': return `<div class="se-finish-layout">${title('Session terminée','Vous avez terminé cet entraînement','Prenez un moment pour choisir la suite.')}${art('progresser')}</div><div class="se-panel"><h2>Votre prochain pas</h2><p class="se-sub">Relisez votre rapport et choisissez un seul point à retravailler.</p><div class="se-actions">${go('Consulter mon rapport','report')}${go('Retour à mon accueil','home','secondary')}</div></div><div class="se-note">La session est terminée. Le rapport peut encore être en préparation : ce sont deux étapes distinctes.</div>`;
      case 'history': return `${title('Mes entraînements','Retrouvez vos essais','Reprenez une session ou relisez un rapport.')}<div class="se-section">${v.sessionStarted&&!v.finished?`<article class="se-resume"><h2>${esc(v.scenario)}</h2><p class="se-sub">Question ${q} sur 5 · ${v.paused?'En pause':'En cours'}</p>${button('Reprendre la session','resume-session')}</article>`:''}${v.situation==='empty'&&!v.sessionStarted?`<div class="se-panel se-empty">${art('progresser')}<h3>Aucun entraînement pour le moment</h3><p class="se-sub">Un premier exercice suffit pour commencer votre historique.</p>${go('Choisir un exercice','catalog')}</div>`:`<article class="se-panel"><div class="se-row"><h3>Service client</h3><span class="se-pill">${v.situation==='loading'?'Rapport en préparation':v.situation==='partial'?'Rapport partiel':'Rapport disponible'}</span></div><div class="se-meta"><span>Exemple · 20 novembre 2026</span><span>5 réponses</span></div><p class="se-sub">Objectif : présenter une expérience.</p>${go('Ouvrir le rapport','report','secondary')}</article>`}</div>`;
      case 'report':
        if(v.situation==='loading'||v.situation==='failed')return `${title('Rapport · Service client',v.situation==='loading'?'Votre rapport est en préparation':'Le rapport est indisponible','Vos réponses restent accessibles dans la session.')}<div class="se-panel"><p class="se-sub">${v.situation==='loading'?'Les analyses sont en cours. Vous pouvez revenir plus tard.':'Vous pouvez demander une nouvelle tentative.'}</p><div class="se-actions">${button(v.situation==='loading'?'Actualiser le statut':'Réessayer le rapport','retry','secondary')}${go('Retrouver mes essais','history','quiet')}</div></div>`;
        return `${title('Rapport · Service client','Prochain objectif : préciser le résultat','Un point de travail à appliquer lors du prochain essai.')}${sampleNotice}${v.situation==='partial'?'<div class="se-note">Rapport partiel : le retour de la question 3 manque dans cet exemple. La réponse reste conservée, sans note de remplacement.</div>':''}<div class="se-grid"><article class="se-panel"><h3>À conserver</h3><p class="se-sub">Un exemple concret et une explication des actions.</p></article><article class="se-panel"><h3>À essayer ensuite</h3><p class="se-sub">Ajouter le résultat obtenu et ce qui a été appris.</p></article></div><div class="se-panel"><h3>Extrait de la réponse de démonstration</h3><blockquote class="se-quote">« La cliente a confirmé sa réception le lendemain. »</blockquote><p class="se-sub">Préciser comment la résolution de la demande a été vérifiée.</p><details><summary class="cursor-interaction">Comprendre les limites de ce retour</summary><div class="se-help-content"><p class="se-sub">Le retour concerne le texte. Il n’évalue ni la voix, ni la vidéo, ni les chances d’embauche.</p><p class="se-sub">Exercice et grille : version 1 · Coaching privé. Un retour IA peut contenir une erreur.</p></div></details></div><div class="se-actions">${button('Travailler ce point','scenario:Service client')}${go('Tous mes entraînements','history','secondary')}${button('Signaler une erreur','signal','quiet')}</div>${signalPanel(v)}`;
      case 'account': return `${title('Mon compte','Mes préférences et mes données','Retrouvez vos réglages et vos demandes.')}<div class="se-grid"><div class="se-panel"><h3>Mon objectif</h3><p class="se-sub">Entretien d’emploi · Service client et commerce · Burkina Faso</p>${go('Modifier mes préférences','preferences','secondary')}<div class="se-line"></div><h3>Mon accès</h3>${button('Obtenir de l’aide','support','secondary')}${go('Me déconnecter','welcome','quiet')}</div><div class="se-panel"><h3>Mes données</h3><p class="se-sub">Consultez la notice avant de demander un export ou une suppression.</p>${button('Consulter la confidentialité','privacy','quiet')}${button('Demander un export','export','secondary')}${button('Demander la suppression','delete','danger')}</div></div>${v.confirmDelete?`<div class="se-modal-backdrop" role="alertdialog" aria-label="Confirmer la demande de suppression"><h3>Confirmer votre demande ?</h3><p>La demande sera traitée selon les règles de conservation du service. Cette maquette ne supprime aucune donnée.</p><div class="se-actions">${button('Confirmer ma demande','confirm-delete','danger')}${button('Annuler','cancel-delete','secondary')}</div></div>`:''}`;
      default: return '';
    }
  }
  function signalPanel(v) {
    return v.signalOpen?`<div class="se-info"><h2>Qu’est-ce qui ne correspond pas ?</h2><label class="se-field">Motif du signalement<select><option>Le retour ne correspond pas à ma réponse</option><option>Le conseil est difficile à comprendre</option><option>Le contenu me semble inapproprié</option></select></label><div class="se-actions">${button('Envoyer le signalement','send-signal')}${button('Annuler','cancel-signal','secondary')}</div></div>`:'';
  }
  function infoPanel(v) {
    if(!v.info)return '';
    const data={privacy:['Confidentialité de mes essais','Le service prévu garde les réponses et les rapports dans votre espace privé. Le partage éventuel doit être un choix explicite.','Un brouillon sur un appareil partagé doit être effacé à la déconnexion. Les durées de conservation et les prestataires devront être précisés dans la notice avant le lancement.'],support:['Besoin d’un repère ?','Pour reprendre, ouvrez votre accueil ou votre historique. Un brouillon local doit être envoyé après le retour de la connexion.','Aucun microphone ni caméra n’est requis pour les exercices texte. Le canal de contact du pilote reste à définir.'],terms:['Conditions du service','SimuEmploi est un outil de préparation et de coaching. Il ne garantit pas une embauche.','Les conditions détaillées du pilote seront publiées avant l’ouverture du service.']};
    const [heading,...paragraphs]=data[v.info];
    return `<section class="se-info" aria-label="${heading}"><h2>${heading}</h2>${paragraphs.map(p=>`<p class="se-sub">${p}</p>`).join('')}${button('Fermer','close-info','secondary')}</section>`;
  }
  function render(v) {
    const active=['catalog','prepare'].includes(v.screen)?'catalog':['history','report','finish'].includes(v.screen)?'history':['account','preferences'].includes(v.screen)?'account':'home';
    const publicScreen=['welcome','login'].includes(v.screen);
    v.element.innerHTML=`<header class="se-top"><div class="se-brand"><span class="se-logo" aria-hidden="true">S</span>SimuEmploi<span class="se-country">Burkina Faso</span></div>${publicScreen?go('Mon espace','login','quiet'):`<button type="button" class="se-avatar cursor-interaction" data-action="go:account" aria-label="Ouvrir le compte d’exemple Aminata">AM</button>`}</header><div class="se-shell"><nav class="se-nav" aria-label="Navigation candidat">${[['home','Accueil','house'],['catalog','Exercices','notebook-pen'],['history','Historique','history'],['account','Mon compte','user-round']].map(([id,label,ic])=>`<button type="button" class="cursor-interaction" data-action="go:${id}" ${active===id?'aria-current="page"':''}>${icon(ic)}${label}</button>`).join('')}<div class="se-nav-note">Pratiquer à votre rythme.<br><br>Coaching privé</div></nav><main class="se-main" aria-label="Écran candidat"><div class="se-crumb"><span>${screens.find(s=>s[0]===v.screen)?.[1].replace(/^C\d+ · /,'')}</span><span>Espace candidat</span></div>${notices(v)}${content(v)}${infoPanel(v)}<footer class="se-footer"><span>Vos réponses vous appartiennent.</span><div class="se-actions">${button('Confidentialité','privacy','quiet')}${button('Aide','support','quiet')}</div></footer></main></div>`;
    v.element.style.setProperty('--se-radius',v.radius+'px');
    v.element.style.setProperty('--se-pad',v.density+'px');
    if(v.customAccent) {
      v.element.style.setProperty('--se-accent',v.accent);
      const hex=v.accent.slice(1),rgb=[0,2,4].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
      const lum=.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
      v.element.style.setProperty('--se-on-accent',lum>.18?'#102b2d':'#ffffff');
    }
    if(globalThis.lucide?.createIcons)globalThis.lucide.createIcons({attrs:{width:16,height:16}});
    syncStage();
  }
  function focusAfter(v,action,previousScreen) {
    let target;
    if(v.error)target=v.element.querySelector('textarea');
    else if(action==='delete')target=v.element.querySelector('[data-action="cancel-delete"]');
    else if(action==='cancel-delete')target=v.element.querySelector('[data-action="delete"]');
    else if(action==='signal')target=v.element.querySelector('.se-info select');
    else if(['privacy','support','terms'].includes(action))target=v.element.querySelector('[data-action="close-info"]');
    else if(action==='close-info')target=v.element.querySelector('[data-action="'+v.closedInfo+'"]');
    else if(['start','resume','resume-session','next'].includes(action)&&v.screen==='practice')target=v.element.querySelector('textarea');
    else if(previousScreen!==v.screen)target=v.element.querySelector('.se-main button');
    else target=[...v.element.querySelectorAll('[data-action]')].find(el=>el.dataset.action===action);
    target?.focus({preventScroll:true});
    root.querySelector('#se-route-status').textContent=v.error?'La réponse doit être complétée.':v.message||v.element.querySelector('h1')?.textContent||'';
  }
  variants.forEach(v=>{
    render(v);
    v.element.addEventListener('input',e=>{
      if(e.target.matches('[data-field="answer"]')) {
        v.answer=e.target.value;
        const counter=v.element.querySelector('[data-word-count]');
        if(counter)counter.textContent=v.answer.trim().split(/\s+/).filter(Boolean).length+' mots';
      }
    });
    v.element.addEventListener('change',e=>{
      if(e.target.matches('[data-field="domain"]')) {v.domain=e.target.value;render(v);v.element.querySelector('[data-field="domain"]').focus({preventScroll:true});}
    });
    v.element.addEventListener('click',e=>{
      const control=e.target.closest('[data-action]'); if(!control)return;
      const action=control.dataset.action,previousScreen=v.screen;
      v.message='';v.error=false;
      if(action.startsWith('go:')) {if(action==='go:practice'&&v.screen==='feedback')v.readOnly=true;v.screen=action.slice(3);v.confirmDelete=false;v.info='';v.signalOpen=false;}
      else if(action==='connect')v.screen='preferences';
      else if(action.startsWith('scenario:')) {v.preparedScenario=action.slice(9);v.screen='prepare';v.confirmRestart=false;}
      else if(action==='start'&&v.sessionStarted&&!v.finished)v.confirmRestart=true;
      else if(action==='start'||action==='start-new') {v.scenario=v.preparedScenario;v.screen='practice';v.question=1;v.answer='';v.paused=false;v.sessionStarted=true;v.finished=false;v.readOnly=false;v.confirmRestart=false;}
      else if(action==='pause')v.paused=true;
      else if(action==='resume')v.paused=false;
      else if(action==='resume-session') {v.screen=v.readOnly?'feedback':'practice';v.paused=false;v.confirmRestart=false;}
      else if(action==='submit') {
        if(v.readOnly)v.screen='feedback';
        else if(v.answer.trim().length<20) {v.error=true;v.message='Votre réponse est trop courte pour cet exemple. Ajoutez un contexte et expliquez votre démarche.';}
        else if(v.situation==='offline')v.message='Brouillon conservé sur cet appareil, en attente de synchronisation. Démonstration locale uniquement.';
        else {v.readOnly=true;v.screen='feedback';}
      }
      else if(action==='next') {if(v.question===5) {v.screen='finish';v.finished=true;}else{v.question++;v.screen='practice';v.answer='';v.readOnly=false;}}
      else if(action==='retry') {v.situation='normal';root.querySelector('#se-situation').value='normal';v.message='Statut normal simulé pour poursuivre la démonstration.';}
      else if(action==='reset-filter')v.domain='Tous les domaines';
      else if(action==='signal')v.signalOpen=true;
      else if(action==='cancel-signal')v.signalOpen=false;
      else if(action==='send-signal') {v.signalOpen=false;v.message='Signalement simulé. Aucune demande n’a été envoyée.';}
      else if(action==='export')v.message='Demande d’export simulée. Aucune demande n’a été envoyée.';
      else if(action==='delete')v.confirmDelete=true;
      else if(action==='cancel-delete')v.confirmDelete=false;
      else if(action==='confirm-delete') {v.confirmDelete=false;v.message='Demande de suppression simulée. Aucune donnée n’a été supprimée.';}
      else if(['privacy','support','terms'].includes(action))v.info=action;
      else if(action==='close-info') {v.closedInfo=v.info;v.info='';}
      selector.value=v.screen;render(v);focusAfter(v,action,previousScreen);save(v);
    });
    v.element.addEventListener('submit',e=>e.preventDefault());
    if(globalThis.Tweak) {
      const tweak=new Tweak({container:v.element,onChange:()=>{v.customAccent=true;render(v);}});
      tweak.addSlider(v,'radius',{label:'Arrondi des surfaces',min:8,max:24,unit:'px'});
      tweak.addSlider(v,'density',{label:'Espacement du contenu',min:16,max:32,unit:'px'});
      tweak.addColorPicker(v,'accent',{label:'Couleur des actions',reference:'--se-accent'});
    }
  });
  selector.addEventListener('change',()=>{variants.forEach(v=>{v.screen=selector.value;v.message='';v.error=false;v.confirmDelete=false;v.paused=false;v.readOnly=false;v.info='';v.signalOpen=false;render(v);});save(variants[0]);});
  root.querySelector('#se-situation').addEventListener('change',e=>{variants.forEach(v=>{v.situation=e.target.value;v.message='';v.error=false;render(v);});});
  window.addEventListener('openai:set_globals',e=>{
    const state=e.detail?.globals?.widgetState?.modelContent;
    if(state&&screens.some(s=>s[0]===state.screen)) {selector.value=state.screen;variants.forEach(v=>{v.screen=state.screen;render(v);});}
  });
  let lastWidth=0;
  const observer=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-lastWidth)>1){lastWidth=width;syncStage();}});
  observer.observe(root);
})();
