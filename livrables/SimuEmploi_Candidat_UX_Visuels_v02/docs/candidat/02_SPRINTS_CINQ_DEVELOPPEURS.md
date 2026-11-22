# SimuEmploi — sprints candidat pour cinq développeurs full stack

**Plan proposé — 20 novembre 2026.** Construction neuve ; les maquettes et contrats sont des références à relire avant engagement. D1 à D5 sont des places dans l'équipe humaine, pas des agents logiciels. Aucune identité de développeur n'est supposée.

## 1. Organisation et capacité

Sprints proposés de deux semaines. À disponibilité complète, cinq personnes représentent 50 jours-personne bruts ; planifier initialement environ 35 jours-personne de réalisation et garder le reste pour revues, intégration, réunions, corrections et imprévus. Ce chiffre est une hypothèse à ajuster après les premiers sprints. La capacité diminue avec absences, temps partiel et apprentissage.

Chaque paquet ci-dessous vise environ 5–7 jours-personne, à estimer puis découper en tâches de 0,5–2 jours. Les tâches de tests font partie du paquet. Une estimation qui dépasse la capacité produit un découpage supplémentaire, pas un report silencieux de la qualité.

Les responsabilités principales facilitent la coordination, sans réserver un développeur au seul frontend/backend :

| Développeur | Continuité principale | Contributions verticales |
|---|---|---|
| D1 | Identité, compte et droits | Écrans, contrats, règles d'accès, stockage et tests |
| D2 | Catalogue et sessions | Navigation, parcours, API, modèles et progression |
| D3 | Évaluation et travaux IA | États du retour, adaptateur, workers, budgets et tests |
| D4 | Expérience candidat, rapports et reprise | Composants, endpoints de lecture, brouillons et parcours navigateur |
| D5 | Données, livraison et exploitation | Migrations, demandes de données, observabilité, environnements et fonctionnalités transversales |

Tous écrivent les vérifications de leurs fonctions. D5 ne devient pas le testeur chargé de finir les travaux des autres. Rotation de revue par défaut : D2 relit D1, D3 relit D2, D4 relit D3, D5 relit D4, D1 relit D5. Doubles revues métier supplémentaires pour droits, registre d'usage et migrations.

## 2. Règles de préparation et de livraison

Une tâche prête possède un écran ou cas métier, un contrat, des critères observables, des dépendances identifiées et des données de test. Les contrats sont fixés au début de sprint et peuvent permettre des travaux parallèles avec fournisseurs simulés de test.

Une tâche terminée respecte les critères, a été relue, passe les contrôles utiles, fonctionne en environnement de test et documente ses limites. Les données de démonstration sont identifiées ; les faux retours statiques de maquette ne passent pas dans le produit réel.

La [révision UX 0.2](04_AJUSTEMENTS_UX_ET_VISUELS.md) précise les tâches de D1 à D5 : illustrations légères, aide contextuelle, reprise, états de conservation, focus et notices. Les intégrer aux paquets concernés et les estimer dans la capacité existante ; elles ne sont pas des travaux supplémentaires supposés gratuits.

Rythme proposé : J1 objectif/contrats/capacité ; J2–J4 premières tranches ; J5 intégration et démonstration interne ; J6–J8 réalisation/recette ; J9 revue produit ; J10 rétrospective et préparation. Intégrer fréquemment dès le début. Une dépendance externe indisponible est tracée et le travail indépendant continue.

Le plan couvre huit sprints de S0 à S7, soit seize semaines à cette cadence comme hypothèse initiale. Ce n'est pas un engagement de livraison : contenu, équipe, contrats, qualité IA et résultats des essais peuvent imposer un ajustement.

## 3. Sprint S0 — Parcours, maquettes et contrats initiaux

**Objectif :** partager une référence candidat et délimiter le premier lot. Pas de fonctionnalités de production promises. **Démonstration :** découverte → préparation → réponse → retour → rapport, y compris coupure et échec.

### S0-D1 — Compte et préférences

