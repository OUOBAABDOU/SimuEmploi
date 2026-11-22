const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/OUOBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const source = 'C:/Users/OUOBA/.codex/visualizations/2026/11/20/01a1f789-baf8-7061-83a2-6d905aae83c4/simuemploi-candidat.html';
const output = path.join(root, 'docs/candidat/visuels');
let activeBrowser;

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  activeBrowser = browser;
  const page = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setContent(fs.readFileSync(source, 'utf8'));
  await page.addStyleTag({ content: 'body { margin:0; color-scheme:light; } [hidden] {display:none!important;}' });
  const settle = async () => page.evaluate(async()=>{
    await Promise.all([...document.querySelectorAll('img')].map(img=>img.decode().catch(()=>{})));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  const screens = await page.locator('#se-screen option').evaluateAll(nodes => nodes.map(n => n.value));
  const layoutChecks = [];
  for (const width of [320, 360, 736, 1024]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const variant of ['se-guided', 'se-autonomous']) {
      await page.evaluate(id => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#' + id); }); }, variant);
      for (const screen of screens) {
        await page.selectOption('#se-screen', screen);
        await settle();
        const dimensions = await page.locator('#' + variant).evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth, pageWidth: document.documentElement.clientWidth, pageScroll: document.documentElement.scrollWidth }));
        assert(dimensions.scrollWidth <= dimensions.width + 1, `Débordement ${variant}/${screen}/${width}`);
        if (dimensions.pageScroll > dimensions.pageWidth + 1) {
          process.stderr.write(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map(e => ({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).slice(0,12)), null, 2) + '\n');
        }
        assert(dimensions.pageScroll <= dimensions.pageWidth + 1, `Page débordante ${variant}/${screen}/${width}`);
        assert(await page.locator('#' + variant + ' h1').count(), `Titre absent ${screen}`);
        const images = await page.locator('#' + variant + ' img').evaluateAll(nodes=>nodes.map(img=>({loaded:img.complete&&img.naturalWidth>0,alt:img.getAttribute('alt')})));
        assert(images.every(img=>img.loaded&&img.alt!==null), `Image absente ou alternative manquante ${screen}/${width}`);
        assert(await page.locator('#'+variant+' .se-avatar').evaluateAll(nodes=>nodes.every(el=>el.scrollHeight<=el.clientHeight+1)),`Initiales débordantes ${screen}/${width}`);
        layoutChecks.push({ width, variant, screen, valid: true });
      }
    }
  }
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.evaluate(() => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#se-guided'); }); });
  const guided = page.locator('#se-guided');
  await page.selectOption('#se-screen', 'home');
  await guided.locator('[data-action="scenario:Service client"]').first().click();
  await guided.locator('[data-action="start"]').click();
  assert.match(await guided.innerText(), /Question 1 sur 5/);
  assert.equal(await guided.locator('textarea').inputValue(), '', 'Le nouvel essai commence sans réponse imposée');
  assert.equal(await guided.locator('textarea').evaluate(el=>el===document.activeElement), true);
  await guided.locator('textarea').fill('Court');
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /trop courte/);
  assert.equal(await guided.locator('textarea').getAttribute('aria-invalid'), 'true');
  assert.equal(await guided.locator('[role="alert"]').count(), 1);
  await guided.locator('textarea').fill('Dans mon stage, j’ai expliqué une demande au client puis vérifié le résultat avec mon responsable.');
  await page.selectOption('#se-situation', 'offline');
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /en attente de synchronisation/);
  assert(await guided.locator('textarea').count());
  await page.selectOption('#se-situation', 'normal');
  await guided.locator('[data-action="pause"]').click();
  assert.match(await guided.innerText(), /Session en pause/);
  await guided.locator('[data-action="go:home"]').first().click();
  assert.match(await guided.innerText(), /Mon entraînement en cours/i);
  await guided.locator('[data-action="resume-session"]').click();
  assert.match(await guided.locator('textarea').inputValue(), /Dans mon stage/);
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /Un retour pour votre prochain essai/);
  assert.match(await guided.innerText(), /retour est fictif/);
  await guided.locator('[data-action="go:home"]').first().click();
  await guided.locator('[data-action="resume-session"]').click();
  assert.match(await guided.innerText(), /Un retour pour votre prochain essai/);
  await guided.locator('[data-action="signal"]').click();
  await guided.locator('[data-action="send-signal"]').click();
  assert.match(await guided.innerText(), /Aucune demande n’a été envoyée/);
  await guided.locator('[data-action="go:practice"]').click();
  assert.equal(await guided.locator('textarea').getAttribute('readonly'), '');
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /Un retour pour votre prochain essai/);
  await guided.locator('[data-action="next"]').click();
  assert.match(await guided.innerText(), /Question 2 sur 5/);
  assert.equal(await guided.locator('textarea').inputValue(), '');
  await page.selectOption('#se-screen', 'report');
  await page.selectOption('#se-situation', 'partial');
  assert.match(await guided.innerText(), /Rapport partiel/);
  await page.selectOption('#se-screen', 'account');
  await guided.locator('[data-action="delete"]').click();
  assert(await guided.locator('[role="alertdialog"]').count());
  await guided.locator('[data-action="cancel-delete"]').click();
  assert.equal(await guided.locator('[role="alertdialog"]').count(), 0);
  assert.equal(await guided.locator('[data-action="delete"]').evaluate(el=>el===document.activeElement),true);
  await guided.locator('[data-action="privacy"]').first().click();
  assert.match(await guided.innerText(), /Confidentialité de mes essais/);
  await guided.locator('[data-action="close-info"]').click();
  await page.selectOption('#se-screen', 'catalog');
  await guided.locator('[data-field="domain"]').selectOption({label:'Logistique'});
  assert.match(await guided.innerText(), /Aucun exercice dans ce domaine/);
  await guided.locator('[data-action="reset-filter"]').click();
  assert.equal(await guided.locator('[data-exercises] article').count(),4);
  await guided.locator('[data-field="domain"]').selectOption({label:'Administration'});
  assert.equal(await guided.locator('[data-exercises] article').count(),1);
  await guided.locator('[data-action="scenario:Assistant administratif"]').click();
  await guided.locator('[data-action="start"]').click();
  assert.match(await guided.innerText(), /Un entraînement est déjà en cours/);
  await guided.locator('[data-action="resume-session"]').click();
  assert.match(await guided.innerText(), /Service client/);
  await page.selectOption('#se-screen','catalog');
  await guided.locator('[data-action="scenario:Assistant administratif"]').click();
  await guided.locator('[data-action="start"]').click();
  await guided.locator('[data-action="start-new"]').click();
  assert.match(await guided.innerText(), /organisé plusieurs tâches/);
  await guided.locator('details summary').click();
  assert.match(await guided.innerText(), /Votre démarche/);
  const stateChecks=[];
  await page.setViewportSize({width:320,height:1100});
  for(const situation of ['empty','loading','offline','failed','partial']) {
    await page.selectOption('#se-situation',situation);
    for(const screen of ['home','practice','feedback','history','report','account']) {
      await page.selectOption('#se-screen',screen);
      await settle();
      assert(await guided.evaluate(el=>el.scrollWidth<=el.clientWidth+1),`Débordement état ${situation}/${screen}`);
      stateChecks.push({situation,screen,width:320});
    }
  }
  await page.selectOption('#se-situation','normal');
  await page.selectOption('#se-screen','catalog');
  await guided.locator('[data-field="domain"]').selectOption({label:'Tous les domaines'});
  const captures = [
    { name: 'accueil-guide-desktop', screen: 'home', width: 1024, variant: 'se-guided', situation: 'normal' },
    { name: 'simulation-guide-mobile', screen: 'practice', width: 360, variant: 'se-guided', situation: 'normal' },
    { name: 'accueil-autonome-desktop', screen: 'home', width: 1024, variant: 'se-autonomous', situation: 'normal' },
    { name: 'rapport-partiel-mobile', screen: 'report', width: 360, variant: 'se-guided', situation: 'partial' },
    { name: 'decouverte-mobile', screen: 'welcome', width: 360, variant: 'se-guided', situation: 'normal' },
    { name: 'catalogue-illustre-desktop', screen: 'catalog', width: 1024, variant: 'se-guided', situation: 'normal' },
    { name: 'fin-session-mobile', screen: 'finish', width: 360, variant: 'se-guided', situation: 'normal' }
  ];
  for (const capture of captures) {
    await page.setViewportSize({ width: capture.width, height: 1100 });
    await page.evaluate(id => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#' + id); }); }, capture.variant);
    await page.selectOption('#se-screen', capture.screen);
    await page.selectOption('#se-situation', capture.situation);
    await settle();
    if(capture.screen==='practice')await page.locator('#'+capture.variant+' details').evaluate(el=>{el.open=true;});
    await page.locator('#' + capture.variant).screenshot({ path: path.join(output, capture.name + '.png') });
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addStyleTag({ content: 'body { color-scheme:dark; }' });
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.selectOption('#se-screen', 'home');
  await page.selectOption('#se-situation', 'normal');
  await settle();
  await guided.screenshot({ path: path.join(output, 'accueil-guide-sombre.png') });
  assert.equal(errors.length, 0, errors.join('\n'));
  const result = { version:'0.2', nature: 'Contrôle de maquettes locales ; aucune application ni API testée', screens: screens.length, variants: 2, layoutChecks: layoutChecks.length, degradedStateChecks:stateChecks.length, images:'Décodage et présence des alternatives contrôlés sur les écrans', browserErrors: errors, widths: [320, 360, 736, 1024], interactions: ['navigation', 'nouvel essai sans réponse imposée', 'validation locale et focus', 'coupure réseau', 'reprise depuis accueil avec texte conservé en mémoire', 'relecture finale en lecture seule et reprise du retour', 'confirmation avant remplacement du brouillon de démonstration', 'question suivante', 'retour explicitement fictif', 'signalement simulé', 'rapport partiel', 'annulation suppression et retour du focus', 'confidentialité ouvrable', 'filtre vide et réinitialisation', 'question et aide selon exercice'], screenshots: [...captures.map(c => c.name + '.png'), 'accueil-guide-sombre.png'] };
  fs.writeFileSync(path.join(root, 'docs/candidat/verification-maquettes.json'), JSON.stringify(result, null, 2) + '\n');
  await browser.close();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
})().catch(async error => { if(activeBrowser) await activeBrowser.close(); process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
