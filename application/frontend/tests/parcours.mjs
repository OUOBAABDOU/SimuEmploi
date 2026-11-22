import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const baseURL = process.env.SIMUEMPLOI_URL || 'http://127.0.0.1:5173';
const output = fileURLToPath(new URL('../../docs/verification/captures/', import.meta.url));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true,
  ...(process.env.SIMUEMPLOI_CHROME ? { executablePath: process.env.SIMUEMPLOI_CHROME } : {}),
});
const checks = [];
const errors = [];
const record = name => checks.push({ name, status: 'passed' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 }, locale: 'fr-FR' });
page.on('pageerror', error => errors.push(error.message));

async function waitCards(count) {
  const deadline = Date.now() + 10000;
  while (await page.locator('.exercise-card').count() !== count) {
    if (Date.now() > deadline) throw new Error(`Expected ${count} exercise cards`);
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

try {
  await page.goto(baseURL);
  await page.locator('h1').waitFor();
  assert.match(await page.locator('h1').innerText(), /premier entretien/);
  await page.screenshot({ path: `${output}/01-decouverte-ordinateur.png`, fullPage: true });
  record('Accueil réel et illustration sur ordinateur');

  await page.getByRole('link', { name: 'Choisir mon premier exercice' }).click();
  await waitCards(3);
  assert.equal(await page.locator('.work-notice').count(), 1);
  await page.screenshot({ path: `${output}/02-catalogue-ordinateur.png`, fullPage: true });
  record('Catalogue connecté : 3 exemples, notice de relecture');

  await page.locator('#domain').selectOption('beginner');
  await waitCards(2);
  assert.match(page.url(), /domain=beginner/);
  await page.getByRole('link', { name: 'Lire la préparation' }).first().click();
  await page.locator('.question-plan details').first().waitFor();
  assert.equal(await page.locator('.question-plan details').count(), 5);
  assert.equal(await page.locator('.rubric article').count(), 3);
  record('Filtre premier emploi/stage et plan de 5 questions');

  await page.locator('.question-plan summary').first().click();
  assert.equal(await page.locator('.question-plan details').first().getAttribute('open'), '');
  await page.screenshot({ path: `${output}/03-preparation-ordinateur.png`, fullPage: true });
  record('Ouverture d’une question et de ses repères');

  await page.getByRole('link', { name: 'Aller au contenu' }).focus();
  const beforeSkip = page.url();
  await page.keyboard.press('Enter');
  assert.equal(page.url(), beforeSkip);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'content');
  record('Lien d’évitement clavier sans changement de parcours');

  await page.reload();
  await page.locator('.question-plan details').first().waitFor();
  await page.getByRole('link', { name: 'Retour aux exercices' }).click();
  await waitCards(2);
  assert.equal(await page.locator('#domain').inputValue(), 'beginner');
  record('Actualisation de fiche et retour conservant le filtre');

  await page.locator('#domain').selectOption('presentation');
  await waitCards(1);
  await page.getByRole('link', { name: 'Lire la préparation' }).click();
  await page.locator('.question-plan details').first().waitFor();
  record('Deuxième filtre et autre exercice');

  for (const width of [320, 360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const hash of ['#/', '#/exercices', '#/exercices/11111111-1111-4111-8111-111111111111', '#/aide']) {
      await page.goto(baseURL + '/' + hash);
      if (hash === '#/exercices') await waitCards(3);
      if (hash.includes('11111111')) await page.locator('.question-plan details').first().waitFor();
      const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, view: innerWidth }));
      assert.ok(sizes.scroll <= sizes.view, `Horizontal overflow at ${width}px on ${hash}`);
      if (width === 360 && hash === '#/') await page.screenshot({ path: `${output}/04-decouverte-mobile.png`, fullPage: true });
      if (width === 360 && hash.includes('11111111')) await page.screenshot({ path: `${output}/05-preparation-mobile.png`, fullPage: true });
    }
  }
  record('4 écrans à 320, 360 et 768 px sans débordement horizontal');

  await page.goto(baseURL + '/#/exercices/99999999-9999-4999-8999-999999999999');
  await page.getByRole('alert').waitFor();
  assert.match(await page.getByRole('alert').innerText(), /n’est pas disponible/);
  record('Fiche absente : message utile et retour possible');

  await page.route('**/api/v1/scenarios', route => route.abort('failed'));
  await page.goto(baseURL + '/#/exercices');
  await page.getByRole('alert').waitFor();
  await page.unroute('**/api/v1/scenarios');
  await page.getByRole('button', { name: 'Réessayer' }).click();
  await waitCards(3);
  record('Panne réseau simulée puis réessai réussi avec API réelle');

  await page.route('**/api/v1/scenarios?domain=presentation', route => route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ items: [], next_cursor: null, content_status: 'example_pending_review' }),
  }));
  await page.locator('#domain').selectOption('presentation');
  await page.getByRole('heading', { name: 'Aucun exercice pour ce filtre' }).waitFor();
  await page.unroute('**/api/v1/scenarios?domain=presentation');
  record('Catalogue vide simulé distinct de la panne');

  await page.route('**/api/v1/scenarios?domain=beginner', async route => {
    await new Promise(resolve => setTimeout(resolve, 600));
    await route.continue();
  });
  await page.locator('#domain').selectOption('all');
  await waitCards(3);
  await page.locator('#domain').selectOption('beginner');
  await page.getByText('Chargement des exercices…').waitFor();
  assert.equal(await page.locator('.exercise-card').count(), 0);
  await waitCards(2);
  await page.unroute('**/api/v1/scenarios?domain=beginner');
  record('Filtre lent : aucun ancien exercice affiché comme résultat courant');

  assert.deepEqual(errors, []);
  record('Aucune erreur JavaScript non traitée');
  await writeFile(`${output}/../parcours-resultats.json`, JSON.stringify({
    executed_at: new Date().toISOString(), baseURL, browser: browser.version(), checks,
    note: 'API réelle ; panne, vide et lenteur simulés par interception explicite.',
  }, null, 2) + '\n');
  console.log(`${checks.length} contrôles navigateur réussis.`);
} finally {
  await browser.close();
}