- Détailler C02/C03/C12 : entrées, erreurs, accès et demandes de données ; préciser le parcours adulte du pilote.
- Comparer les exigences d'un fournisseur OIDC et préparer ses critères de choix, sans inventer un contrat signé.
- Produire les contrats AUTH/ME/DATA et la matrice des droits candidat/administration.
- Réception : première connexion, reconnexion, expiration et déconnexion expliquées ; compte externe lié par issuer/subject ; aucun email utilisé pour fusionner automatiquement.
- Dépendance : décisions produit/données. Coordination D5 pour rétention et D4 pour formulaires.

### S0-D2 — Catalogue et session

- Détailler C05/C06/C07/C09, progression, dernière réponse et règles de pause/fin.
- Avec un référent métier, préparer quelques scénarios/questions et une grille relue ; STAR uniquement quand pertinent.
- Produire contrats CAT/SESSION et relations scénario/version/grille/question/réponse.
- Réception : un même exercice a un plan déterminé, une version publiée et un propriétaire ; les états de conflit et doublon sont décrits.
- Dépendance : public/objectifs. Coordination D3 sur données d'entrée de l'évaluation.

### S0-D3 — Feedback et rapport

- Détailler C08/C11 : états en attente, prêt, partiel et indisponible, provenance et reprise.
- Définir format d'une appréciation, critères/bornes, preuve et politique face au JSON invalide.
- Décrire transaction/outbox, budgets, états de travaux et effets externes incertains.
- Réception : aucun score de secours ; retour rattaché à réponse/grille ; règle d'acceptation d'un résultat tardif explicite.
- Dépendance : grille D2. Coordination D5 sur workers et D4 sur rendu lisible.

### S0-D4 — Référence visuelle et compréhension

- Harmoniser les douze écrans, composants et libellés ; comparer Guidé/Autonome avec le porteur puis quelques utilisateurs.
- Préciser navigation mobile, erreurs des formulaires, états vides, brouillon local et sauvegarde confirmée.
- Produire tokens, composants, comportements responsifs et critères clavier/lecteur d'écran.
- Réception : parcours cliquable cohérent sur mobile/ordinateur ; changements identifiés et reliés aux critères.
- Dépendance : contenu de D1–D3. La maquette est une proposition, pas une évaluation IA réelle.

### S0-D5 — Architecture et réalisation neuve

- Définir dépôt neuf, frontières de modules, environnements, stratégie SQLAlchemy, images Linux et gestion des secrets.
- Préparer critères de compatibilité/version, CI, sauvegarde et observabilité avec charges du pilote.
- Vérifier les contrats partagés et produire un registre des décisions/dépendances externes.
- Réception : équipe capable d'expliquer qui possède chaque donnée et comment une réponse survit à une panne ; pas de microservices obligatoires au lancement.
- Dépendance : stack retenue ; coordination avec chaque domaine et responsable d'exploitation.

**Sortie S0 :** parcours et maquette de référence relus, backlog estimé, premier corpus/scénario relu, contrats minimaux et risques assignés. Les tâches du sprint suivant sont ajustées à la capacité mesurée.

## 4. Sprint S1 — Fondations et premier parcours navigable

**Objectif :** environnement neuf reproductible et interface commune. **Démonstration :** lancer frontend/API/base et parcourir découverte/catalogue sur données de test identifiées.

### S1-D1 — Squelette d'identité et écrans d'accès

- Créer module identité, configuration et modèles User/AccessSession ; préparer intégration OIDC selon fournisseur disponible.
- Réaliser C02/C03 avec composants partagés, validation de formulaire et cas d'erreur de test.
- Définir une identité simulée réservée aux tests et impossible à activer en production par accident.
- Réception : écran accessible, contrats ME stables, secrets serveur, migrations relues.
- Dépendance : base D5 et kit D4 ; revue D2 puis D5 pour sécurité.

### S1-D2 — Référentiels et catalogue de test

- Créer scénarios, versions publiées, questions et grille ; préparer migration et jeu d'exemples autorisés.
- Implémenter CAT-01/CAT-02 puis C05/C06 en lecture/préparation.
- Filtrer publication/domaine et limiter les listes ; distinguer catalogue vide d'une panne.
- Réception : fiche cohérente avec sa version, scénarios non publiés invisibles, pages responsives.
- Dépendance : migrations D5 et composants D4 ; revue D3.

### S1-D3 — Ports d'évaluation et doubles de test

