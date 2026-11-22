# Impacts des décisions S0-0.4 sur le travail prévu

22 novembre 2026. Les exigences adaptatif et plusieurs IA sont reçues du porteur ; les propositions de réalisation restent à relire. **Aucun autre sprint n’est commencé ou poursuivi par ce document.** Il corrige les dépendances du plan pour éviter de développer ensuite sur une hypothèse de questions fixes.

## Capacité confirmée

| Place | Personne | Disponibilité par sprint de deux semaines | Responsabilité de continuité |
|---|---|---|---|
| D1 | Ouoba | 24 h | Accès, compte, autorisation des données |
| D2 | Abdou | 24 h | Catalogue, entretien adaptatif, tours et révisions |
| D3 | Rasmané | 24 h | Capacités IA, validation, provenance et erreurs |
| D4 | limata | 24 h | Parcours, maquettes, compréhension et essais |
| D5 | Oumou | 24 h | Données, livraison, routage et exploitation |

Total **120 heures brutes** par sprint. Le plan ancien de 50 jours-personne à temps complet n’est donc pas la capacité de cette équipe. Les réunions, revues, essais et imprévus occupent une partie de ces heures. Hypothèse de préparation : réserver environ 30 %, soit environ 84 h de réalisation ; l’équipe doit ajuster cette réserve et ses estimations après observation. Ce n’est pas un engagement de date.

Les responsabilités sont des continuités ; chacun reste full stack. La compréhension des périmètres et les estimations sont à confirmer par les personnes nommées. Ne pas convertir les 24 h en disponibilité quotidienne ni en travail continu.

## Modification des lots

| Lot | Ajustement de backlog requis | Dépendance nouvellement importante |
|---|---|---|
| S0 | Banque/politique adaptative, contrats de génération, registre multi-IA, états et essais | Relecture de S0-0.4 et observations candidates |
| S1 | Ports par capacité et doubles de test de génération ; modèles policy/question/operation ; infrastructure préparée | Question suivante, sortie invalide, délai et panne testables sans faux résultat réel |
| S2 | Qualifier au moins une capacité `next_question` et la politique de fournisseurs autorisés | Identité/données/fournisseur réellement disponibles avant entretien connecté |
| S3 | Conserver réponse puis demander question contextuelle par job/outbox ; snapshot de chaque tour, reprise et fin variable | Le traitement différé est nécessaire dès la génération des questions, avant le feedback S4 |
| S4 | Évaluation indépendante de la génération, preuve par question réellement posée, coûts par tentative et secours borné | Ne pas bloquer le tour suivant sur l’évaluation si le contexte confirmé suffit |
| S5 | Rapport sur tours réels, axes couverts, relances et fin partielle ; historique stable | Aucune supposition d’une liste identique de cinq réponses |
| S6/S7 | Qualité des relances, changements fournisseur, appareils, panne et compréhension | Corpus d’évaluation autorisé et essais d’intégration avant pilote |
| Audio/vidéo | Génération à partir de transcription confirmée ; STT/TTS/dialogue via ports séparés | Pas de question suivante fondée sur une transcription provisoire non acceptée |
| Autres extensions | Ajouter des capacités et règles de données par usage | Aucun accès automatique des recruteurs au coaching privé ; fournisseur adapté à chaque finalité |

Chaque lot doit être redécoupé et réestimé dans la capacité de 120 h. Les dates des anciens dossiers sont des hypothèses ; l’ajout de génération et la disponibilité partielle rendent une reprise mécanique du calendrier incorrecte.

## Travail restant pour recevoir S0

1. Relire les questions de départ, axes, limites proposées et règles de relance.
2. Relire génération/reprise, erreurs et politiques du registre multi-IA.
3. Confirmer les périmètres D1–D5 et estimer le backlog adapté en heures.
4. Réaliser les essais candidats : adaptation, réponse conservée, attente/reprise et limites comprises.
5. Traiter les difficultés essentielles, puis décider la réception de S0-0.4.

L’ancienne archive S0-0.3 est conservée ; ses quinze questions restent une base de comparaison. La version de politique, les questions acceptées et les entrées fournisseur doivent figurer dans toute future preuve de recette.
