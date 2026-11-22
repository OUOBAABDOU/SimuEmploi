# Contrats de travail — domaine candidat

Version de travail du 21 novembre 2026, à relire en S0. Ce document précise la suite ; il ne décrit pas des endpoints déjà disponibles. Seuls les chemins présents dans `openapi.json` sont implémentés. Les préfixes `/api/v1` ci-dessous seront communs aux routes métier ; les routes de redirection OIDC restent sous `/auth`.

## Disponible dans cette tranche

| Contrat | Route | Garantie locale |
|---|---|---|
| CAT-01 | `GET /api/v1/scenarios` | Exemples visibles, filtre `domain`, limite 1–20, curseur UUID ; aucune question dans les cartes |
| CAT-02 | `GET /api/v1/scenarios/{id}` | Plan et grille de la même version ; brouillon inaccessible |
| Santé | `GET /health/live` | Processus API vivant ; ne démontre pas une base disponible |

Une erreur de catalogue validée retourne `code`, `message`, `correlation_id`, avec le même identifiant dans `X-Request-ID`. La future API privée étendra ce format aux catégories `unauthenticated`, `forbidden`, `conflict`, `quota_exceeded` et `unavailable` ; elle ne doit pas renvoyer de texte candidat dans une erreur.

## Authentification et compte — proposition S2

| ID | Route proposée | Règles à vérifier |
|---|---|---|
| AUTH-01 | `GET /auth/login` | Retour limité à un chemin interne autorisé, `state`/`nonce`, PKCE selon le flux retenu |
| AUTH-02 | `GET /auth/callback` | Échange serveur, signature/issuer/audience/expiration, consommation unique du contexte, cookie Secure/HttpOnly en environnement publié |
| AUTH-03 | `POST /auth/logout` | Révocation serveur, suppression cookie, stratégie CSRF adaptée au déploiement et au fournisseur |
| ME-01 | `GET /api/v1/me` | UUID interne et préférences minimales ; aucun jeton fournisseur exposé |
| ME-02 | `PUT /api/v1/me/preferences` | Objectif premier emploi/stage, domaine et langue issus des référentiels ; confirmation après transaction |

L’identité unique est `(issuer, subject)`. Aucun rapprochement automatique de comptes par email. Aucun mot de passe fournisseur stocké dans SimuEmploi. À fermer avant réalisation : fournisseur OIDC, méthode d’accès adaptée au public, durée de session, politique adultes/mineurs, reprise/expiration et domaines autorisés.

## Session texte — proposition S3

**Révision S0-0.4 du 22 novembre 2026 :** les contrats adaptatifs détaillés dans [07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md](../docs/sprints/S0-cloture/07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md) priment sur les formulations historiques ci-dessous qui suggèrent un plan de questions fixe. La politique et la grille sont figées à la création ; chaque question suivante est produite à partir de la précédente question et de sa réponse confirmée, puis figée séparément. Utiliser `question_instance_id`, `expected_session_revision` et une opération canonique par ancrage. Les routes `GET /api/v1/sessions/{id}/next-question` et `POST /api/v1/sessions/{id}/next-question/retry` séparent lecture et réessai. Conservation 201/200, traitement différé 202/200. Génération et évaluation possèdent leurs états et capacités distincts via `ai_gateway` ; la transaction réponse/opération/outbox est nécessaire dès S3. Ces contrats restent proposés pour relecture, sans endpoint privé implémenté.

| ID | Route proposée | Entrée et résultat attendus |
|---|---|---|
| SESSION-01 | `POST /api/v1/sessions` | Scénario/version et clé idempotente ; propriétaire fixé côté serveur, plan/grille figés, session/révision retournées |
| SESSION-02 | `GET /api/v1/sessions/{id}` | Lecture du propriétaire ; état, plan et réponses confirmées, sans modifier l’état |
| SESSION-03 | `POST /api/v1/sessions/{id}/answers` | Question du plan, texte borné, `expected_revision` et clé ; réponse/révision confirmées après transaction |
| SESSION-04 | `POST /api/v1/sessions/{id}/pause` | Révision attendue et clé ; transition confirmée, même clé/même requête sans effet supplémentaire |
| SESSION-05 | `POST /api/v1/sessions/{id}/complete` | Dernière réponse conservée ; fin confirmée et état du rapport séparé |
| SESSION-06 | `GET /api/v1/sessions` | Historique du propriétaire, filtre d’état et pagination bornée |