- Créer contrats Pydantic de demande/résultat IA, interface fournisseur et catégories d'erreur.
- Construire fournisseurs simulés déterministes pour tests : sortie valide, invalide, lente et échouée.
- Préparer une vue C08 de test montrant chaque état, avec données explicitement fictives.
- Réception : frontière fournisseur séparée ; doubles inutilisables comme résultats réels ; schémas bornés.
- Dépendance : grille/contrats S0 ; revue D4.

### S1-D4 — Composants et navigation candidat

- Implémenter tokens, boutons, champs, alertes, cartes et navigation responsifs ; créer C01/C04 et routes.
- Préparer états vide/chargement/erreur et structure de page commune.
- Documenter clavier, focus, zones tactiles et annonce des statuts ; connecter catalogue D2.
- Réception : mêmes composants sur tous les écrans ; aucun débordement aux largeurs ciblées ; routes autorisées.
- Dépendance : maquette relue ; revue D5.

### S1-D5 — Environnement, base et CI

- Créer pyproject/lock, frontend verrouillé, Docker Compose Linux et PostgreSQL de test ; préparer RabbitMQ privé.
- Configurer Alembic, Ruff/typage, pytest/HTTPX, build frontend et premiers tests navigateur.
- Créer endpoints de santé minimaux, logs sans contenu candidat et environnement préproduction initial.
- Réception : installation reproductible ; CI bloquante sur échecs ; migrations exécutées depuis base vide ; secrets exclus du dépôt.
- Dépendance : versions qualifiées ; revue D1 et coordination migrations D1/D2.

**Intégration :** les cinq travaillent sur contrats S0 ; D5 fournit la base dès le début, D4 fournit composants avant duplication des écrans. Aucun accès réel au pilote à ce stade.

## 5. Sprint S2 — Compte réel, préférences et catalogue publié

**Objectif :** un candidat autorisé trouve un exercice relu. **Démonstration :** connexion → préférences → accueil/catalogue, puis déconnexion sans accès résiduel.

### S2-D1 — OIDC et compte

- Brancher connexion/callback, validation de jetons, session cookie, expiration et déconnexion.
- Implémenter ME-01/ME-02 et C03 ; créer le compte interne avec paire issuer/subject unique.
- Tester retour de connexion, refus, CSRF approprié et accès A/B ; supprimer toute identité de test des configurations de production.
- Réception : préférences persistées au bon compte, authentification simulée interdite hors test.
- Dépendance : fournisseur/configuration autorisés ; revue D2 et D5.

### S2-D2 — Catalogue public contrôlé

- Finaliser CAT-01/CAT-02, publication immuable, filtres et pagination.
- Connecter C05/C06 à des contenus relus ; éviter qu'une modification de catalogue altère une session future déjà créée.
- Préparer fixtures de scénario retiré, filtre vide et domaines disponibles.
- Réception : seules versions publiées accessibles ; toutes fiches annoncent plan/modalité/objectif cohérents.
- Dépendance : relecture métier et base ; revue D3.

### S2-D3 — Provenance et qualification fournisseur

- Qualifier adaptateur IA avec quelques exemples autorisés : modèle configurable, sorties structurées, délais et usage mesuré.
- Enregistrer versions de grille/prompt/modèle dans les contrats ; préparer validation des extraits et bornes.
- Définir quotas du pilote, reprises et catégories d'erreur avec le porteur.
- Réception : résultats de qualification documentés avec limites ; aucun résultat réel généré depuis l'interface de session encore absente.
- Dépendance : compte fournisseur/contrat et corpus ; revue D4.

### S2-D4 — Accueil et formulaires connectés

- Connecter C04 aux préférences/catalogue ; afficher recommandation simple et historique vide.
- Finaliser C01/C02/C03 et retours de connexion ; gérer erreurs/réessais et focus.
- Tester parcours smartphone et navigation après déconnexion ; aucune donnée privée en cache public.
- Réception : aucune information d'un compte précédent après changement d'identité ; transitions cohérentes.
- Dépendance : API D1/D2 ; revue D5.

### S2-D5 — Contrôles de données et exploitation d'accès

