# SimuEmploi — modules candidat, contrats et évolution

**20 novembre 2026. Proposition de spécification pour une construction neuve.** Les routes et schémas deviennent un OpenAPI détaillé lors des sprints ; ce document n'est pas une API déjà installée.

## 1. Décision de départ

Le porteur a retenu des modules séparés puis leur extraction en microservices selon les besoins. Le premier produit contient un backend métier Python/FastAPI, des workers Celery et un dispatcher outbox ; ces processus distincts partagent initialement le même domaine et PostgreSQL. Ils ne sont pas présentés comme trois microservices autonomes.

Les cinq développeurs travaillent dans un dépôt neuf avec frontend et backend, contrats et migrations. Les sources de l'archive antérieure restent des références historiques ; elles ne constituent pas le socle de construction.

## 2. Frontières des modules

| Module | Propriété métier et données | Interfaces permises | Propriétaire de continuité |
|---|---|---|---|
| identity | Identité interne, accès et sessions d'authentification | Principal validé et politique de session | D1 |
| profile | Préférences candidat | Lecture/édition par propriétaire | D1 |
| catalog | Scénarios, publications, questions et grilles versionnées | Versions publiées et snapshot d'exercice | D2 |
| simulation | Session, réponses, pause, fin et progression | Cas d'utilisation de session ; entrée figée pour évaluation | D2 |
| evaluation | Demandes, validations, appréciations et provenance IA | Évaluation autorisée attachée à une réponse | D3 |
| reports | Version du rapport et références aux évaluations | Génération/lecture autorisées ; statut explicite | D3/D4 |
| usage | Réservations et consommation client, coût fournisseur | Réserver/consommer/libérer par opération unique | D1/D5 |
| data_rights | Demandes d'export/suppression, politiques et invalidations | Requête propriétaire et traitement tracé | D1/D5 |
| processing | Jobs, outbox, tentatives et réconciliation | Publication/consommation technique et état métier | D3/D5 |
| operations | Audit minimal, budgets, alertes et santé | Accès limité d'exploitation | D5 |

Une route appelle un service métier ; un module n'écrit pas directement dans les tables d'un autre via des accès dispersés. Les cas transversaux utilisent une orchestration explicite et l'unité de transaction nécessaire. Cette discipline prépare une extraction tout en conservant la cohérence initiale.

Pour les modalités maintenant conçues, ajouter deux frontières : `media` (prises, fichiers privés, autorisations, réception et transcription liée) et `realtime` (session de dialogue, transport éphémère, tours confirmés, interruption et arrêt). Leur conception figure dans [les maquettes audio/vidéo](05_MAQUETTES_AUDIO_VIDEO.md). Le broker transporte les travaux différés ; il ne transporte pas les fichiers bruts ni le flux vocal interactif. Le stockage objet et l’outbox SQL ont une orchestration de finalisation explicite. Les contrats et leurs implémentations sont préparés dans les lots AM0–AM3, sans extraction obligatoire en microservices.

## 3. Données et invariants minimaux

**Utilisateur :** UUID interne, issuer/subject externes uniques ensemble, statut et préférences. Aucun mot de passe fournisseur stocké dans le produit.

**Catalogue :** scénario et version publiée immuable, grille/version, plan de questions, pays/locale et modalité. Une session fixe ses versions à la création.

**Session :** propriétaire, finalité coaching privé, scénario/version, état et révision. Une question appartient au plan de la session. Une réponse possède un identifiant de soumission, le texte validé, la référence de question et sa version/empreinte.

**Travail :** opération unique, ressource analysée, référence/version d'entrée, état, tentatives, jeton/échéance de revendication. La réussite exige des droits/données encore valides et le jeton courant. L'outbox est écrite avec la réponse/réservation/travail dans la transaction appropriée.

**Évaluation :** réponse/version, grille, modèle, prompt, critères, preuve, statut et données d'usage. Une sortie invalide ne devient pas un résultat publiable.

**Rapport :** session, version, snapshot des réponses/évaluations, statut et limites. Une version publiée n'est pas silencieusement remplacée ; compléter un rapport partiel suit une nouvelle révision.

