# SimuEmploi — décisions d'architecture

**20 novembre 2026. Stack Python adoptée par le porteur (ADR-11).** Les ADR-02 à 04 sont alignées sur ce choix. Les autres décisions restent recommandées ; la compatibilité, les contrats et les objectifs de qualité/fiabilité doivent être vérifiés. L'adoption d'une stack ne constitue pas une recette réussie.

## ADR-01 — Web/PWA avant application native

**Contexte.** Le prototype est web et le produit doit fonctionner sur plusieurs appareils avec un parcours texte.

**Décision actualisée via ADR-12.** Construire un frontend React/Vite neuf avec routes, accessibilité et reprise locale, selon maquettes candidat. Les fonctions mobiles natives sont différées.

**Alternatives.** Flutter/React Native pour accès matériel plus homogène ; application web sans cache pour réduire le périmètre.

**Conséquences.** Livraison multi-appareil ; support audio, quotas de stockage et arrière-plan dépendants du navigateur. Tester les appareils ciblés.

**Réexamen.** Si une fonction indispensable est durablement inaccessible sur les navigateurs ou si un client finance une application native.

## ADR-02 — Monolithe modulaire Python et processus séparés

**Contexte.** Les fonctions partagent des règles et une base ; l'équipe et la charge ne sont pas encore établies.

**Décision adoptée via ADR-11.** FastAPI/Pydantic organisé par domaines, API et workers Python Celery séparés, même code métier ; dispatcher outbox distinct pour publier les travaux.

**Alternatives.** Réutilisation Express/TypeScript du prototype ; Django/DRF ; microservices séparés ; tout traitement synchrone dans les routes.

**Conséquences.** Transactions et opérations plus simples ; discipline de modules nécessaire. API et worker peuvent monter en charge séparément sans multiplier les services métier.

**Réexamen.** Besoin d'équipes autonomes, contraintes d'isolation ou goulot identifié qu'une extraction résout effectivement.

## ADR-03 — PostgreSQL comme source de vérité

**Contexte.** Sessions, campagnes, droits et paiement nécessitent cohérence et relations.

**Décision adoptée via ADR-11.** PostgreSQL, contraintes, transactions et migrations revues ; SQLAlchemy/Alembic pour l'accès et le schéma. Versions et drivers à qualifier. IndexedDB reste un cache de reprise.

**Alternatives.** Firestore/document store ; stockage navigateur ; base par organisation dès le démarrage.

**Conséquences.** Modèle relationnel explicite, sauvegarde et contrôles centralisés ; compétence SQL et exploitation nécessaires.

**Réexamen.** Contraintes contractuelles d'un client ou activité nécessitant une isolation de base dédiée.

## ADR-04 — Celery/RabbitMQ et outbox transactionnelle

**Contexte.** Les analyses longues doivent survivre aux pannes. L'API enregistre les données métier dans PostgreSQL tandis que le broker RabbitMQ transporte les travaux.

**Décision adoptée via ADR-11.** Réponse, réservation, travail et événement outbox dans une transaction PostgreSQL ; dispatcher avec publication confirmée ; workers Celery idempotents. Statut métier en base, concurrence et retries bornés.

**Alternatives.** Procrastinate/PostgreSQL si un réexamen justifie moins de systèmes ; file cloud gérée ; ancienne proposition Node/pg-boss.

**Conséquences.** Broker supplémentaire à exploiter, surveillance de l'outbox et des redélivrances. Publication répétée possible après une panne ; contraintes, revendication atomique et idempotence métier nécessaires. Les effets fournisseur externes restent potentiellement répétés.

**Réexamen.** POC ou exploitation démontrant une difficulté durable, coût excessif ou contrat géré plus adapté ; changement consigné avant mise en œuvre.

## ADR-05 — Identité OIDC et autorisation applicative

**Contexte.** Comptes, récupération et sécurité ne sont pas le domaine métier de SimuEmploi ; les permissions restent propres au produit.

**Décision.** Fournisseur OIDC autorisé choisi après étude des données/coûts ; cookie sécurisé et session serveur. Rôles, memberships et accès aux ressources sont appliqués dans l'API.

**Alternatives.** Keycloak auto-hébergé si équipe capable de le maintenir ; identité développée en interne.

**Conséquences.** Dépendance fournisseur ou coût d'exploitation ; absence de jetons sensibles persistés dans localStorage. OIDC authentifie, il ne décide pas qui peut lire une campagne.

**Réexamen.** Exigence de résidence ou d'exploitation cliente non satisfaite par le contrat retenu.

## ADR-06 — Réponse persistée et effets idempotents

**Contexte.** Le prototype peut perdre une dernière réponse et échouer sans rapport exploitable ; le réseau peut couper après un commit.

**Décision.** Identifiant stable, transaction réponse/usage/job, accusé avant IA, unicité et reprise. États du rapport séparés de la fin de session.

**Alternatives.** Historique faisant autorité envoyé par le navigateur ; réponse sauvegardée seulement après retour IA.

**Conséquences.** Plus de statuts et de suivi, mais intégrité et reprise contrôlées. Distinguer consommation client unique et coût fournisseur par tentative.

**Réexamen.** Ne pas supprimer ce principe ; améliorer sa mise en œuvre si la charge ou les contrats changent.

## ADR-07 — Grilles versionnées, preuve et contrôle humain