- Renforcer contraintes/roles DB et contrôles des ressources ; évaluer RLS si configurée avec transactions adaptées.
- Tester migrations, révocation, filtrage des logs et authentification inter-environnements.
- Ajouter journal minimal d'accès privilégié et notices du pilote relues par responsable données.
- Réception : restauration initiale exercée et accès croisés refusés ; aucune promesse de résidence de données sans fournisseur identifié.
- Dépendance : politiques et comptes D1 ; revue D1.

## 6. Sprint S3 — Session texte et sauvegarde fiable

**Objectif :** répondre à un exercice complet et retrouver ses réponses. **Démonstration :** création → validation → pause → actualisation → reprise → fin, sans dépendre de l'IA.

### S3-D1 — Autorisation et limites du candidat

- Appliquer propriétaire/finalité aux opérations SESSION ; préparer réservations d'usage et conflits de quota.
- Connecter états de session expirée/quota atteint et reconnexion vers la ressource autorisée.
- Tester plusieurs comptes, soumissions simultanées et propriétaire falsifié.
- Réception : le client ne fixe ni droits ni consommation ; même opération ne réserve pas deux fois.
- Dépendance : transactions D2/D5 ; revue D2 et D3 pour usage.

### S3-D2 — Domaine session et routes

- Implémenter SESSION-01 à SESSION-05 : versions figées, questions, réponse, pause et fin.
- Comparer clé/empreinte de soumission ; imposer contraintes et progression serveur.
- Créer événement outbox et état du travail dans la transaction avec réponse/réservation.
- Réception : réponse conservée après panne ; clé répétée même contenu rend même accusé, autre contenu conflit ; dernière réponse présente après fin.
- Dépendance : contrats, modèles D5 et quotas D1 ; revue D3.

### S3-D3 — États de travail et entrée d'évaluation

- Implémenter ProcessingJob/OutboxEvent, opération unique, références d'entrée et transitions autorisées.
- Préparer état C08 « réponse sauvegardée, analyse en attente » et continuation texte selon plan.
- Tester travail créé une seule fois avec transaction annulée/confirmée ; aucun retour fictif si worker non actif.
- Réception : évaluation liée à réponse/grille et statut, aucun appel fournisseur dans transaction HTTP.
- Dépendance : soumission D2 ; revue D4 et D5 pour cohérence DB.

### S3-D4 — Réponse, pause et brouillons

- Réaliser C07/C09, saisie, accusé, aide pertinente, pause et progression.
- Stocker brouillon sous identité/session/question ; conserver identifiant jusqu'à confirmation.
- Traiter coupure après commit, double clic, reprise après actualisation et changement de compte.
- Réception : brouillon n'est pas annoncé comme sauvegarde serveur ; texte finalisé relu sans modification silencieuse.
- Dépendance : SESSION D2/D1 ; revue D5.

### S3-D5 — Contraintes et recette de persistance

- Relire migrations Session/Answer/Usage/Job/Outbox, contraintes et index nécessaires.
- Préparer tests intégrés de concurrence, transaction rollback et coupure réseau sur base réelle.
- Instrumenter correlation_id, échecs de sauvegarde et durée API ; exercer restauration avec sessions de test.
- Réception : tests critiques passent ; CI protège l'intégrité ; aucune réponse brute dans logs.
- Dépendance : implémentations D1–D3 ; revue D1.

## 7. Sprint S4 — Retour IA durable et explicable

**Objectif :** obtenir un retour valide ou un échec explicite avec reprise. **Démonstration :** réponse sauvegardée → analyse → commentaire/extrait → prochaine question, puis essais de panne.

### S4-D1 — Consommation et permission des reprises

- Implémenter consommation/libération/ajustement selon résultat ; lier client et coûts de tentatives fournisseur.
- Contrôler la demande de reprise et plafonds utilisateur/plateforme ; présenter limite compréhensible.
- Tester appels concurrents, reprise après libération et tentative sans propriétaire autorisé.
- Réception : une opération possède un registre cohérent, pas de double consommation client ; coût incertain tracé.
- Dépendance : jobs D3 et modèle S3 ; revue D2 et D5.

### S4-D2 — Intégration session/évaluation

