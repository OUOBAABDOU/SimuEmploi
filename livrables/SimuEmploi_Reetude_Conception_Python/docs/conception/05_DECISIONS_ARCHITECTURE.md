# SimuEmploi — décisions d'architecture proposées

**20 novembre 2026. Statut commun : recommandé, à confirmer par POC et disponibilité de l'équipe.** Chaque décision doit être mise à jour si une preuve nouvelle change ses hypothèses.

## ADR-01 — Web/PWA avant application native

**Contexte.** Le prototype est web et le produit doit fonctionner sur plusieurs appareils avec un parcours texte.

**Décision.** Réutiliser React/Vite, ajouter routes, accessibilité et reprise locale. Les fonctions mobiles natives sont différées.

**Alternatives.** Flutter/React Native pour accès matériel plus homogène ; application web sans cache pour réduire le périmètre.

**Conséquences.** Livraison multi-appareil et réutilisation du code ; support audio, quotas de stockage et arrière-plan dépendants du navigateur. Tester les appareils ciblés.

**Réexamen.** Si une fonction indispensable est durablement inaccessible sur les navigateurs ou si un client finance une application native.

## ADR-02 — Monolithe modulaire et deux processus serveur

**Contexte.** Les fonctions partagent des règles et une base ; l'équipe et la charge ne sont pas encore établies.

**Décision.** Express/TypeScript organisé par domaines, API et worker séparés, même code métier. NestJS est une alternative si l'équipe le maîtrise et que sa migration est justifiée.

**Alternatives.** Backend entièrement réécrit dans un autre langage ; microservices séparés ; tout traitement synchrone dans les routes.

**Conséquences.** Transactions et opérations plus simples ; discipline de modules nécessaire. API et worker peuvent monter en charge séparément sans multiplier les services métier.

**Réexamen.** Besoin d'équipes autonomes, contraintes d'isolation ou goulot identifié qu'une extraction résout effectivement.

## ADR-03 — PostgreSQL comme source de vérité

**Contexte.** Sessions, campagnes, droits et paiement nécessitent cohérence et relations.

**Décision.** PostgreSQL, contraintes, transactions et migrations revues ; Prisma pour l'accès typé après vérification de version. IndexedDB reste un cache de reprise.

**Alternatives.** Firestore/document store ; stockage navigateur ; base par organisation dès le démarrage.

**Conséquences.** Modèle relationnel explicite, sauvegarde et contrôles centralisés ; compétence SQL et exploitation nécessaires.

**Réexamen.** Contraintes contractuelles d'un client ou activité nécessitant une isolation de base dédiée.

## ADR-04 — File PostgreSQL au pilote

**Contexte.** Les analyses longues doivent survivre aux pannes ; ajouter Redis crée un système supplémentaire à maintenir.

**Décision.** Queue pg-boss avec API/worker et insertion transactionnelle adaptée à l'ORM. Limiter concurrence et retries.

**Alternatives.** BullMQ/Redis ; file cloud gérée ; tâche sans persistance après réponse HTTP.

**Conséquences.** Moins de systèmes, transaction simplifiée ; charge des jobs à surveiller dans PostgreSQL. Les effets fournisseur externes restent potentiellement répétés.

**Réexamen.** Une mesure démontre que la queue sollicite trop la base ou qu'un fournisseur géré apporte un meilleur contrat d'exploitation.

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

## ADR-11 — Variante backend Python

**Statut.** Option proposée par le porteur ; choix final de langage/framework non arrêté.

**Décision recommandée si Python est retenu.** FastAPI/Pydantic, PostgreSQL, SQLAlchemy/Alembic et worker durable Python. React/TypeScript reste le frontend. Celery/RabbitMQ avec outbox représente la variante de production ; une queue PostgreSQL Python peut être testée pour un pilote plus simple.

**Alternatives.** Django/DRF si administration et gestion intégrée dominent ; Node/Express de l'ADR-02 pour maximiser la réutilisation du serveur actuel.

**Conséquences.** Réécriture serveur et contrats entre deux langages ; proximité de l'écosystème Python pour audio/documents/évaluation. La qualité IA et la fiabilité ne découlent pas du langage. Les exigences de persistance, permissions et reprise restent inchangées.

**Réexamen.** POC de session persistante, compétences disponibles, file de travaux, coût et compatibilité des bibliothèques. Voir [l'étude Python](06_OPTION_BACKEND_PYTHON.md).
