# S0 — Dossier de clôture à valider

Référence **S0-0.4**, 22 novembre 2026. Le porteur demande de terminer S0 avant de poursuivre les autres sprints. La première tranche S1 déjà réalisée reste conservée ; aucun nouveau développement S1/S2 n’est engagé dans ce dossier.

**Responsable produit, relecture métier et coordination : OUOBA Abdou Rasmané**, nommé dans ce chat. Le porteur indique pouvoir organiser des essais candidats ; aucun participant ni résultat d’essai n’a encore été transmis. Affectation : **D1 Ouoba, D2 Abdou, D3 Rasmané, D4 limata, D5 Oumou**, 24 heures chacun par sprint. Le coordinateur confirme ensuite les cinq périmètres et le backlog estimé le 22/11/2026, sans ajustement demandé.

**État reçu au 22 novembre 2026 :** les trois banques v3, leurs aides, critères et limites adaptatives, la référence de conception IA/API et parcours/contrats, les cinq périmètres et le backlog sont approuvés. Les demandes de modifications et les avis antérieurs sont conservés dans l’historique de `preuves-humaines.json`.

**AgentRouter est le premier candidat à qualifier pour le texte.** L’offre, le modèle, le budget et les règles de données restent à qualifier avant tout appel réel. [L’addendum API-0.1](09_FOURNISSEURS_IA_ET_UTILISATION_API.md) et [l’étude AgentRouter](10_EVALUATION_AGENTROUTER.md) précisent l’intégration envisagée ; aucune API n’est active.

**Étape restante : trois essais candidats, corrections éventuelles et examen final.** La date prévue était le 22/11/2026. Le porteur confirme d’abord « Pas encore réalisés », puis **« Pas de candidat disponible pour le moment »**. Aucune séance, nouvelle date ou réception de S0 n’est déduite. La préparation est complète ; S0 attend la disponibilité des candidats et leurs observations réelles.

La collecte est renforcée : seuls les codes distincts et les fiches complètes sont comptés ; les dates invalides/futures et les champs requis vides sont exclus. Après import, une nouvelle fiche reçoit un code libre. Ces contrôles techniques ne prouvent pas la réalité d’une séance.

## Utiliser ce dossier

1. Ouvrir `atelier.html`, ou lancer `application/run-s0.ps1` puis consulter <http://127.0.0.1:5174/atelier.html>. Il fonctionne localement, sans compte ni transmission. Les données saisies sont conservées seulement dans la page jusqu’à l’export ; télécharger le fichier avant de fermer.
2. Utiliser les banques et contrats approuvés comme référence des essais. Les références audio/vidéo restent des extensions de conception.
3. Dès qu’un candidat est disponible, suivre `03_PROTOCOLE_ESSAIS.md`, puis noter les observations dans l’étape 4 de l’atelier. Les périmètres et le backlog sont déjà confirmés.
4. Examiner les observations, documenter corrections et nouveaux essais, puis exporter les preuves. Remplacer `preuves-humaines.json` uniquement avec une version effectivement renseignée, en conservant la précédente si nécessaire.
5. Exécuter `backend/.venv/Scripts/python.exe tools/verifier_s0.py` depuis `application/`. Le contrôle distingue préparation matérielle et réception humaine ; une maquette automatisée ne valide pas un candidat réel.

## Livrables

| Livrable | Usage |
|---|---|
| `01_RELECTURE_METIER.md` et `corpus-relecture.json` | Trois banques / quinze questions de référence ; politique adaptative à relire |
| `02_PARCOURS_ET_CONTRATS.md` | Douze écrans, erreurs, états, révisions, droits, preuve et contrats détaillés |
| `03_PROTOCOLE_ESSAIS.md` | Instructions d’animation, tâches, observations et décision après essais |
| `04_RESPONSABLES_DECISIONS_BACKLOG.md` | Rôles, dépendances, comparaison OIDC, paramètres proposés et tâches S0 |
| `05_RECEPTION.md` | Conditions de réception et preuves à fournir |
| `maquettes/candidat.html` | Référence cliquable guidée/autonome, adaptée au premier stage/emploi |
| `maquettes/medias.html` | Référence cliquable audio/vidéo, sans capture réelle |
| `atelier.html` | Saisie locale des avis, essais, affectations et observations |
| `preuves-humaines.json` | Nominations, 24 h par personne et avis historisés ; nouvelles validations encore à renseigner |
| `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md` | Architecture et contrats de génération / plusieurs fournisseurs |
| `08_IMPACTS_ET_CAPACITE.md` | Capacité de 120 h et dépendances des lots à réestimer |
| `09_FOURNISSEURS_IA_ET_UTILISATION_API.md` | Addendum API-0.1 : fournisseurs concrets, exemples d’appels et conditions d’utilisation |
| `10_EVALUATION_AGENTROUTER.md` | Étude du routeur proposé par le porteur : candidat à qualifier pour le texte, sans sélection définitive ni activation |
| `ai-routing.proposal.json` | Configurations candidates nommées, toutes désactivées et non qualifiées |
| `question-candidate.schema.json`, `ai-registry.example.json` | Schéma de proposition et exemple de registre désactivé |

Les banques et contrats S0-0.4 sont approuvés comme référence de conception ; les maquettes attendent les essais candidats. Le catalogue applicatif version 1 reste une tranche historique séparée, non republiée par cette relecture. Les documents antérieurs sont conservés pour comparaison.

Pour partager l’atelier à jour : `livrables/SimuEmploi_S0_v04_API01_Equipe_Confirmee_2026-11-22_Collecte02.zip` à la racine du projet. Extraire le dossier complet, ouvrir `atelier.html`, puis exporter les saisies avant fermeture. Les anciennes archives restent des historiques.

## Commandes de vérification

Depuis `application/backend/` :

```powershell
.\.venv\Scripts\python.exe ../tools/verifier_s0.py
.\.venv\Scripts\python.exe -m pytest ../tools/tests/test_s0_reception.py -q
```

Pour vérifier un export placé ailleurs, ajouter `--evidence 'chemin/SimuEmploi_S0_preuves.json'`. Le contrôle lit cet export et produit le compte rendu ; il ne modifie pas ses avis ni ses observations. Les tests utilisent des fixtures explicitement synthétiques, séparées du registre humain.

## État de réception

La préparation technique est vérifiée dans `verification-preparation.json` et les maquettes dans `verification-maquettes.json` après exécution des contrôles. Les derniers résultats humains figurent dans `etat-reception.json`.

Les cases humaines ne sont pas précochées. Une nomination ne vaut pas approbation des quinze questions ; la possibilité d’organiser des essais ne vaut pas réalisation. Le vérificateur vérifie la complétude des déclarations, pas l’authenticité d’une signature : conserver les notes de séance et le contexte de relecture sans données personnelles inutiles.