**Contexte.** Les scores actuels comportent des valeurs simulées ; les usages pédagogiques et de recrutement ont des conséquences différentes.

**Décision.** Retirer les notes fictives, figer les grilles, valider la sortie IA et contrôler les calculs serveur. Coaching privé et campagne séparés ; revue/recours pour le recrutement.

**Alternatives.** Score LLM global sans grille ; benchmark codé en dur ; analyse de confiance faciale/vocale.

**Conséquences.** Production de contenu et validation nécessaires ; résultats plus explicables, portée limitée et documentée. Une citation valide n'est pas une preuve scientifique de la note.

**Réexamen.** Nouvelle grille ou fonction seulement après validation et décision documentées.

## ADR-08 — Extensions externes sous adaptateurs

**Contexte.** IA, transcription, identité, paiement et stockage ont des contrats, pays disponibles et coûts propres.

**Décision.** Interfaces de fournisseur, configuration côté serveur, secret hors client, budgets et capacité par pays/finalité. Le nom d'un fournisseur ne doit pas être une règle métier.

**Alternatives.** Appels SDK dispersés dans les composants ; dépendance totale à un seul modèle ; stockage multi-pays non cartographié.

**Conséquences.** Tests de contrat et politiques de bascule ; changement possible sans réécriture globale, mais pas automatique sans requalification des données et de la qualité.

**Réexamen.** Changement de prix, de conditions, de modèle ou de disponibilité, avec évaluation et information appropriées.

## ADR-09 — Reprise hors ligne limitée et explicite

**Contexte.** Une connexion intermittente ne rend pas l'API IA utilisable ; le stockage navigateur peut être effacé.

**Décision.** Assets/questions locaux, brouillons/outbox sous la même identité, synchronisation visible et validation serveur. Aucun droit institutionnel nouveau créé hors ligne.

**Alternatives.** PWA annoncée comme IA totalement hors ligne ; abandon systématique à la coupure ; gros modèle embarqué dès le lancement.

**Conséquences.** Conflits et quota local à gérer ; service utile malgré la coupure sans promesse trompeuse. Protection des appareils partagés essentielle.

**Réexamen.** Modèle local validé et matériel cible capable, avec coût/qualité/confidentialité démontrés.

## ADR-10 — Extension géographique par pays

**Contexte.** Le porteur vise Burkina puis Mali/Niger ; les partenaires, contenus, prestataires et formalités restent nationaux.

**Décision.** Profils pays dans le produit et séparation des données/finalités ; ouverture après dossier et pilote local. Le lieu d'hébergement est contractualisé, pas déduit du country_code.

**Alternatives.** Ouverture simultanée AES sans préparation ; copie complète du produit par pays ; multi-région actif/actif immédiat.

**Conséquences.** Code commun et paramètres explicites ; activités locales à financer et responsables à nommer.

**Réexamen.** Contrat régional ou institutionnel prouvant une organisation commune, sans supposer la suppression des exigences nationales.

## ADR-11 — Adoption du backend Python/FastAPI

**Statut.** Acceptée par le porteur le 20 novembre 2026 : « on va utilise ca », avec le [texte Python joint](../../references/BACKEND_PYTHON_ADOPTE_TEXTE_FOURNI.txt) comme référence. La mise en œuvre et la recette restent à réaliser.

**Décision adoptée.** FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic et workers Python Celery/RabbitMQ avec outbox transactionnelle. React/TypeScript reste le frontend. Cette décision remplace les choix Express, Prisma et pg-boss de la proposition initiale et aligne les ADR-02 à 04.

**Alternatives examinées.** Django/DRF pour la gestion intégrée ; Node/Express pour réutiliser le serveur actuel ; queue PostgreSQL Python pour réduire le nombre de systèmes. Elles restent documentées pour un éventuel réexamen.

**Conséquences.** Réécriture serveur et contrats entre deux langages ; proximité de l'écosystème Python pour audio/documents/évaluation. La qualité IA et la fiabilité ne découlent pas du langage. Les exigences de persistance, permissions et reprise restent inchangées.

**Qualification et réexamen.** POC de session persistante, versions compatibles, reprise outbox/broker/worker, accès inter-organisations et coût. Un échec nécessitant un changement de stack produit une nouvelle décision explicite. Voir [le backend Python retenu](06_OPTION_BACKEND_PYTHON.md).

## ADR-12 — Construction neuve, candidats et extraction progressive

**Statut.** Acceptée par le porteur le 20 novembre 2026 : construction depuis zéro, cinq développeurs full stack, candidats en premier ; choix confirmé « Modules bien séparés, puis extraction progressive en microservices selon les besoins ».

**Décision.** Frontend/backend neufs suivant les maquettes candidat ; modules métier distincts et contrats versionnés dans un socle Python. API, dispatcher et workers sont des processus séparés du même domaine initial. L'extraction d'un module en service autonome vient après un besoin mesuré et une décision sur données/contrats/exploitation.

**Conséquences.** Le prototype reste historique, les espaces établissement/recruteur sont des extensions ; partenaires possibles pour recherche/pilote sans espace institutionnel initial. Les cinq développeurs partagent des composants, revues et responsabilités verticales. Les maquettes restent proposées/modifiables ; aucune recette de backend n'est acquise.

**Réexamen.** Retour des candidats, preuves de charge/isolation, financement et équipe propriétaire d'un service. Voir [maquettes/sprints candidat](../candidat/README.md).
