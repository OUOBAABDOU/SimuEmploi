# Vérifications de préparation S0-0.4 / addendum API-0.1

22 novembre 2026, Windows, Playwright 1.62.1 et Chrome 157.0.8103.40. Les résultats concernent les livrables de conception et le contrôle de réception, pas une nouvelle fonctionnalité de S1.

## Résultats

- **107 contrôles techniques réussis** : 96 combinaisons des douze écrans candidat, deux variantes et quatre largeurs (320, 360, 736, 1024 px), plus onze contrôles groupés d’interactions, de médias, d’atelier, de l’addendum API et de collecte.
- Catalogue adapté aux trois exercices ; réponse non vide brève acceptée, aide correspondant à la question, brouillon de démonstration conservé pendant coupure/pause/reprise.
- Relance liée au contexte précédent ; deux réponses différentes produisent deux relances différentes. La démonstration se termine dans la limite de tours. La progression ne présente plus un nombre fixe de cinq questions.
- Question suivante en préparation ou indisponible : aucune nouvelle question imposée, réessai normal possible, réponse précédente utilisée lors de la reprise.
- Question adaptative bornée à 700 caractères et affichage à 360 px sans débordement. Le contexte complet du tour précédent est consultable séparément, sans citations imbriquées dans la nouvelle question.
- Atelier vérifié dans ses cinq sections à 320, 360 et 1024 px, avec dix tâches par fiche. L’étape IA/API affiche la priorité AgentRouter et permet de rejoindre l’avis contrats avec le focus dans les notes, sans approbation automatique. Les nouvelles fiches ne préremplissent ni accord, ni date observée, ni succès de tâche ; l’export et la reprise JSON fonctionnent. Les cinq disponibilités de 24 h, la priorité API et la date planifiée sont préservées dans l’export.
- Référence audio/vidéo : ouverture des deux variantes de préparation vérifiée. Les 96 combinaisons ci-dessus portent sur le candidat texte ; elles ne sont pas une nouvelle recette intégrale des médias. La recette médias antérieure reste dans le dossier candidat.
- Aucune erreur JavaScript non traitée et aucune requête HTTP externe pendant ces contrôles par fichiers locaux.
- **9 tests réussis du contrôle de réception** : nomination seule insuffisante, approbations métier/conception distinctes des essais et de la réception finale, séance vierge non comptée, codes dupliqués (y compris entourés d’espaces) non traités comme trois personnes, métadonnées requises blanches refusées, relecteur vide/null refusé et difficulté critique non résolue bloquant la réception.
- Collecte vérifiée sur des fixtures synthétiques hors dossier de preuves : compteur des personnes distinctes, rejet des fiches incomplètes et dates invalides/futures, code libre après import P01/P03, nouvelle fiche sans date ni accord préremplis. Les fixtures n’ont pas remplacé le registre humain et ne figurent pas dans l’archive de relecture.
- Ruff conforme avec la configuration `backend/pyproject.toml`. Validation Pydantic des trois banques, critères hypothétiques et politique adaptative effectuée par `verifier_s0.py`.
- Addendum fournisseur/API accessible depuis l’atelier ; configurations nommées explicitement désactivées et non qualifiées. Syntaxe du bloc Python vérifiée par analyse AST, sans import du SDK ni exécution réseau. Les interfaces fournisseurs sont vérifiées dans les pages officielles citées par l’addendum ; leur fonctionnement sur un compte SimuEmploi reste à qualifier.
- Atelier local servi à `127.0.0.1:5174`, réponse HTTP 200 vérifiée. `run-s0.ps1` permet de le relancer.

Résultats détaillés : `verification-maquettes.json`, `verification-preparation.json` et `etat-reception.json`. Les captures de l’atelier, de la question adaptative mobile et de l’étape IA/API sur ordinateur et mobile ont été inspectées. Le scénario mobile a été simplifié après inspection visuelle, puis la recette a été rejouée. Le résultat de recette est marqué en cours puis réussi/échoué : un échec ne conserve pas un ancien succès dans le même fichier.

## Ce que ces résultats ne prouvent pas

Les maquettes simulent les effets et perdent leur mémoire à l’actualisation. Aucun backend privé, capture média ou fournisseur IA n’est actif dans cette référence. La génération locale sert à rendre les branches visibles ; sa règle de brièveté n’est pas une validation pédagogique d’un modèle. Le registre A/B/C décrit des fournisseurs fictifs désactivés et non qualifiés. `ai-routing.proposal.json` nomme des candidats réels, tous désactivés, sans modèle, secret ou capacité qualifiée. Les tests n’observent aucun candidat réel, ne représentent pas le Burkina Faso et ne certifient pas l’accessibilité complète ni un téléphone physique.

Les copies audio/vidéo conservent des tours préécrits pour illustrer capture et relecture ; une notice explicite qu’ils ne définissent pas le futur déroulement adaptatif à partir de transcriptions confirmées. L’ouverture de ces copies ne constitue pas une nouvelle recette intégrale des médias.

Le registre humain reste distinct des fixtures synthétiques de tests. Les téléchargements créés pendant les tests n’ont pas remplacé `preuves-humaines.json`. Le contrôle de complétude ne peut pas authentifier une séance ou une signature ; les notes et avis doivent venir des responsables réels.

Les avis sur S0-0.3 sont conservés dans l’historique avec leur version de corpus 2 ; les avis courants concernent la banque version 3 / S0-0.4. Les trois banques et la référence de conception sont approuvées le 22/11/2026. Le coordinateur confirme ensuite les cinq périmètres et le backlog sans ajustement demandé ; les 24 h chacun restent enregistrées. Les observations et la décision après essais restent à recevoir. **Zéro séance réelle exploitable enregistrée** ; première boucle de trois prévue, cible cinq.

La préparation matérielle S0-0.4 est complète et vérifiée. **S0 n’est pas reçu** : les essais candidats et leur examen final restent nécessaires avant toute poursuite des autres sprints. Le porteur confirme qu’aucun candidat n’est disponible pour le moment. Le backlog de référence de 59 h est accepté sous capacité de 120 h ; il ne représente ni une consommation d’heures ni une garantie de clôture à date.

La demande de modifications fournisseurs/API est traitée dans la référence de conception approuvée. AgentRouter est le premier candidat à qualifier pour le texte ; OpenAI est une alternative, Mistral un secours proposé. Aucune offre, modèle, donnée ou enveloppe de coût n’est qualifiée par ces avis. La première boucle de trois essais est prévue le 22/11/2026 ; aucun résultat n’est créé à partir de cette date. Les archives antérieures sont conservées ; la nouvelle archive Avis_Metier_Conception conserve les avis datés, leur historique et la planification sans annoncer de réception finale.