- Lier réponses, evaluations et transitions de progression ; permettre continuation dégradée selon scénario.
- Définir réponse finalisée en lecture seule et nouvelles révisions si correction autorisée ultérieurement.
- Tester analyse arrivée après pause/fin, question suivante et dernière réponse.
- Réception : un résultat tardif ne termine pas ni ne modifie une autre session ; entrées/grille cohérentes.
- Dépendance : worker D3 ; revue D3.

### S4-D3 — Dispatcher, worker et fournisseur

- Publier outbox avec confirmation et routage vérifié ; consommer via Celery avec paramètres de durabilité/reprise qualifiés.
- Revendiquer job avec jeton/échéance, appeler adaptateur hors transaction longue puis valider structure/extraits/bornes.
- Accepter résultat seulement pour la revendication et entrée courantes ; gérer erreurs permanentes, retry borné et réconciliation.
- Réception : panne après publication, worker perdu et message répété sans second effet métier ; sortie invalide rejetée.
- Dépendance : infra D5, usage D1 et entrée D2 ; revue D4 et D5.

### S4-D4 — Écran de retour et statuts

- Connecter C08, polling borné, navigation pendant attente et bouton de reprise autorisée.
- Afficher critère/extrait/conseil réel ; gérer analyse indisponible et continuation sans note fictive.
- Ajouter signalement de feedback et relire réponse finalisée en lecture seule.
- Réception : textes accessibles, statut annoncé, pas d'analyse sur brouillon local, polling arrêté à la sortie.
- Dépendance : API D2/D3 ; revue D5.

### S4-D5 — Exploitation des travaux et preuve de pannes

- Configurer broker/workers privés, logs, alertes outbox vieillissante, backlog et budgets.
- Éprouver arrêt dispatcher/broker/worker, retour non routable, deadlines et reprise sur environnement Linux.
- Contrôler taille/sérialisation des messages, privilèges et paramètres de redélivrance choisis.
- Réception : rapport de tests versionné ; état métier permet reprise sans dépendre d'un résultat Celery en mémoire.
- Dépendance : D3 ; revue D1 et D3.

## 8. Sprint S5 — Rapport, historique et nouvel essai

**Objectif :** transformer une session en conseils à retravailler. **Démonstration :** fin → rapport prêt/partiel → historique → nouvel exercice.

### S5-D1 — Compte et droits des rapports

- Connecter C12 et routes de compte, compléter filtrage report/history/signalement par propriétaire.
- Implémenter demande d'export/suppression avec statut et traitement contrôlé au pilote.
- Tester accès croisés, révocation et absence de données dans erreurs.
- Réception : demande réelle traçable au bon compte ; traitement ne se réduit pas à une confirmation de maquette.
- Dépendance : données report D3/D4 ; revue D2 et D5.

### S5-D2 — Fin de session et nouvel exercice

- Figer ensemble de réponses/évaluations utilisées ; fin idempotente et création d'un travail de rapport.
- Réaliser C09 et nouveau départ depuis rapport en conservant référence utile à l'objectif.
- Tester fin répétée, analyses retardées et scénario republié pendant session.
- Réception : chaque rapport cite des entrées cohérentes et toute nouvelle session possède ses propres versions.
- Dépendance : S4 ; revue D3.

### S5-D3 — Génération du rapport

- Générer synthèse à partir des évaluations autorisées ; validation, provenance et statuts pending/ready/partial/failed.
- Définir version/snapshot du rapport et politique de complétion d'une nouvelle révision.
- Tester une évaluation absente, incohérente ou invalidée et reprises du rapport.
- Réception : aucun benchmark artificiel, aucune voix/vidéo notée ; coût borné ; ancien worker ne remplace pas une version publiée.
- Dépendance : snapshot D2 ; revue D4.

### S5-D4 — Lecture du rapport et historique

- Réaliser C10/C11 et endpoints de lecture/pagination avec services métier ; afficher conseils et limites.
- Relier actions refaire/reprendre/signalement ; conserver contexte lors du retour liste.
- Tester historique vide, rapport en attente/partiel/failed et affichage 320 px.
- Réception : date locale et statuts cohérents ; pas de comparaison entre versions incompatibles ni comptes.
- Dépendance : D1/D2/D3 ; revue D5.

### S5-D5 — Rétention et exploitation des rapports

