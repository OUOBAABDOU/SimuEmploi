# SimuEmploi — vérifications techniques de la réétude

**Date : 20 novembre 2026.** Ce document rend explicites les vérifications réellement réalisées. Il accompagne l'étude et le cahier des charges révisé ; il ne constitue pas une recette de production.

## 1. Intégrité et périmètre

Les **30 fichiers non répertoires** extraits de l'archive ont été comparés par SHA-256 à leurs entrées ZIP : **aucune différence**. Aucun fichier applicatif fourni n'a été corrigé dans cette mission. L'archive contient aussi des entrées de répertoires, non comptées comme fichiers.

Le texte joint a été lu comme cahier des charges initial, puis conservé dans `references/CAHIER_DES_CHARGES_INITIAL.txt`. Ses propositions d'évolution ont été évaluées, pas exécutées automatiquement.

Références cryptographiques :

- ZIP : `BA389B1C09598439A39A2B7A1A03CC08B9A7F05459A169D305C720F8E7EF71B7`.
- Texte initial : `57347FF8A5230304D39A9393F5B35808894F37A8FADF4049889CFA29E754945B`.
- Résultat machine : [integrite-sources.json](integrite-sources.json).

## 2. Environnement de contrôle

Installation des dépendances dans le dossier extrait, avec pnpm 11.25.0, `--ignore-scripts --lockfile=false`, et store local dans `.tooling/`. Les scripts de dépendances n'ont pas été exécutés. Les dépendances ont été résolues à partir des plages du `package.json` : **ce n'est pas une reproduction exacte de `bun.lock`**.

Exemples : le lock fourni indique `@google/genai@2.15.0`, l'installation de contrôle a résolu `2.32.0` ; les deux jeux de versions figurent dans [diagnostic-types.json](diagnostic-types.json). Les résultats de compilation/types ci-dessous valent pour cet environnement de contrôle, pas pour toutes les versions possibles ni pour un déploiement client existant.

Le dossier source conserve son `bun.lock` original. Une future recette doit choisir un gestionnaire, figer l'environnement et appliquer son lock en mode reproductible.

## 3. Résultats

| Vérification | Résultat | Ce qu'on peut en conclure |
|---|---|---|
| Lecture et traçabilité du code | Réalisées | Les 31 constats de l'étude sont reliés aux fichiers examinés |
| `pnpm run lint` → `tsc --noEmit` | Code de sortie 0 | Le contrôle existant passe dans l'environnement de l'audit |
| Inspection de types du gestionnaire de copie | `item` = `any` ; mode strict absent ; `@types/react` non déclaré | Le passage de `tsc` ne garantit pas la validité des champs de ce parcours |
| Détection « euh » sur exemple contrôlé | 2 occurrences trouvées sur 2 attendues | Cette expression fonctionne pour cet exemple ; pas de validation globale de la transcription |
| WPM calculé sans mots reconnus | 90 | La borne minimale masque l'absence de parole dans cet état du calcul |
| Quatre mots horodatés ensemble, après 10 ms | 190 | Le regroupement temporel et le plafond peuvent déformer le débit |
| Quatre mots en 60 s dans la formule | 90 au lieu de 4 | La valeur affichée est bornée et ne décrit pas toujours la mesure brute |
| Flux d'enregistrement | Caméra `audio: false`, entrée recorder = flux vidéo | Dans ce parcours, l'enregistrement n'inclut pas le microphone |
| `pnpm run build` | Tentative bloquée par restriction de lecture du sandbox | Build non validé ; aucune conclusion sur son succès hors sandbox |
| Nouvelle tentative hors sandbox | Autorisation non accordée | Pas d'exécution hors sandbox et pas de contournement |
| Comparaison des fichiers ZIP/extraits | 30 identiques sur 30 | Les constats portent sur les sources originales |

La formule WPM est reproduite uniquement pour démontrer son effet. Le diagnostic ne crée pas un nouveau moteur audio et ne simule pas la qualité d'un microphone. L'inspection TypeScript utilise le compilateur installé et le `tsconfig.json` fourni.

## 4. Fichiers reproductibles

- [diagnostic-source.json](diagnostic-source.json) : calculs illustratifs et inspection du flux d'enregistrement.
- [diagnostic-types.json](diagnostic-types.json) : diagnostics, type `any` et versions de dépendances.
- [journal TypeScript](typecheck.log) : exécution du script de contrôle fourni.
- [journal de build](build.log) : erreur d'accès aux dossiers parents lors de la tentative dans le sandbox.
- `outils/diagnostic-source.cjs` et `outils/verifier-types.cjs` : scripts locaux ayant produit les diagnostics.

Le script TypeScript exige les dépendances installées. La reconstitution exacte du lock Bun et les scripts d'installation nécessaires aux binaires devront être pris en compte dans une vraie recette de build.

## 5. Vérifications non réalisées

Aucun appel Gemini réel, envoi de CV ou média, entretien utilisateur, paiement, déploiement, test de charge, audit d'accessibilité complet, contrôle de faille par exploitation ni campagne de validation statistique des scores n'a été effectué. Aucun secret de production n'a été demandé ou utilisé.

La revue des textes juridiques et conditions fournisseur est une recherche documentaire datée ; les formalités et contrats de SimuEmploi ne sont pas accomplis par cette étude. Les exigences de réception du cahier révisé définissent le travail à effectuer avant ouverture.
