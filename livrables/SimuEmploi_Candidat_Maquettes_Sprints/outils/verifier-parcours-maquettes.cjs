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
  const screens = await page.locator('#se-screen option').evaluateAll(nodes => nodes.map(n => n.value));
  const layoutChecks = [];
  for (const width of [320, 360, 736, 1024]) {
    await page.setViewportSize({ width, height: 1100 });
    for (const variant of ['se-guided', 'se-autonomous']) {
      await page.evaluate(id => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#' + id); }); }, variant);
      for (const screen of screens) {
        await page.selectOption('#se-screen', screen);
        const dimensions = await page.locator('#' + variant).evaluate(el => ({ width: el.clientWidth, scrollWidth: el.scrollWidth, pageWidth: document.documentElement.clientWidth, pageScroll: document.documentElement.scrollWidth }));
        assert(dimensions.scrollWidth <= dimensions.width + 1, `Débordement ${variant}/${screen}/${width}`);
        if (dimensions.pageScroll > dimensions.pageWidth + 1) {
          process.stderr.write(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map(e => ({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).slice(0,12)), null, 2) + '\n');
        }
        assert(dimensions.pageScroll <= dimensions.pageWidth + 1, `Page débordante ${variant}/${screen}/${width}`);
        assert(await page.locator('#' + variant + ' h1').count(), `Titre absent ${screen}`);
        layoutChecks.push({ width, variant, screen, valid: true });
      }
    }
  }
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.evaluate(() => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#se-guided'); }); });
  const guided = page.locator('#se-guided');
  await page.selectOption('#se-screen', 'home');
  await guided.locator('[data-action="go:prepare"]').first().click();
  await guided.locator('[data-action="start"]').click();
  assert.match(await guided.innerText(), /Question 1 sur 5/);
  await guided.locator('textarea').fill('Court');
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /trop courte/);
  await guided.locator('textarea').fill('Dans mon stage, j’ai expliqué une demande au client puis vérifié le résultat avec mon responsable.');
  await page.selectOption('#se-situation', 'offline');
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /en attente de synchronisation/);
  assert(await guided.locator('textarea').count());
  await page.selectOption('#se-situation', 'normal');
  await guided.locator('[data-action="pause"]').click();
  assert.match(await guided.innerText(), /Session en pause/);
  await guided.locator('[data-action="resume"]').click();
  await guided.locator('[data-action="submit"]').click();
  assert.match(await guided.innerText(), /Un retour pour votre prochain essai/);
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
  const captures = [
    { name: 'accueil-guide-desktop', screen: 'home', width: 1024, variant: 'se-guided', situation: 'normal' },
    { name: 'simulation-guide-mobile', screen: 'practice', width: 360, variant: 'se-guided', situation: 'normal' },
    { name: 'accueil-autonome-desktop', screen: 'home', width: 1024, variant: 'se-autonomous', situation: 'normal' },
    { name: 'rapport-partiel-mobile', screen: 'report', width: 360, variant: 'se-guided', situation: 'partial' }
  ];
  for (const capture of captures) {
    await page.setViewportSize({ width: capture.width, height: 1100 });
    await page.evaluate(id => { document.querySelectorAll('[data-variant]').forEach(s => { s.hidden = !s.querySelector('#' + id); }); }, capture.variant);
    await page.selectOption('#se-screen', capture.screen);
    await page.selectOption('#se-situation', capture.situation);
    await page.locator('#' + capture.variant).screenshot({ path: path.join(output, capture.name + '.png') });
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.addStyleTag({ content: 'body { color-scheme:dark; }' });
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.selectOption('#se-screen', 'home');
  await page.selectOption('#se-situation', 'normal');
  await guided.screenshot({ path: path.join(output, 'accueil-guide-sombre.png') });
  assert.equal(errors.length, 0, errors.join('\n'));
  const result = { nature: 'Contrôle de maquettes locales ; aucune application ni API testée', screens: screens.length, variants: 2, layoutChecks: layoutChecks.length, browserErrors: errors, widths: [320, 360, 736, 1024], interactions: ['navigation', 'validation locale', 'coupure réseau', 'pause/reprise', 'relecture finale en lecture seule', 'question suivante', 'rapport partiel', 'annulation suppression'], screenshots: [...captures.map(c => c.name + '.png'), 'accueil-guide-sombre.png'] };
  fs.writeFileSync(path.join(root, 'docs/candidat/verification-maquettes.json'), JSON.stringify(result, null, 2) + '\n');
  await browser.close();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
})().catch(async error => { if(activeBrowser) await activeBrowser.close(); process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