- Coordonner invalidation des jobs lors de suppression, nettoyage des objets/logs/outbox selon politique.
- Relire index historique, pagination, migrations et métriques temps total du rapport.
- Tester suppression pendant analyse/rapport puis restauration et réapplication des demandes.
- Réception : résultat supprimé ne réapparaît pas ; récupération contrôlée et responsabilités documentées.
- Dépendance : D1/D3 ; revue D1.

## 9. Sprint S6 — Reprise, accessibilité et qualité du coaching

**Objectif :** utiliser le parcours dans les conditions du public ciblé. **Démonstration :** exercice mobile avec coupure, reconnexion, résultat différé et rapport compréhensible.

### S6-D1 — Expiration et changement de compte

- Finaliser reconnexion vers ressource autorisée et nettoyage local lors de déconnexion.
- Vérifier navigation/back et appareils partagés ; expiration de partage futur ne doit pas être implicitement simulée.
- Tester sessions d'accès expirées pendant saisie et demandes de données ; guider récupération sans changer le propriétaire.
- Réception : aucun brouillon transmis à un autre compte ; refus compréhensible et état conservé selon politique.
- Dépendance : sync D4 ; revue D2.

### S6-D2 — Synchronisation métier et limites

- Finaliser conflits de session/version, soumission répétée et reprise des questions préchargées autorisées.
- Vérifier qu'un exercice hors réseau utilise un plan fixé ; aucun droit/score créé localement.
- Tester coupure après commit, validation tardive et session abandonnée/fermée.
- Réception : une réponse acceptée reste unique ; réponse refusée reste clairement en conflit et ne déclenche pas de coût.
- Dépendance : client D4 ; revue D3.

### S6-D3 — Évaluation pédagogique et erreurs IA

- Avec référents métier, relire un corpus autorisé et analyser commentaires non fondés, extraits et répétabilité.
- Tester réponses adversariales, contenu insuffisant et français des publics observés ; corriger grilles/prompts versionnés.
- Mesurer coût/latence et règles de bascule dégradée sans changer un modèle silencieusement.
- Réception : rapport de qualité avec limites, critères et décisions ; aucune performance commerciale inventée.
- Dépendance : corpus/relecteurs externes ; revue D4 et référent pédagogique.

### S6-D4 — PWA légère et accessibilité

- Précharger ressources publiques utiles, isoler IndexedDB par identité et rendre sync visible/manuelle si nécessaire.
- Tester clavier, lecteur d'écran, focus, messages de statut et clavier virtuel sur appareils ciblés.
- Optimiser bundle/chargement ; corriger retours observés sur les maquettes et parcours.
- Réception : brouillons récupérables selon navigateur/politique ; pas de cache global des réponses privées ; parcours texte complet sans média.
- Dépendance : D1/D2 ; revue D5.

### S6-D5 — Charge, restauration et sécurité pratique

- Mesurer API, attente de queue, coût et délais bout en bout sur charge définie ; budgets communs à plusieurs workers.
- Exercer migration/retour arrière compatible et restauration avec droits/demandes de suppression.
- Revoir dépendances, secrets, stockage privé et incidents ; fermer défauts qui bloquent le pilote.
- Réception : mesures avec protocole/versions ; écarts aux cibles expliqués ; aucune disponibilité déclarée sans preuve.
- Dépendance : tout parcours ; revue D1 avec responsables d'exploitation/données.

## 10. Sprint S7 — Préparation et démarrage du pilote candidat

**Objectif :** ouvrir un périmètre reçu à des candidats adultes identifiés. **Démonstration :** parcours complet, support, alertes, contrôles de données et retour utilisateur.

### S7-D1 — Accès et accompagnement du pilote

- Préparer entrée des comptes autorisés et notices/contact ; vérifier récupération et administration limitée.
- Exécuter recette finale des accès/demandes de données ; corriger défauts affectant le public pilote.
- Organiser suivi des tickets de compte avec le responsable support.
- Réception : accès et support réels, pas d'invitation automatisée envoyée sans instruction du porteur ; droits corrects.
- Dépendance : périmètre/contrats validés par responsables ; revue D2.

### S7-D2 — Catalogue et parcours reçus