**Usage :** principal, opération métier, réservation/consommation/libération/ajustement et coût des tentatives fournisseur. Un timeout externe ne déclenche pas automatiquement une deuxième consommation client.

Les limites de texte, rétention et coûts seront fixées par contrat/configuration au S0–S2. Les contraintes de base et tests mettent en œuvre les invariants ; les noms du modèle conceptuel ne suffisent pas à les garantir.

## 4. Catalogue de contrats HTTP à détailler en OpenAPI

Préfixe `/api/v1`. Les champs présentés ci-dessous sont minimaux ; limites, exemples et erreurs sont complétés avant l'implémentation du contrat. Le serveur déduit le propriétaire de l'identité.

| ID | Route proposée | Demande et réponse | Contrôle/état essentiel | Sprint |
|---|---|---|---|---|
| AUTH-01 | `GET /auth/login` | Contexte de retour interne autorisé ; redirection OIDC | État/nonce et URLs autorisées | S2 |
| AUTH-02 | `GET /auth/callback` | Échange validé ; session cookie | Issuer/audience/signature/expiration et callback autorisés | S2 |
| AUTH-03 | `POST /auth/logout` | Révocation ; confirmation | Session et protection CSRF appropriée | S2 |
| ME-01 | `GET /me` | Identité publique minimale, préférences, état | Propriétaire uniquement, pas de jetons fournisseur | S2 |
| ME-02 | `PUT /me/preferences` | Objectif/domaine/expérience autorisés ; préférences confirmées | Valeurs référentiel et validation | S2 |
| CAT-01 | `GET /scenarios` | Domaine, curseur/limite ; liste publiée et suite | Pagination bornée, descriptions publiques seulement | S1–S2 |
| CAT-02 | `GET /scenarios/{id}` | Version publiée, objectif, plan/modalité | Version retirée ou inconnue explicite | S1–S2 |
| SESSION-01 | `POST /sessions` | Scénario/version souhaitée, clé stable ; id/versions/état | Création idempotente et propriété serveur | S3 |
| SESSION-02 | `GET /sessions/{id}` | État/révision, questions/réponses autorisées, statut | Pas d'accès A/B, pas de secrets IA | S3 |
| SESSION-03 | `POST /sessions/{id}/answers` | Question, texte validé, soumission/révision ; accusé et job | Transaction avant IA, quotas et clé/empreinte | S3–S4 |
| SESSION-04 | `POST /sessions/{id}/pause` | Révision attendue ; état confirmé | Transition serveur, pause idempotente selon contrat | S3 |
| SESSION-05 | `POST /sessions/{id}/complete` | Révision/clé ; fin et statut de rapport | Dernière réponse conservée, doublon sans effet supplémentaire | S3 puis S5 |
| SESSION-06 | `GET /sessions` | Curseur/limite/état ; historique du propriétaire | Pagination et filtres autorisés | S5 |
| EVAL-01 | `GET /answers/{id}/evaluation` | Statut, critères, preuve, versions disponibles | Réponse possédée et finale ; pas de note fictive | S4 |
| EVAL-02 | `POST /answers/{id}/evaluation/retry` | Clé/revision ; statut de demande | Autorisation, budget, statut et retries bornés | S4 |
| REPORT-01 | `GET /sessions/{id}/report` | Statut/version, synthèse, références, limites | Prêt/partiel/failed/pending distincts | S5 |
| REPORT-02 | `POST /sessions/{id}/report/retry` | Clé/version ; demande acceptée | Pas de doublon métier ni ancien résultat réécrit | S5 |
| DATA-01 | `POST /data-requests` | Type export/suppression ; id/statut | Identité/propriété, confirmation UI pour suppression | S5 |
| DATA-02 | `GET /data-requests/{id}` | Statut et suite autorisée | Propriétaire ; lien d'export privé court si applicable | S5 |
| FEEDBACK-01 | `POST /feedback` | Ressource et motif ; accusé | Ressource autorisée, taille limitée, finalité claire | S4–S5 |

La reprise d'une pause peut être une transition dédiée ou l'entrée dans SESSION-02/03 ; la décision est fixée au S3 et documentée. Aucune lecture ne doit modifier silencieusement un état métier. Les requêtes de modification ont un contrat explicite de transition et de conflit.

