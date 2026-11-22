import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'docs', 'conception');
const bundled = 'C:/Users/OUOBA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const require = createRequire(import.meta.url);
const { instance } = require(path.join(bundled, '@viz-js/viz/dist/viz.cjs'));
const sharp = require(path.join(bundled, 'sharp'));
const { JSDOM } = require(path.join(root, '.tooling/conception-render/node_modules/jsdom'));
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { default: mermaid } = await import(pathToFileURL(path.join(root, '.tooling/conception-render/node_modules/mermaid/dist/mermaid.core.mjs')));
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

const entries = [
  ['01-probleme-valeur', 'Problème et boucle de valeur', 'Explique le bénéfice attendu et le rôle de la répétition. La valeur doit être vérifiée auprès du public.'],
  ['02-contexte-c4', 'Contexte du système — C4 niveau 1', 'Montre les acteurs et fournisseurs externes. Les lieux de traitement et les contrats restent à sélectionner.'],
  ['03-cas-utilisation', 'Cas d’utilisation et acteurs', 'Carte fonctionnelle inspirée des cas d’utilisation UML. Mermaid représente ici les cas avec des nœuds et des liens, sans prétendre à une notation UML complète.'],
  ['04-conteneurs-c4', 'Conteneurs applicatifs — C4 niveau 2', 'Sépare application web, API, worker, base, queue et prestataires. Un conteneur C4 est une unité logicielle, pas nécessairement un conteneur Docker.'],
  ['05-composants-backend', 'Composants métier — vue C4 niveau 3', 'Décrit les frontières des modules et les interactions principales. Les contrôles transversaux et dépôts sont précisés dans le dossier architecture.'],
  ['06-donnees-principales', 'Modèle entités-relations', 'Montre les relations centrales. Certains champs/tables sont omis pour garder la vue lisible ; les contraintes détaillées figurent dans le dossier architecture. La paire identity_issuer/identity_subject est unique. Organization est facultative pour une session personnelle. Un rapport cite ses évaluations par une relation explicite. La revendication et la révision des travaux protègent les résultats tardifs.'],
  ['07-sequence-reponse', 'Séquence : sauvegarder puis analyser une réponse', 'Le commit précède l’appel IA. La sortie est validée, l’échec annoncé et les réponses conservées.'],
  ['08-sequence-reprise', 'Séquence : coupure réseau et synchronisation', 'Les soumissions gardent un identifiant stable. Un changement de compte ou de droits produit un refus explicite ; les brouillons ne sont pas transmis à un autre utilisateur.'],
  ['09-etats-session', 'États d’une session', 'Les transitions dépendent de règles serveur. Les actions de fin concurrentes et les travaux en retard sont contrôlés par état/révision.'],
  ['10-etats-rapport', 'États d’un rapport', 'Une session terminée peut avoir un rapport en attente ou indisponible. Une reprise conserve la provenance et les révisions.'],
  ['11-sequence-paiement', 'Séquence : paiement et déduplication', 'La confirmation serveur et l’événement unique contrôlent le crédit. Un statut incertain exige un rapprochement.'],
  ['12-revue-recruteur', 'Évaluation recruteur et revue humaine', 'Les données de campagne sont séparées du coaching privé. La sélection reste sous contrôle humain avec correction/recours.'],
  ['13-deploiement', 'Déploiement et frontières d’exploitation', 'Vue logique de production proposée. Emplacements, dimensionnement et niveaux de service doivent être validés par contrat et recette.'],
  ['14-parcours-validation', 'Parcours de validation et extension', 'L’ouverture repose sur les preuves de valeur, coût et fiabilité. Le module recruteur a sa validation spécifique.'],
  ['15-variante-python', 'Stack Python retenue — vue détaillée', 'FastAPI, PostgreSQL et workers Python Celery/RabbitMQ constituent la cible adoptée par le porteur. Le broker est une responsabilité supplémentaire à exploiter. Voir le dossier backend Python.'],
  ['16-python-outbox', 'Séquence Python : transaction et outbox', 'L’outbox empêche de perdre l’intention de traitement entre base et broker. Une répétition de publication reste possible et doit être absorbée par le worker ; un effet externe peut encore être répété.'],
];

const results = [];
let catalog = '# SimuEmploi — diagrammes de conception\n\n**20 novembre 2026. Architecture Python/FastAPI adoptée par le porteur ; cible à construire.**\n\nLes sources Mermaid sont modifiables dans `diagrammes/`. Les diagrammes complètent les règles du [dossier architecture](02_ARCHITECTURE_ET_TECHNOLOGIES.md). Ils n’établissent pas une validation commerciale, juridique ou de performance.\n\n## Vues de synthèse exportables\n\n![Problème, valeur et trois usages](visuels/valeur-et-usages.png)\n\n[Version SVG](visuels/valeur-et-usages.svg) · [Source Graphviz](visuels/valeur-et-usages.dot)\n\n![Architecture Python synthétique](visuels/architecture-synthese.png)\n\n[Version SVG](visuels/architecture-synthese.svg) · [Source Graphviz](visuels/architecture-synthese.dot)\n\n## Catalogue\n\n';
for (let i = 0; i < entries.length; i++) {
  const [id, title, description] = entries[i];
  const source = await fs.readFile(path.join(base, 'diagrammes', id + '.mmd'), 'utf8');
  try {
    const parsed = await mermaid.parse(source);
    results.push({ id, valid: Boolean(parsed), diagramType: parsed?.diagramType });
  } catch (error) {
    results.push({ id, valid: false, error: error.message });
  }
  catalog += `## ${i + 1}. ${title}\n\n${description}\n\n[Source modifiable](diagrammes/${id}.mmd)\n\n\`\`\`mermaid\n${source.trim()}\n\`\`\`\n\n`;
}

const viz = await instance();
const visuals = [];
for (const id of ['architecture-synthese', 'valeur-et-usages']) {
  if (!process.argv.includes('--validate-only')) {
    const dot = await fs.readFile(path.join(base, 'visuels', id + '.dot'), 'utf8');
    const svg = viz.renderString(dot, { format: 'svg', engine: 'dot' });
    await fs.writeFile(path.join(base, 'visuels', id + '.svg'), svg);
    await sharp(Buffer.from(svg), { density: 150 }).resize({ width: 1700 }).png().toFile(path.join(base, 'visuels', id + '.png'));
  }
  const metadata = await sharp(path.join(base, 'visuels', id + '.png')).metadata();
  visuals.push({ id, svgGenerated: true, width: metadata.width, height: metadata.height });
}

catalog += '## Vérification des représentations\n\nLa syntaxe des sources Mermaid a été contrôlée avec le parseur installé pour ce dossier. Deux vues Graphviz ont été générées en SVG et PNG ; leur contrôle visuel est documenté dans le rapport de livraison. La validation syntaxique ne prouve pas la qualité métier ni les performances de l’architecture.\n';
await fs.writeFile(path.join(base, '03_DIAGRAMMES.md'), catalog);
await fs.writeFile(path.join(base, 'verification-diagrammes.json'), JSON.stringify({ mermaidVersion: '11.17.2', diagrams: results, visuals }, null, 2) + '\n');
process.stdout.write(JSON.stringify({ count: results.length, valid: results.filter(r => r.valid).length, errors: results.filter(r => !r.valid), visuals }, null, 2) + '\n');
if (results.some(r => !r.valid)) process.exitCode = 1;
