# SimuEmploi — méthode de réétude et plan de validation

**20 novembre 2026.** Ce plan explique comment passer d'une idée plausible à une décision d'investissement et à une architecture reçue. Les nombres et seuils sont proposés pour organiser le travail, pas présentés comme standards ou résultats acquis.

## 1. Étudier dans le bon ordre

**Comprendre → délimiter → tester la valeur → concevoir → vérifier les risques → piloter → mesurer → décider.** Des preuves de concept techniques peuvent avancer pendant la recherche terrain, mais elles ne remplacent pas une preuve de besoin ou d'achat.

Conserver un registre des hypothèses : identifiant, question, méthode, population, observations, limites, décision et responsable. Les faits issus du code, les annonces commerciales de concurrents et les témoignages terrain n'ont pas le même niveau de preuve.

## 2. Lot A — Compréhension du problème

### Population exploratoire

Environ 20–30 candidats adultes, 5–10 responsables de formation/insertion et 5–10 recruteurs. Varier expérience, type de métier, genre, type d'équipement et lieu d'accès. Inclure des conditions hors des principaux centres lorsque cela est praticable. Ne pas présenter cet échantillon comme représentatif de la population nationale.

### Questions utiles

- Dernier entretien/oral préparé : quand, pour quoi, avec quelle méthode ?
- Difficulté concrète avant ou pendant l'exercice ; conséquence observée ?
- Temps et argent réellement consacrés à la préparation ?
- Personnes/outils déjà utilisés ; ce qui a aidé ou manqué ?
- Appareil, connexion, clavier, microphone et accès à un lieu calme ?
- Conditions d'acceptation de l'IA, de l'enregistrement et d'un partage avec un formateur/recruteur ?
- Pour l'acheteur : budget, cycle de décision, exigences, contrat et indicateur de réussite ?

Éviter les questions suggestives comme « aimeriez-vous notre application ? ». Demander des faits passés et faire essayer un parcours concret. Recueillir les informations minimales, expliquer la recherche et les droits, limiter les enregistrements.

**Livrables** : synthèse des situations, alternatives, personas observés, parcours avant/pendant/après, priorités des métiers et registre des hypothèses H1–H7.

## 3. Lot B — Service et prototype d'expérience

Avant de développer tous les modules, tester 3–5 exercices relus et un retour produit manuellement ou avec assistance IA contrôlée. Un formateur peut servir de référence. Le prototype doit annoncer les traitements effectués.

Tester : choix d'exercice, saisie texte, transcription corrigeable, retour, nouvelle tentative, partage annoncé et reprise après coupure. Repérer effort, compréhension des conseils, confiance et abandons.

**Livrables** : maquettes/prototype, problèmes d'usage, critères d'acceptation, MVP et exclusions. Les maquettes n'ont pas besoin d'avatars ni de métriques vidéo pour tester la valeur.

## 4. Lot C — Viabilité et distribution

Construire deux offres pilotes concrètes : cohorte d'établissement et pack candidat. Définir participants, nombre d'exercices, durée, support, prix, limites et conditions. Pour le recrutement, proposer uniquement une validation parallèle tant que le module n'est pas reçu.

Documenter les engagements : interlocuteur, pouvoir d'achat, budget, contrat, échéance et paiement. Distinguer intérêt, lettre d'intention, contrat signé et recette encaissée.

Établir un modèle de contribution à trois hypothèses de consommation ; coûts variables médian/p95, support, personnalisation, frais, taxes, acquisition, retards et renouvellement. Définir un plafond de dépense avant la promotion publique.

**Livrables** : offres, pipeline de partenaires, modèle financier, preuve d'achat et décision de périmètre.

## 5. Lot D — Preuves de concept techniques

| POC | Question | Critère de réussite proposé |
|---|---|---|
| T1 — Session texte persistante | Peut-on terminer et retrouver une session ? | Réponses validées conservées après refresh, erreur et déconnexion réseau |
| T2 — Identité et organisations | Peut-on garantir la portée de chaque accès ? | Tests candidat A/B et organisations A/B, partage et révocation sans fuite |
| T3 — Transaction et queue | Le travail survit-il à l'arrêt du worker ? | Commit atomique, reprise, doublon sans nouvel effet applicatif |
| T4 — Fournisseur IA | Le modèle/SDK respecte-t-il les contrats ? | JSON invalide rejeté, deadline, coût et provenance mesurés |
| T5 — Audio | Le parcours fonctionne-t-il sur appareils retenus ? | Refus média géré, transcription relue, pas de fuite audio non annoncée |
| T6 — Hors ligne | Les soumissions se resynchronisent-elles correctement ? | Identité cohérente, mêmes IDs, conflits explicites, aucun brouillon envoyé à un autre compte |
| T7 — Paiement | Le compte est-il crédité à bon escient ? | Signature/confirmation, doublons/hors ordre/timeouts et rapprochement vérifiés |
| T8 — Exploitation | Le système peut-il être restauré et limité ? | Restauration exercée, droits et suppressions cohérents, budgets et alertes actifs |

Les POC utilisent données synthétiques ou exemples autorisés. Les résultats indiquent versions, quotas, appareils, réseau, protocole et limitations. Aucun POC n'est déclaré réussi dans ce dossier : il reste à réaliser.

## 6. Lot E — Qualité pédagogique

Créer un corpus de départ de 100–200 réponses autorisées ou synthétiques, couvrant les familles retenues et différents niveaux de qualité. Deux évaluateurs compétents relisent une partie suffisante du corpus ; les désaccords sont étudiés et la grille corrigée avant de mesurer la concordance.

