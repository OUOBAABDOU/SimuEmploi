# S0 — Journal du démarrage réel

Mise à jour : 22 novembre 2026. Les 26 dossiers de sprint antérieurs restent des historiques ; [les impacts S0-0.4](S0-cloture/08_IMPACTS_ET_CAPACITE.md) précisent leurs dépendances à réviser pour l’adaptatif, le multi-IA et la capacité de 120 h. S0 reste en cours, S1 comporte une première tranche technique déjà réalisée. **Consigne du porteur : terminer S0 avant toute poursuite des autres sprints.** Le [dossier de clôture S0-0.4](S0-cloture/README.md) réunit la référence corrigée, l’atelier local et le registre de réception.

## Choix reçus du porteur

- Nouveau projet, sans reprise du code applicatif historique.
- Candidats d’abord ; premier entretien pour un emploi ou un stage, Burkina Faso.
- Extension progressive vers Mali/Niger, puis autres publics selon validation.
- Python/FastAPI au backend ; modules séparés puis extraction selon besoins.
- Cinq développeurs full stack, affectés dans l’ordre fourni : **D1 Ouoba, D2 Abdou, D3 Rasmané, D4 limata, D5 Oumou**. 24 heures par personne par sprint confirmées ; compréhension des nouveaux périmètres à confirmer.
- Validation produit, relecture métier et coordination : **OUOBA Abdou Rasmané**, nommé par le porteur le 22 novembre 2026.
- Avis produit reçu sur **S0-0.3 : modifications demandées**, ensuite précisées par les exigences adaptatif et plusieurs API/IA. La proposition **S0-0.4 reste à relire** ; aucun avis d’approbation n’est déduit de la demande de modifications.
- Nouvel avis reçu sur **S0-0.4 : modifications demandées**, puis précisées : fournisseurs IA et utilisation des API. [Addendum API-0.1](S0-cloture/09_FOURNISSEURS_IA_ET_UTILISATION_API.md) préparé pour relecture ; aucun choix de fournisseur ou budget approuvé n’est déduit de cette précision.
- Le porteur peut organiser des essais candidats ; aucun résultat de séance réelle n’est encore reçu. Les avis et observations restent à renseigner dans l’atelier S0-0.4.
- Orientation reçue ensuite : **AgentRouter premier candidat à qualifier pour le texte** ; première boucle de trois essais prévue le **22 novembre 2026**. L’atelier propose une étape IA/API et une préparation de séance ; aucun appel IA ni résultat d’essai réel n’est créé.
- Approbations reçues ensuite le **22 novembre 2026** : les **trois banques v3** avec aides/critères/limites adaptatives et la **référence de conception S0-0.4 IA/API et parcours/contrats**. Le backlog/capacité, les périmètres D1–D5, les séances candidates et la réception finale restent à confirmer.
- Confirmation reçue ensuite : **périmètres D1–D5 et backlog acceptés sans ajustement demandé**, réponse « tout est bon » du coordinateur le 22/11/2026. Les trois essais candidats, les corrections éventuelles et la décision finale après examen restent à recevoir.

## Résultat de la tranche de démarrage

| Élément | État réel |
|---|---|
| Frontend/API écrits à neuf | Réalisés dans `application/` |
| Découverte → catalogue → préparation → aide | Implémentés, branchés sur l’API locale |
| Trois exemples, version/plan/grille, brouillon invisible | Implémentés ; contenu à relire |
| Erreurs, annulation requête, filtre URL, navigation clavier | Implémentés ; recette navigateur consignée séparément |
| Contrat OpenAPI réellement disponible | Exporté depuis le code ; contrôle de dérive disponible |
| Frontières et contrats privés futurs | Propositions rédigées ; aucune route privée implémentée |
| Catalogue PostgreSQL / migrations | À réaliser |
| Fournisseur OIDC et comptes | À choisir puis réaliser |
| Réponses sauvegardées / IA / audio / vidéo | À réaliser dans les lots suivants |
| Corpus relu et maquette validée par utilisateurs | À recevoir |
| CI distante / préproduction / sauvegarde-restauration | À réaliser et qualifier |

## Reprise par les cinq développeurs

Les cinq noms et les 24 h chacun sont enregistrés. Le [backlog S0 restant](S0-cloture/04_RESPONSABLES_DECISIONS_BACKLOG.md) propose 11 tâches humaines détaillées en heures, avec résultat attendu, responsable, revue et dépendance. Première estimation à confirmer : D1 8 h, D2 13 h, D3 11 h, D4 15 h, D5 12 h, soit 59 h de relectures, essais et consolidation. Corrections issues des essais et temps produit/métier restent à préciser ; aucune validation humaine n’est inventée.

## Suite envisagée après réception S0 : base et catalogue persisté

1. **D5**, avec D2 : choisir et verrouiller PostgreSQL/SQLAlchemy/Alembic après essai local/Linux ; fournir une base de test et migration vide. Ne pas annoncer le composant qualifié avant exécution.
2. **D2** : modèle scénario/version/plan/grille, état de publication et contraintes ; dépôt PostgreSQL satisfaisant le port `CatalogRepository`. Un seed d’exemples reste réservé au développement. Tester publication, retrait et historique de version.
3. **D4** : réutiliser les composants pour afficher le catalogue persisté, charge lente, panne et catalogue vide ; traiter pagination avant croissance du corpus. Refaire le parcours si les contrats changent.
4. **D1** : préparer identité et préférences sans activer de connexion fictive ; l’intégration réelle exige le fournisseur et sa configuration.
5. **D3** : créer ports par capacité IA, notamment génération de prochaine question et évaluation, avec doubles de test isolés. D2/D5 préparent politique, questions figées par tour et job/outbox pour S3 ; pas de retour présenté comme réel dans l’application.

Intégration courte quotidienne ; chacun vérifie ses fonctions, puis passe la revue prévue. D5 ne porte pas seul la recette. Les tailles de tâches et dates seront ajustées à la disponibilité effective de l’équipe.

## Conditions pour recevoir S0

- Porteur produit et référent entretien nommés ; premier corpus relu.
- Parcours de référence compris par quelques candidats du public ciblé ; observations documentées.
- Contrats minimaux relus, droits et révisions explicites ; décisions de rétention/budget attribuées.
- Backlog estimé par l’équipe, capacité réelle et dépendances connues.
- Architecture, environnement et risques compris par les cinq développeurs.

Une compilation ou une démonstration locale ne ferme pas ces conditions. La recette technique est consignée dans `../verification/RECETTE_DEMARRAGE.md` après exécution des contrôles.

**Évolution du 22 novembre :** question suivante fondée sur la précédente question et sa réponse, plusieurs fournisseurs IA selon les capacités, équipe à 24 h chacun par sprint. La référence S0-0.4 et ses contrats doivent être reçus avant toute poursuite.
