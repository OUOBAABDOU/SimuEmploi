/* Demonstration guide. No remote collection, persistence or AI calls. */
const $ = id => document.getElementById(id);
const tasks = [
  ['T01', 'Comprendre le service', 'Expliquez avec vos mots à quoi sert SimuEmploi et ce qu’il ne garantit pas.', 'La préparation et la limite concernant l’embauche sont-elles comprises ?', 'welcome', 'normal'],
  ['T02', 'Choisir son exercice', 'Trouvez un exercice pour un premier stage ou emploi, puis lisez son objectif.', 'Le choix, le filtre et les mots employés sont-ils clairs ?', 'catalog', 'normal'],
  ['T03', 'Répondre et trouver une aide', 'Commencez l’exercice, écrivez une réponse fictive et cherchez l’aide pour cette question.', 'Le bouton principal et l’aide sont-ils trouvés ? Un projet scolaire suffit-il ?', 'prepare', 'normal'],
  ['T04', 'Comprendre une coupure', 'L’animateur simule une coupure. Essayez de valider et expliquez où se trouve votre réponse.', 'Un brouillon dans la maquette est-il distingué d’une sauvegarde serveur ?', 'practice', 'offline'],
  ['T05', 'Faire une pause et revenir', 'Faites une pause, allez à l’accueil puis retrouvez votre réponse.', 'La reprise est-elle trouvée sans remplacer la réponse fictive ?', 'practice', 'normal'],
  ['T06', 'Un retour indisponible', 'Après validation simulée, le retour est indisponible. Expliquez ce que vous pouvez faire.', 'La conservation de la réponse et la disponibilité du retour sont-elles distinguées ?', 'feedback', 'failed'],
  ['T07', 'Lire un rapport partiel', 'Lisez le rapport partiel et choisissez un point à retravailler.', 'Les manques, le conseil et l’absence de note globale sont-ils compris ?', 'report', 'partial'],
  ['T08', 'Annuler une suppression', 'Trouvez la demande de suppression dans le compte et annulez-la.', 'La confirmation est-elle compréhensible et annulable ?', 'account', 'normal'],
  ['T09', 'Comprendre la relance', 'Validez une réponse fictive et demandez la suivante. Expliquez le lien avec le tour précédent.', 'La question précédente et votre réponse sont-elles utilisées ? La règle locale est-elle comprise ?', 'prepare', 'normal'],
  ['T10', 'Réessayer une question', 'La question suivante est indisponible. Retrouvez la réponse et la possibilité de réessayer.', 'L’attente de question est-elle distinguée du retour ? La réponse reste-t-elle visible ?', 'prepare', 'normal'],
];
const otherGuides = {
  application: [
    ['A01', 'Découvrir l’application', 'Ouvrez l’accueil, puis choisissez votre premier exercice.', 'Le rôle du service et les fonctions disponibles sont-ils clairs ?', '/application/'],
    ['A02', 'Filtrer le catalogue', 'Choisissez Premier emploi ou stage puis Présentation de mon parcours.', 'Deux exercices puis un exercice doivent apparaître ; les données viennent de l’API Python.', '/application/#/exercices'],
    ['A03', 'Préparer une réponse', 'Ouvrez un exercice, puis dépliez une question et ses repères.', 'Les cinq questions sont consultables ; aucune séance réelle n’est encore ouverte.', '/application/#/exercices/11111111-1111-4111-8111-111111111111'],
  ],
  media: [
    ['M01', 'Choisir audio ou vidéo', 'Comparez les deux présentations et les modes enregistré / direct.', 'Ce sont des maquettes futures, sans capture ni transcription réelles.', 'prepare'],
    ['M02', 'Comprendre les réglages', 'Ouvrez Micro et caméra ; simulez un microphone indisponible.', 'Une solution de secours en texte doit être trouvable.', 'setup'],
    ['M03', 'Relire une prise', 'Explorez l’enregistrement puis la relecture d’une prise fictive.', 'Recommencer, relire et confirmer doivent être distingués.', 'review'],
    ['M04', 'Explorer le direct', 'Explorez Entretien en direct puis Fin de l’entretien.', 'Le temps, la coupure et la fin doivent être compris ; aucun appel audio/vidéo réel.', 'live'],
  ],
};
const modes = {
  candidate: { title: 'Parcours candidat · maquette S0', note: 'Aucune IA, aucun compte et aucune sauvegarde serveur.', url: '/maquettes/candidat.html' },
  application: { title: 'Application actuelle · catalogue réel', note: 'Frontend construit + API Python locale. Préparation uniquement.', url: '/application/' },
  media: { title: 'Audio et vidéo · maquettes futures', note: 'Aucun accès au micro ou à la caméra ; dialogue simulé.', url: '/maquettes/medias.html' },
};
let mode = 'candidate', current = 0, started = null, dirty = false, flowTimer = null;
const observations = Object.fromEntries(tasks.map(t => [t[0], { outcome: 'not_observed', observation: '', example_shown: false }]));
const extras = {};
$('session-code').value = 'S0-' + crypto.randomUUID().slice(0, 8).toUpperCase();
const list = () => mode === 'candidate' ? tasks : otherGuides[mode];
const key = () => list()[current][0];
const entry = () => mode === 'candidate' ? observations[key()] : (extras[key()] ??= { outcome: 'not_observed', observation: '', example_shown: false });
function updateProgress() {
  const n = Object.values(observations).filter(v => v.outcome !== 'not_observed' && v.observation.trim()).length;
  $('progress').textContent = `${n} / 10 tâches renseignées`;
}
function storeNote() {
  if (!started) return;
  entry().outcome = $('outcome').value;
  entry().observation = $('observation').value;
  dirty = true;
  updateProgress();
}
function showTask() {
  const t = list()[current];
  $('task-id').textContent = t[0] + (mode === 'candidate' ? ' · Essai S0' : ' · Exploration complémentaire');
  $('task-title').textContent = t[1]; $('instruction').textContent = t[2]; $('observation-help').textContent = t[3];
  $('outcome').value = entry().outcome; $('observation').value = entry().observation;
  $('example-status').textContent = 'L’exemple n’ajoute aucun résultat à votre compte rendu.';
  $('previous').disabled = current === 0; $('next').disabled = current === list().length - 1;
  $('task-list').replaceChildren(...list().map((task, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = task[0];
    b.className = i === current ? 'active' : ''; b.setAttribute('aria-label', task[0] + ' : ' + task[1]);
    if (i === current) b.setAttribute('aria-current', 'step');
    b.onclick = () => { storeNote(); current = i; showTask(); };
    return b;
  }));
}
function setMode(next) {
  storeNote(); mode = next; current = 0;
  const m = modes[mode];
  $('stage-title').textContent = m.title; $('stage-note').textContent = m.note; $('open-demo').href = m.url;
  $('demo-frame').src = m.url;
  document.querySelectorAll('.mode-tabs button').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
    b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  });
  showTask();
}
document.querySelectorAll('.mode-choice').forEach(b => b.onclick = () => {
  setMode(b.dataset.mode); document.querySelector('.workspace').scrollIntoView({ block: 'start' });
});
$('previous').onclick = () => { storeNote(); if (current > 0) { current--; showTask(); } };
$('next').onclick = () => { storeNote(); if (current < list().length - 1) { current++; showTask(); } };
$('outcome').onchange = storeNote; $('observation').oninput = storeNote;
$('summary').oninput = () => { dirty = true; };
$('start-form').onsubmit = e => {
  e.preventDefault();
  if (started) { $('session-status').textContent = 'Une séance est déjà en cours. Téléchargez vos notes avant de recharger pour un autre essai.'; return; }
  started = { code: $('session-code').value, started_at: new Date().toISOString(), country: $('country').value,
    objective: $('objective').value, role: $('role').value, participation_agreed: true,
    device: innerWidth < 780 ? 'écran mobile / tablette' : 'écran ordinateur',
    capture: 'fictitious_answers_only_no_audio_video', collection: 'browser_memory_then_manual_download' };
  for (const id of ['outcome', 'observation', 'summary', 'download', 'finish']) $(id).disabled = false;
  for (const id of ['country', 'objective', 'role', 'consent']) $(id).disabled = true;
  $('session-status').textContent = `Séance ${started.code} démarrée. Aucune observation n’est préremplie.`;
  dirty = true; document.querySelector('.workspace').scrollIntoView({ block: 'start' });
};
function select(doc, id, value) {
  const el = doc.getElementById(id);
  if (!el) throw new Error('La maquette est encore en cours de chargement.');
  el.value = value; el.dispatchEvent(new Event('change', { bubbles: true }));
}
function click(doc, action) {
  const el = doc.querySelector(`#se-guided [data-action="${action}"]`);
  if (!el) throw new Error('Attendez que la maquette soit chargée, puis réessayez.');
  el.click();
}
function answer(doc, text) {
  const el = doc.querySelector('#se-guided textarea');
  if (!el) throw new Error('Le champ de réponse n’est pas disponible.');
  el.value = text; el.dispatchEvent(new Event('input', { bubbles: true }));
}
function practice(doc) {
  select(doc, 'se-situation', 'normal'); select(doc, 'se-screen', 'catalog');
  const options = [...doc.querySelectorAll('#se-guided [data-action]')];
  const chosen = options.find(e => e.dataset.action.startsWith('scenario:') && e.dataset.action.includes('stage'));
  if (!chosen) throw new Error('Exercice de stage absent de la maquette.');
  chosen.click();
  const start = doc.querySelector('#se-guided [data-action="start"]');
  if (start) start.click();
  const replace = doc.querySelector('#se-guided [data-action="start-new"]');
  if (replace) replace.click();
  answer(doc, 'Je souhaite découvrir ce métier grâce à un stage.');
}
function example() {
  const doc = $('demo-frame').contentDocument;
  if (!doc) throw new Error('La démonstration est encore en cours de chargement.');
  if (mode === 'application') {
    $('demo-frame').src = list()[current][4]; $('open-demo').href = list()[current][4];
  } else if (mode === 'media') {
    select(doc, 'review-variant', 'sm-audio'); select(doc, 'sm-situation', current === 1 ? 'no-mic' : 'normal');
    select(doc, 'sm-screen', list()[current][4]);
  } else {
    select(doc, 'review-variant', 'se-guided');
    const id = key(); select(doc, 'se-situation', 'normal');
    if (['T03', 'T04', 'T05', 'T06', 'T09', 'T10'].includes(id)) practice(doc);
    else select(doc, 'se-screen', list()[current][4]);
    if (id === 'T03') { const help = doc.querySelector('#se-guided .se-help'); if (help) help.open = true; }
    if (id === 'T04') { select(doc, 'se-situation', 'offline'); click(doc, 'submit'); }
    if (id === 'T05') { click(doc, 'pause'); click(doc, 'go:home'); }
    if (id === 'T06') { click(doc, 'submit'); select(doc, 'se-situation', 'failed'); }
    if (id === 'T07') select(doc, 'se-situation', 'partial');
    if (id === 'T08') click(doc, 'delete');
    if (id === 'T09') { click(doc, 'submit'); click(doc, 'next'); const context = doc.querySelector('#se-guided .se-context'); if (context) context.open = true; }
    if (id === 'T10') { click(doc, 'submit'); select(doc, 'se-situation', 'next_failed'); click(doc, 'next'); }
  }
  entry().example_shown = true;
  $('example-status').textContent = 'Exemple fictif affiché. Essayez ensuite vous-même et notez seulement ce que vous observez. Les observations restent vides.';
}
$('show-example').onclick = () => {
  try { example(); } catch (error) { $('example-status').textContent = error.message; }
};
function missing() {
  const ids = tasks.filter(t => observations[t[0]].outcome === 'not_observed' || !observations[t[0]].observation.trim()).map(t => t[0]);
  if (!$('summary').value.trim()) ids.push('bilan');
  return ids;
}
$('finish').onclick = () => {
  storeNote(); const gaps = missing();
  $('report-status').textContent = gaps.length ? 'Séance incomplète : renseignez ' + gaps.join(', ') + '. Vous pouvez télécharger les notes partielles.'
    : 'Les dix tâches et le bilan sont renseignés. Le coordinateur doit encore relire ce compte rendu et attester le contexte réel ; S0 n’est pas reçu automatiquement.';
};
$('download').onclick = () => {
  if (!started) return; storeNote();
  const gaps = missing();
  const report = { schema: 'simuemploi.demo-observations.v1', reference_version: 'S0-0.4',
    source: 'remote_or_local_self_report_not_validated', exported_at: new Date().toISOString(),
    session: started, tasks: tasks.map(t => ({ id: t[0], instruction: t[2], ...observations[t[0]] })),
    complementary_explorations: extras, summary: $('summary').value.trim(), complete: gaps.length === 0,
    missing: gaps, s0_received: false, human_review_required: true };
  const blob = new Blob([JSON.stringify(report, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = `SimuEmploi_${started.code}_observations.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); dirty = false;
  $('report-status').textContent = 'Téléchargement demandé. Vérifiez le fichier dans vos téléchargements et remettez-le au coordinateur. ' + (gaps.length ? 'Ce compte rendu est partiel.' : 'Ce compte rendu attend une relecture humaine.');
};
window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
$('play-flow').onclick = () => {
  if (flowTimer) { clearInterval(flowTimer); flowTimer = null; }
  let n = 0;
  const captions = ['Choisissez un premier stage ou emploi. Aucune expérience salariée n’est obligatoire.',
    'Écrivez une réponse inventée. La relance de maquette suit une règle locale, sans IA.',
    'Observez ce qui est clair ou difficile. Un exemple automatique ne vaut pas résultat humain.',
    'Téléchargez vos notes. Le coordinateur les relit avant toute décision de réception S0.'];
  function tick() {
    document.querySelectorAll('[data-flow]').forEach(el => el.classList.toggle('active', Number(el.dataset.flow) === n));
    $('flow-caption').textContent = captions[n]; n++;
    if (n === 4 && flowTimer) { clearInterval(flowTimer); flowTimer = null; }
  }
  tick();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) flowTimer = setInterval(tick, 2400);
  $('flow').scrollIntoView({ block: 'center' });
};
showTask();