## 5. Idempotence, erreurs et révisions

Une clé est liée au principal, au type d'opération, à la ressource et à une empreinte de demande. Même clé et payload équivalent renvoie l'opération existante ; contenu incompatible renvoie un conflit. La durée de conservation des clés doit rester compatible avec les reprises autorisées, y compris les messages déjà publiés.

Une opération nouvelle recontrôle permissions/état/quota ; une opération existante se relit selon les droits actuels. La révision d'une évaluation porte sur sa réponse d'entrée, celle du rapport sur son snapshot. Une nouvelle réponse à une autre question ne rend pas automatiquement invalide une évaluation encore pertinente.

| Situation | Code proposé et comportement |
|---|---|
| Demande valide créée | `201`, identifiant et version |
| Réponse sauvegardée/analyse différée | `202`, accusé durable, statut et URL autorisée |
| Identité absente/expirée | `401`, reconnexion guidée |
| Ressource interdite | `403` ou `404` selon politique anti-divulgation cohérente |
| Version/clé incohérente | `409`, code de conflit stable et suite possible |
| Données invalides | `422`, erreurs par champ sans contenu sensible |
| Quota/fréquence dépassé | `429`, limite et délai applicable |
| Fournisseur/service indisponible | État métier failed/pending, ou `503` si l'opération n'a pas pu être acceptée |

Un `202` de sauvegarde n'est pas une promesse de retour IA. La forme d'erreur possède code stable, message compréhensible et correlation_id, sans stack/secret ni données d'un autre utilisateur.

## 6. Contrat d'événement et transport

Les événements techniques portent event_id, type/version, job_id, ressource/id, input_revision et correlation_id. Éviter les textes de réponse/CV dans le broker ; le worker recharge la ressource autorisée. La sérialisation JSON et les tailles/types acceptés sont contrôlés.

Le dispatcher publie puis vérifie confirmation et routage. Une panne avant marquage peut republier ; une perte/échéance est détectée par réconciliation des états métier. Le worker contrôle la revendication et la validité de l'entrée avant publication du résultat. Les transactions sont courtes ; l'appel externe ne garde pas une session DB ouverte inutilement.

Prévoir publication versionnée et compatibilité des workers pendant déploiement ; suspension/reprise propre si migration incompatible. La rétention de jobs/outbox et les suppressions sont coordonnées avec les reprises possibles.

## 7. Extraction progressive en microservices

Les critères d'extraction sont mesurés : charge de transcription, contraintes d'isolation, besoin de livraisons indépendantes, équipe propriétaire ou disponibilité nécessitant une séparation. Un nom de dossier ou un processus worker distinct ne suffit pas à constituer un microservice autonome.

Une extraction possible est l'évaluation/transcription, après usage réel. Il faut définir API/événements, versionnement, propriété et migration de données, budget, supervision et procédure de retour arrière. Le futur service possède ses données ; l'API principale ne les modifie pas directement.

La transaction PostgreSQL initiale ne traverse pas deux bases après extraction. La cohérence est alors organisée par événements/outbox de chaque propriétaire, idempotence, rapprochement et éventuelles compensations. Requalifier les erreurs, droits et coûts ; ne pas conserver un ancien double write non atomique.

Les identités, scopes et contrôles de ressources restent explicites entre services. L'ajout d'organisations introduit des memberships/finalités et exige une nouvelle matrice d'accès ; le coaching privé n'est pas rendu visible aux recruteurs par cette extension.

## 8. Priorité de réalisation

Parcours candidat → pilote observé → corrections/coûts/qualité → extensions utiles (audio, paiements, établissements) → recrutement reçu → extraction mesurée → extension géographique reçue. L'ordre exact des extensions dépend de partenaires et preuves, pas d'une multiplication systématique des services.

Cette spécification complète [les sprints](02_SPRINTS_CINQ_DEVELOPPEURS.md). Les contrats existants dans la réétude sont une référence métier ; un backend neuf, migrations neuves et composants neufs seront construits selon le périmètre retenu.