- Stabiliser premiers exercices relus, versions et scénarios de recette ; corriger défauts de session/progression.
- Préparer plan de déploiement compatible avec sessions ouvertes.
- Observer sélection/préparation/fin avec candidats et transformer les difficultés en backlog.
- Réception : exercice complet et dernière réponse conservée ; contenus et changements versionnés.
- Dépendance : référents et disponibilité des candidats ; revue D3.

### S7-D3 — Suivi qualité/coût IA

- Vérifier budgets, modèle et provenance en environnement pilote ; suivre erreurs et retours signalés.
- Préparer procédure de suspension/bascule des analyses et traitement des rapports différés.
- Mesurer qualité/coût du périmètre initial et rapporter les limites sans promesse de progrès automatique.
- Réception : dépenses plafonnées, erreurs visibles, reprises contrôlées et procédure éprouvée.
- Dépendance : compte/fournisseur autorisé ; revue D4.

### S7-D4 — Parcours utilisateur et feedback produit

- Corriger les difficultés prioritaires de compréhension/navigation ; finaliser aide, états vides et responsive.
- Exécuter recette de bout en bout et recueillir feedback produit minimal/consenti.
- Documenter changements de maquette réellement retenus et livrer les composants cohérents.
- Réception : critères C01–C12 du périmètre satisfaits et résultats de relecture conservés.
- Dépendance : observations utilisateurs ; revue D5.

### S7-D5 — Mise en service et exploitation

- Fermer recette de restauration/alertes, comptes d'administration, secrets, lieux de traitement et procédure d'incident.
- Préparer version, migrations, retour arrière et surveillance du démarrage ; corriger incidents d'intégration.
- Produire dossier de passage et liste des limites acceptées par les responsables.
- Réception : ouverture après décision du porteur/responsables compétents sur preuves ; support et exploitation nommés. Le pilote ne prouve pas encore la capacité nationale.
- Dépendance : résultats S6 et conditions externes ; revue D1.

## 11. Extensions après preuves du pilote

Après observations sur plusieurs semaines, classer corrections et extensions avec utilisateurs/finance/pédagogie. Le sprint S7 démarre le pilote ; il ne garantit pas que toute son évaluation soit achevée en deux semaines.

| Extension | Module et équipe à planifier | Conditions avant engagement |
|---|---|---|
| Audio | Capture/transcription, D3/D4 avec D1/D5 pour données | Utilité, formats, coût, fournisseur et appareil validés |
| Paiement | Usage/billing, D1/D5 avec UI D4 et contrats D2 | Offre, marge, prestataire et rapprochement définis |
| Établissements | Organisations/cohortes, répartition verticale des cinq | Partenaire réel, droits, partage et objectifs pédagogiques |
| Recruteurs | Campagnes/revue, répartition verticale des cinq | Grilles métier, validation, traitement des erreurs/recours |
| Extraction de service | Évaluation ou transcription selon contrainte observée | Besoin mesuré, propriété des données, contrats et exploitation |
| AES | Profils contenus/opérations par pays | Burkina stable, partenaires, données et fournisseur autorisés |

Le détail de ces sprints dépendra des preuves et contrats futurs ; les engager maintenant avec une durée ferme serait une estimation sans périmètre reçu. Chaque extension réutilise le format des paquets ci-dessus pour répartir les tâches entre les cinq développeurs.

## 12. Traçabilité écran → sprint → responsables

| Écrans | Livraison initiale et consolidation | Responsables |
|---|---|---|
| C01 | S1, S2, S7 | D4, D1 pour accès |
| C02/C03 | S1–S2, S6–S7 | D1, D4 |
| C04/C05/C06 | S1–S3, S7 | D2, D4 |
| C07 | S3, S4, S6 | D2, D4, D1 pour droits |
| C08 | S4, S6–S7 | D3, D4 |
| C09 | S3 puis S5 | D2, D3 |
| C10/C11 | S5, S6–S7 | D4, D3, D1 pour accès |
| C12 | S2 accès puis S5–S7 données | D1, D5 |

Les [contrats et modules](03_MODULES_ET_CONTRATS.md) et les [spécifications d'écrans](01_MAQUETTES_ET_PARCOURS.md) complètent chaque paquet. Une modification de maquette ou d'invariant met à jour cette traçabilité avant engagement.