Pour un pilote pédagogique exploratoire de 40–60 personnes, comparer si possible la pratique habituelle et l'utilisation du service. Évaluer avant/après avec des exercices différents mais comparables, ordre équilibré et relecteurs indépendants. Le nombre proposé permet une exploration ; il ne garantit pas une puissance statistique suffisante pour toutes les conclusions.

Mesures : compréhension du retour, conseils appliqués, qualité selon la grille humaine, répétabilité, commentaires sans preuve, erreurs de transcription et coût. Publier les dénominateurs, taux de réponse, exclusions et incertitudes. Une hausse de note de l'IA seule ne prouve pas une amélioration réelle.

Pour le recruteur : vérifier pertinence du critère pour le poste, écarts entre évaluateurs et outil, stabilité et conséquences des erreurs. Prévoir accommodation, correction et recours. Le pilote parallèle ne doit pas influencer les décisions de sélection tant que la validation n'est pas suffisante.

**Livrables** : corpus versionné, grilles, rapport de relecture, résultats comparatifs et limites. Toute collecte de caractéristiques sensibles pour une étude d'équité nécessite un cadre propre ; ne pas les inférer à partir des médias.

## 7. Lot F — Recette et ouverture

### Recette technique

Reprendre les scénarios de [réception prioritaires](../CAHIER_DES_CHARGES_REVISE.md) : refus médias, erreur IA, dernière réponse sauvegardée, coupure après commit, accès inter-organisations, révocation, webhook répété, appareil partagé, injection, transcription corrigée et restauration.

Tester la charge par paliers, en commençant par 50 sessions simultanées. Distinguer charge de sessions et appels réellement simultanés ; préciser cadence de réponses, taille des textes, génération de rapports et limites fournisseur. L'ouverture Burkina à 200 sessions simultanées est une cible à éprouver.

### Tableau de décision

| Dimension | Signal de poursuite proposé | Signal d'ajustement |
|---|---|---|
| Besoin | Situations et acteurs récurrents observés | Usage surtout curiosité/démonstration |
| Pédagogie | Retours appliqués et progrès humain documenté | Conseils vagues, incohérents ou sans effet |
| Accès | Parcours texte et reprise utilisables | Abandon lié au réseau ou au média obligatoire |
| Commercial | Financement réel et contribution positive | Intérêt sans achat ou coût non maîtrisé |
| Sécurité/données | Accès contrôlés, formalités et restauration reçus | Fuite possible, destinataires inconnus ou réponse perdue |
| Recrutement | Critères métier et revue/recours reçus | Décision opaque, grille non validée ou biais non compris |

Les métriques chiffrées du dossier d'idée sont des seuils de discussion. Les obligations de protection et l'intégrité des données ne sont pas compensées par une bonne satisfaction moyenne.

## 8. Traçabilité besoin → architecture → test

| Besoin | Fonction | Module | Diagramme | Test |
|---|---|---|---|---|
| B01 — Exercice pertinent | Scénario métier et grille | Référentiels | 01, 03, 06 | Relecture locale et exercice avant/après |
| B02 — Retour utile | Feedback avec preuve | Évaluation | 05, 07, 10 | Corpus humain, extraits valides et limites |
| B03 — Répéter et progresser | Historique comparable | Simulation | 06, 09 | Versions de grilles et imports anciens séparés |
| B04 — Accès en réseau faible | Texte et reprise locale | Web + synchronisation | 04, 08 | Coupure de 60 s et doublons |
| B05 — Confidentialité | Autorisation et partage | Identité + données | 02, 03, 06 | A/B, révocation et appareil partagé |
| B06 — Suivi établissement | Cohorte et exercice attribué | Établissements | 03, 05 | Rôles et résultats visibles selon règle annoncée |
| B07 — Évaluation recruteur | Campagne, revue et recours | Recrutement | 06, 12 | Pilote parallèle et décision humaine justifiée |
| B08 — Coût maîtrisé | Réserve quota et paiement | Consommation/paiement | 07, 11 | Concurrence, coût incertain et webhook répété |
| B09 — Service récupérable | Queue, sauvegardes, logs | Exploitation | 04, 13 | Arrêt worker, restauration et migration |
| B10 — Extension AES | Profils pays et pilote local | Référentiels + opérations | 02, 14 | Dossier, partenaire et recette par pays |

## 9. Organisation et rythme de travail

Responsabilités nommées : porteur produit, référent pédagogique/RH, responsable technique, QA/accessibilité, responsable données/juridique et exploitation. Une personne peut cumuler plusieurs rôles ; les décisions et la réception restent explicites.

Estimation de démarche, à adapter à la disponibilité de l'équipe : 2–4 semaines de cadrage et entretiens ; POC techniques parallèles à la recherche ; MVP 4–8 semaines selon état et équipe ; pilote 4–6 semaines après recette. Délais de contrats et formalités séparés. Ces estimations ne constituent pas un engagement de livraison.

Revues hebdomadaires : nouvelles preuves, risques, modifications de périmètre, coûts et décisions. Chaque modification majeure produit une décision ADR et une mise à jour des diagrammes concernés.

## 10. Dossier de décision à réunir

Problème et publics observés ; catalogue de scénarios/grilles relus ; offres et financement ; modèle financier ; architecture et ADR ; modèle de données/contrats ; rapport de risques et formalités ; POC et recette ; corpus et résultats pédagogiques ; plan support/incidents ; calendrier et budget ; décision d'ouverture pour un usage et un pays précis.

L'étude documentaire et les diagrammes fournis ici constituent une base de conception. Les entretiens terrain, contrats, POC et expérimentations doivent encore produire les preuves nécessaires à l'investissement et au lancement.
