import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../../docs/sprints/S0-cloture/', import.meta.url));
const browser = await chromium.launch({ headless: true,
  ...(process.env.SIMUEMPLOI_CHROME ? { executablePath: process.env.SIMUEMPLOI_CHROME } : {}),
});
const page = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
page.setDefaultTimeout(8000);
const errors = [], network = [], checks = [];
page.on('pageerror', e => errors.push(e.message));
page.on('request', r => { if (/^https?:/.test(r.url())) network.push(r.url()); });
page.on('dialog', dialog => dialog.dismiss());
await mkdir(`${root}/captures`, { recursive: true });
await writeFile(`${root}/verification-maquettes.json`,JSON.stringify({
  checked_at:new Date().toISOString(),reference_version:'S0-0.4',status:'running',
  addendum_version:'API-0.1',
  scope:'Recette technique en cours ; aucune validation humaine.',
},null,2)+'\n');
const settle = () => page.evaluate(async () => {
  await Promise.all([...document.querySelectorAll('img')].map(img => img.decode().catch(() => {})));
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
});
try {
  await page.goto(pathToFileURL(`${root}/maquettes/candidat.html`).href);
  const screens = await page.locator('#se-screen option').evaluateAll(items => items.map(i => i.value));
  assert.equal(screens.length, 12);
  for (const width of [320, 360, 736, 1024]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const variant of ['se-guided', 'se-autonomous']) {
      await page.selectOption('#review-variant', variant);
      for (const screen of screens) {
        await page.selectOption('#se-screen', screen); await settle();
        const size = await page.evaluate(() => ({ w:innerWidth,s:document.documentElement.scrollWidth }));
        assert.ok(size.s <= size.w+1, `Overflow ${width}/${variant}/${screen}`);
        assert.equal(await page.locator(`#${variant} h1`).count(), 1);
        checks.push({ width, variant, screen, status:'passed' });
      }
    }
  }
  await page.selectOption('#review-variant', 'se-guided');
  await page.selectOption('#se-screen', 'catalog');
  const app=page.locator('#se-guided');
  assert.equal(await app.locator('[data-action^="scenario:"]').count(), 3);
  await app.locator('[data-action^="scenario:"]').first().click();
  await app.locator('[data-action="start"]').click();
  const firstQuestion=await app.locator('.se-question').innerText();
  await app.locator('textarea').fill('Je veux apprendre.');
  await app.locator('[data-action="submit"]').click();
  assert.equal(await app.locator('textarea').count(), 0, 'Nonempty brief answer should advance');
  assert.ok(!(await app.innerText()).includes('sur 5'), 'Feedback must keep variable progress');
  await app.locator('[data-action="next"]').click();
  const adaptiveQuestion=await app.locator('.se-question').innerText();
  assert.ok(adaptiveQuestion.includes('Je veux apprendre.'));
  await app.locator('.se-context summary').click();
  assert.ok((await app.locator('.se-context').innerText()).includes(firstQuestion));
  assert.ok((await app.locator('.se-context').innerText()).includes('Je veux apprendre.'));
  await app.locator('.se-help summary').click();
  const corpus=JSON.parse(await readFile(`${root}/corpus-relecture.json`,'utf8'));
  assert.ok((await app.innerText()).includes(corpus[0].questions[0].guidance[0]));
  await app.locator('textarea').fill('Mon exemple fictif de projet scolaire.');
  await page.selectOption('#se-situation','offline');
  await app.locator('[data-action="submit"]').click();
  assert.equal(await app.locator('textarea').inputValue(),'Mon exemple fictif de projet scolaire.');
  await page.selectOption('#se-situation','normal');
  await app.locator('[data-action="pause"]').click();
  await app.locator('[data-action="go:home"]').first().click();
  await app.locator('[data-action="resume-session"]').click();
  assert.equal(await app.locator('textarea').inputValue(),'Mon exemple fictif de projet scolaire.');
  await page.screenshot({path:`${root}/captures/02-question-ordinateur.png`,fullPage:true});
  await app.locator('[data-action="submit"]').click();
  await page.selectOption('#se-situation','next_failed');
  await app.locator('[data-action="next"]').click();
  assert.match(await app.innerText(),/Question suivante indisponible/);
  assert.equal(await app.locator('textarea').count(),0);
  await page.selectOption('#se-situation','next_loading');
  await app.locator('[data-action="next"]').click();
  assert.match(await app.innerText(),/Question suivante en préparation/);
  await page.selectOption('#se-situation','normal');
  await app.locator('[data-action="next"]').click();
  assert.ok((await app.locator('.se-question').innerText()).includes('Mon exemple fictif de projet scolaire.'));
  assert.ok((await app.locator('.se-question').innerText()).length<=700);
  assert.ok(!(await app.locator('.se-question').innerText()).includes(firstQuestion));
  await page.setViewportSize({width:360,height:1100});
  await settle();
  const adaptiveSize=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));
  assert.ok(adaptiveSize.s<=adaptiveSize.w+1,'Adaptive prompt must fit the mobile layout');
  await page.screenshot({path:`${root}/captures/04-question-adaptee-mobile.png`,fullPage:true});
  await page.setViewportSize({width:1024,height:1100});
  await page.screenshot({path:`${root}/captures/03-question-adaptee.png`,fullPage:true});
  checks.push({name:'Adaptation au précédent couple question/réponse, aide, coupure et reprise simulées',status:'passed'});
  checks.push({name:'Question suivante en panne/en attente : aucune nouvelle question imposée et reprise possible',status:'passed'});

  await page.goto(pathToFileURL(`${root}/maquettes/candidat.html`).href);
  await page.selectOption('#se-screen','catalog');
  await app.locator('[data-action^="scenario:"]').first().click();
  await app.locator('[data-action="start"]').click();
  await app.locator('textarea').fill('Je cherche un stage en vente.');
  await app.locator('[data-action="submit"]').click();
  await app.locator('[data-action="next"]').click();
  assert.notEqual(await app.locator('.se-question').innerText(),adaptiveQuestion);
  for(let n=0;n<7;n++) {
    if(!await app.locator('textarea').count())break;
    await app.locator('textarea').fill('Un exemple fictif assez précis pour avancer vers le prochain axe sans imposer une nouvelle relance de clarification.');
    await app.locator('[data-action="submit"]').click();
    await app.locator('[data-action="next"]').click();
  }
  assert.match(await app.innerText(),/Vous avez terminé/);
  checks.push({name:'Réponses différentes : relances différentes ; limite de tours et fin de démonstration',status:'passed'});

  await page.goto(pathToFileURL(`${root}/maquettes/medias.html`).href);
  for (const variant of ['sm-audio','sm-video']) {
    await page.selectOption('#review-variant',variant);
    await page.selectOption('#sm-screen','prepare'); await settle();
    assert.equal(await page.locator(`#${variant} h1`).count(),1);
  }
  checks.push({name:'Référence audio/vidéo ouvrable sans capture',status:'passed'});

  await page.goto(pathToFileURL(`${root}/atelier.html`).href);
  assert.equal(await page.getByRole('link',{name:'Comprendre les fournisseurs et API'}).getAttribute('href'),'09_FOURNISSEURS_IA_ET_UTILISATION_API.md');
  const routing=JSON.parse(await readFile(`${root}/ai-routing.proposal.json`,'utf8'));
  assert.equal(routing.execution_enabled,false);
  assert.equal(routing.production_configuration_complete,false);
  for(const provider of routing.providers) {
    assert.equal(provider.enabled,false);
    assert.deepEqual(provider.qualified_capabilities,[]);
    assert.equal(provider.model_id,null);
    assert.equal(provider.secret_reference,null);
  }
  checks.push({name:'Addendum fournisseur/API accessible et configurations candidates inactives',status:'passed'});
  await page.locator('nav [data-panel="api"]').click();
  assert.match(await page.locator('#api-plan').innerText(),/AgentRouter est le premier candidat à qualifier/);
  assert.equal(await page.getByRole('link',{name:'Lire l’évaluation AgentRouter'}).getAttribute('href'),'10_EVALUATION_AGENTROUTER.md');
  assert.equal(await page.locator('.api-flow li').count(),4);
  await page.setViewportSize({width:1024,height:1100});
  await page.screenshot({path:`${root}/captures/05-atelier-api-ordinateur.png`,fullPage:true});
  await page.setViewportSize({width:360,height:1100});
  await page.screenshot({path:`${root}/captures/06-atelier-api-mobile.png`,fullPage:true});
  await page.getByRole('button',{name:'Consigner mon avis sur les contrats'}).click();
  assert.equal(await page.locator('nav [data-panel="review"]').getAttribute('aria-current'),'page');
  assert.equal(await page.locator('[data-path="decisions_review.notes"]').evaluate(el=>el===document.activeElement),true);
  const currentEvidence=JSON.parse(await readFile(`${root}/preuves-humaines.json`,'utf8'));
  assert.equal(await page.locator('[data-path="decisions_review.verdict"]').inputValue(),currentEvidence.decisions_review.verdict);
  assert.equal(await page.locator('[data-path="product_review.verdict"]').inputValue(),'pending');
  assert.equal(await page.locator('#corpus .tag').filter({hasText:'avis métier approuvé le 22/11/2026'}).count(),3);
  checks.push({name:'Étape IA/API : priorité affichée et accès à l’avis sans approbation automatique',status:'passed'});
  assert.equal(await page.locator('#corpus article.card').count(),3);
  for (const width of [320,360,1024]) {
    await page.setViewportSize({width,height:1100});
    for (const panel of ['corpus','api','team','tests','review']) {
      await page.locator(`nav [data-panel="${panel}"]`).click();
      const size=await page.evaluate(()=>({w:innerWidth,s:document.documentElement.scrollWidth}));
      assert.ok(size.s<=size.w+1,`Atelier overflow ${width}/${panel}`);
    }
  }
  await page.locator('[data-panel="tests"]').click();
  assert.match(await page.locator('#tests').innerText(),/Aucune observation/);
  assert.match(await page.locator('#tests').innerText(),/Première boucle prévue le 22\/11\/2026/);
  await page.getByRole('link',{name:'Ouvrir la maquette pour la séance'}).waitFor();
  await page.locator('#add-session').click();
  assert.equal(await page.locator('#tests select[data-path$=".outcome"]').count(),10);
  assert.equal(await page.locator('#tests select[data-path$=".outcome"]').first().inputValue(),'not_run');
  assert.equal(await page.locator('[data-path="participant_sessions.0.observed_at"]').inputValue(),'');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('#export').click();
  const download=await downloadPromise;
  const exported=JSON.parse(await readFile(await download.path(),'utf8'));
  assert.equal(exported.participant_sessions[0].participation_agreed,false);
  assert.deepEqual(exported.business_reviews,currentEvidence.business_reviews);
  assert.deepEqual(exported.decisions_review,currentEvidence.decisions_review);
  assert.deepEqual(exported.design_review,currentEvidence.design_review);
  assert.deepEqual(exported.backlog_review,currentEvidence.backlog_review);
  assert.deepEqual(exported.developers,currentEvidence.developers);
  assert.deepEqual(exported.api_qualification_plan,currentEvidence.api_qualification_plan);
  assert.deepEqual(exported.candidate_test_plan,currentEvidence.candidate_test_plan);
  assert.equal(exported.api_qualification_plan.execution_enabled,false);
  checks.push({name:'Date planifiée et choix candidat préservés dans l’export, sans date observée ni accord inventés',status:'passed'});
  assert.equal(exported.product_review.verdict,currentEvidence.product_review.verdict);
  assert.equal(exported.responsible_product,'OUOBA Abdou Rasmané');
  for (const role of Object.values(exported.developers)) assert.equal(role.availability_hours_per_sprint,24);
  // This is a synthetic UI exercise. The download never replaces human evidence.
  checks.push({name:'Atelier : états vierges, export réel sans avis ni séance inventés',status:'passed'});
  await page.locator('#import').setInputFiles(await download.path());
  await page.getByText('Fichier repris dans cette page ; relisez puis exportez après modification.').waitFor();
  assert.match(await page.locator('#message').innerText(),/Fichier repris/);
  checks.push({name:'Reprise locale d’un export, sans transmission',status:'passed'});
  const fixtureDir=fileURLToPath(new URL('../../../tmp/s0-fixtures/',import.meta.url));
  await mkdir(fixtureDir,{recursive:true});
  const syntheticSession=code=>({participant_code:code,facilitator:'SYNTHETIC QA',observed_at:new Date().toISOString().slice(0,10),device:'Synthetic device',objective:'internship',participation_agreed:true,summary:'Synthetic automated fixture, never a real session',tasks:Array.from({length:10},(_,i)=>({id:'T'+String(i+1).padStart(2,'0'),outcome:'success',observation:'Synthetic QA only'}))});
  const importFixture=async (name,value)=>{
    const path=`${fixtureDir}/${name}.synthetic.json`;
    await writeFile(path,JSON.stringify(value,null,2)+'\n');
    await page.locator('#import').setInputFiles(path);
    await page.getByText('Fichier repris dans cette page ; relisez puis exportez après modification.').waitFor();
  };
  const incomplete=structuredClone(currentEvidence);
  incomplete.participant_sessions=[syntheticSession('P01'),syntheticSession('P03'),syntheticSession('P03')];
  incomplete.participant_sessions[0].facilitator='';
  await importFixture('incomplete-and-duplicate',incomplete);
  await page.locator('nav [data-panel="review"]').click();
  assert.match(await page.locator('#completeness').innerText(),/1\/3 personnes/);
  assert.match(await page.locator('#completeness').innerText(),/1 code\(s\) répété/);
  incomplete.participant_sessions[1].observed_at='2099-01-01';
  incomplete.participant_sessions[2].observed_at='2026-02-30';
  await importFixture('invalid-dates',incomplete);
  assert.match(await page.locator('#completeness').innerText(),/0\/3 personnes/);
  checks.push({name:'Collecte : fiche incomplète, dates invalides/futures et doublons non comptés comme trois personnes',status:'passed'});
  const imported=structuredClone(currentEvidence);
  imported.participant_sessions=[syntheticSession('P01'),syntheticSession('P03')];
  await importFixture('non-sequential-codes',imported);
  await page.locator('nav [data-panel="tests"]').click();
  await page.locator('#add-session').click();
  assert.equal(await page.locator('[data-path="participant_sessions.2.participant_code"]').inputValue(),'P02');
  assert.equal(await page.locator('[data-path="participant_sessions.2.observed_at"]').inputValue(),'');
  assert.equal(await page.locator('[data-path="participant_sessions.2.participation_agreed"]').isChecked(),false);
  checks.push({name:'Collecte : code participant libre après import, nouvelle fiche sans accord ni date inventés',status:'passed'});
  await importFixture('restore-current-evidence',currentEvidence);
  await page.locator('#export').click(); // mark clean before leaving
  await page.setViewportSize({width:1024,height:1100});
  await page.locator('[data-panel="corpus"]').click();
  await page.screenshot({path:`${root}/captures/01-atelier-relecture.png`,fullPage:true});
  assert.deepEqual(errors,[]); assert.deepEqual(network,[]);
  await writeFile(`${root}/verification-maquettes.json`,JSON.stringify({
    checked_at:new Date().toISOString(),reference_version:'S0-0.4',status:'passed',
    addendum_version:'API-0.1',
    browser:browser.version(),checks,external_network_requests:network,
    scope:'Contrôles techniques de maquettes et formulaire ; aucun candidat réel ni avis humain simulé dans le registre.',
  },null,2)+'\n');
  console.log(`${checks.length} contrôles S0 réussis ; aucun résultat candidat créé.`);
} catch(error) {
  await writeFile(`${root}/verification-maquettes.json`,JSON.stringify({
    checked_at:new Date().toISOString(),reference_version:'S0-0.4',status:'failed',
    addendum_version:'API-0.1',
    error:error.message,completed_checks:checks,external_network_requests:network,
    scope:'Échec de recette technique ; aucun résultat candidat créé.',
  },null,2)+'\n');
  throw error;
} finally { await browser.close(); }
