# Réception S0 — preuves et décision

Référence S0-0.4, 22 novembre 2026. La préparation du dossier et la décision de réception sont deux états explicites. L’instruction du porteur impose d’attendre la réception de S0 avant de poursuivre les autres sprints.

| Condition | Preuve attendue | Situation connue |
|---|---|---|
| Responsable produit / métier nommé | Nomination reçue | **OUOBA Abdou Rasmané**, réponse dans ce chat |
| Premier corpus relu par responsable métier | Trois avis sur les banques, axes, grilles et politique adaptative, datés et versionnés | **Trois banques v3 approuvées par OUOBA Abdou Rasmané le 22/11/2026**, réponse dans ce chat |
| Maquettes et parcours compris par candidats | Séances réelles, notes des dix tâches, difficultés et corrections | **Aucun candidat disponible pour le moment**, réponse du porteur ; aucun résultat reçu |
| Affectation D1–D5 et capacité réelle | Noms ou pseudonymes, heures disponibles, périmètre compris | **Périmètres des cinq développeurs confirmés par le coordinateur le 22/11/2026** ; 24 h chacun |
| Contrats/décisions relus | Avis responsable, choix et conditions restant à fermer avant chaque lot | **Référence de conception S0-0.4 approuvée le 22/11/2026** ; offre, modèle, budget et politique de données encore ouverts |
| Orientation fournisseur pour le texte | Choix de priorité distinct de la qualification et de la réception | AgentRouter premier candidat à qualifier, confirmé dans ce chat ; appels inactifs |
| Backlog estimé par équipe | Relecture, estimation ajustée à capacité et dépendances | **Approuvé sans ajustement demandé le 22/11/2026** ; estimation, pas consommation d’heures |
| Référence produit reçue | Avis produit daté sur S0-0.4, avec variante et notes d’essais | Conception approuvée ; **examen des essais et réception finale encore en attente** |
| Difficultés critiques résolues | Observation, responsable, correction et nouvel essai | Registre vierge ; absence d’observation ne signifie pas absence de difficulté |

`preuves-humaines.json` contient des champs vides pour ces preuves. `verifier_s0.py` produit `etat-reception.json` et retourne un code non nul si la réception reste incomplète. Le bouton d’export de l’atelier ne publie aucune validation et n’envoie aucun message.

La date du 22 novembre 2026 est reçue comme planification d’une boucle de trois essais. Les champs `api_qualification_plan` et `candidate_test_plan` conservent cette orientation et cette date ; ils ne remplacent ni les avis datés ni les observations `participant_sessions`. Une priorité fournisseur ne qualifie pas son API.

Les tests automatisés des maquettes portent sur des écrans et transitions simulés. Ils sont consignés séparément ; ils ne sont jamais comptés comme séances candidates. Le contrôle de réception détecte champs manquants, avis incomplets et problèmes critiques ouverts. Il ne peut pas prouver à lui seul qu’un déclarant était présent : le responsable produit conserve le contexte de séance.

Après réception : consigner auteur/date/version et décision dans le journal S0. Une modification majeure de corpus, parcours ou contrat rouvre la relecture concernée. Les signatures peuvent être remplacées par une approbation explicite dans ce chat, si son périmètre est précis ; « nous pouvons organiser les tests » n’approuve pas leur résultat.

Les réponses « J’approuve les trois banques après lecture » et « J’approuve cette référence de conception après lecture » sont enregistrées dans l’historique du registre. `business_reviews` et `decisions_review` portent ces avis ; `design_review` identifie le périmètre accepté. `product_review` attend la décision après essais. Le backlog, les périmètres des développeurs et les résultats de séances ne sont pas approuvés par ces deux réponses.

La réponse ultérieure « tout est bon » concerne explicitement les périmètres D1–D5 et le backlog estimé après échange avec l’équipe. Elle est enregistrée comme confirmation par le coordinateur, sans signatures individuelles inventées. Les séances et leurs résultats restent à documenter ; cet avis ne reçoit pas S0.