Ajouter une mutation explicite `POST /api/v1/sessions/{id}/resume` pour sortir de pause, à confirmer lors du découpage S3. Les lectures n’activent jamais une session. États proposés : `active`, `paused`, `completed`, `cancelled`. La révision augmente à chaque mutation validée. Une révision périmée produit 409 avec révision courante autorisée ; l’interface recharge et propose un choix, sans écraser la réponse.

Une clé rejouée avec la même empreinte retourne le résultat initial ; la même clé avec un contenu différent produit un conflit. La conservation confirmée dans l’interface exige un accusé serveur. Un brouillon local porte un libellé distinct. Longueur des réponses, rétention, durée des clés et quotas du pilote restent à fixer puis à tester aux bornes.

## Évaluation et traitement différé — S4

L’évaluation est liée à `answer_id`, `input_revision`, version de scénario/grille/prompt et configuration de modèle. La transaction de demande conserve réponse, réservation d’usage, job et outbox. Le dispatcher publie l’identifiant et la version de travail ; il ne publie pas le texte candidat dans RabbitMQ. Le worker recharge les données autorisées.

États séparés de la sauvegarde : `queued`, `processing`, `ready`, `partial`, `unavailable`, `cancelled`. Pas de score généré pour masquer un échec. Un résultat n’est accepté que si la réponse/version, les droits et le jeton de revendication sont encore valides. Délais, budget, tentatives et politique de résultat tardif sont des paramètres à qualifier, pas des valeurs légales présumées.

Un retour comporte critère, appréciation bornée, conseil compréhensible, preuve reliée à la réponse et provenance. Les preuves inexistantes ou le JSON invalide empêchent un résultat `ready`. Le signalement `FEEDBACK-01 POST /api/v1/feedback` possède une ressource autorisée, un motif borné et un accusé ; il ne constitue pas une messagerie recruteur.

## Données — propositions S5

| ID | Route proposée | Règles |
|---|---|---|
| DATA-01 | `POST /api/v1/data-requests` | Export ou suppression ; confirmation explicite pour suppression, authentification récente selon politique retenue |
| DATA-02 | `GET /api/v1/data-requests/{id}` | Suivi du propriétaire ; téléchargement privé à durée limitée si export disponible |

Une suppression doit couvrir ressources actives, fichiers médias et tâches en cours ; le traitement des sauvegardes et des obligations de conservation doit être validé avec le responsable données. Ne pas afficher « supprimé » tant que les étapes prévues ne sont pas confirmées.

## Matrice minimale de droits

| Ressource | Visiteur | Candidat propriétaire | Autre candidat | Administrateur |
|---|---|---|---|---|
| Catalogue visible | Lecture | Lecture | Lecture | Publication future via droit explicite |
| Préférences/compte | Refus | Lecture/modification | Refus | Aucun accès ordinaire au contenu privé |
| Session/réponses/retour | Refus | Selon état/contrat | Refus | Intervention exceptionnelle autorisée, bornée et journalisée |
| Demande de données | Refus | Création/suivi | Refus | Suivi opérationnel selon rôle, contenu minimal |
| Job/outbox | Refus | Statut métier autorisé seulement | Refus | Exploitation ; payload minimal, pas de jetons fournisseur |

Avant acceptation, utiliser deux comptes A/B et essayer lecture, modification, export, URL devinée et cache après déconnexion. Les contrôles portent sur chaque ressource serveur ; un écran masqué ne suffit pas.
