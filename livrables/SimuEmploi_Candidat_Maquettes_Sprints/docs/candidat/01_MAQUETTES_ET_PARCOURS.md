# SimuEmploi — maquettes et parcours candidat

**Version proposée 0.1 — 20 novembre 2026.** Référence de conception modifiable avant et pendant les sprints. Les contenus, durées indicatives et domaines sont des exemples à relire avec les utilisateurs et référents burkinabè.

## 1. Périmètre retenu

Le premier produit comprend découverte, connexion, préférences, catalogue, simulation texte, retour, rapport, historique et demandes relatives aux données. Coaching privé et adultes au pilote, tant que le fournisseur et le cadre nécessaires aux autres publics ne sont pas adaptés.

Les espaces établissement/recruteur, paiements, audio avancé, CV/offres, vidéo et applications natives sont des extensions. Ils ne figurent pas dans la navigation du premier produit. Les quotas du pilote sont configurés côté serveur ; aucune offre commerciale illimitée n'est promise par les maquettes.

## 2. Deux variantes à comparer

**Parcours guidé :** accueil centré sur un exercice recommandé, une question à la fois et une aide contextuelle à la demande. Cette variante est proposée comme référence initiale, à vérifier auprès de candidats peu habitués aux outils numériques.

**Espace autonome :** accès plus direct au choix d'un objectif et, sur ordinateur, aide structurante à côté de la réponse. Même parcours métier, mêmes contrats et mêmes droits. Sur mobile, les colonnes se réorganisent verticalement.

Le choix définitif de présentation suivra une relecture du parcours. Le sélecteur d'écrans, de situations et de variantes appartient à la maquette de conception et ne doit pas devenir une fonction de l'application.

## 3. Règles communes de présentation

- Navigation : Accueil, Exercices, Historique, Mon compte. Sur mobile, navigation en bas du contenu ; sa fixation éventuelle sera vérifiée avec clavier virtuel et lecteur d'écran.
- Couleurs proposées : vert profond pour l'action principale, surfaces neutres, accents sobres. Les états d'erreur/attente portent toujours un texte, avec contrastes vérifiés lors de l'implémentation.
- Une action principale par étape ; actions secondaires clairement distinguées.
- Texte lisible, boutons tactiles d'environ 44 px au minimum, labels visibles et erreurs près du champ.
- Mise en page fluide dès 320 px ; contrôles sur 360 px, 736 px et 1024 px ; essais complémentaires sur appareils réels.
- Aucun score, benchmark ou promesse d'embauche ajouté pour remplir un écran.
- Les durées d'exercice sont indicatives. Les délais d'analyse et l'état de sauvegarde ne sont pas confondus.
- Les exemples de feedback sont des illustrations. Le produit réel utilise la réponse validée et la grille de sa session, jamais un retour statique de maquette.

## 4. Parcours nominal

C01 Découvrir → C02 Connexion → C03 Objectif → C04 Accueil → C05 Catalogue ou recommandation → C06 Préparation → C07 Réponse → C08 Retour → prochaine question → C09 Fin → C11 Rapport. C10 permet de retrouver une session ou un rapport, C12 de modifier les préférences et gérer ses données.

Le compte conserve un objectif modifiable. La session fige le scénario et sa grille. Une nouvelle préférence ne modifie pas un exercice déjà commencé.

## 5. Spécifications des écrans

### C01 — Découverte

**But :** comprendre l'utilité du service avant de créer un compte. Route proposée `/`.

**Contenu :** promesse de préparation, fonctionnement en trois étapes, texte sans média obligatoire, caractère privé du coaching et limite de la promesse d'embauche.

**Actions :** créer/se connecter à un compte → C02 ; voir les exercices publics → C05. La consultation publique ne donne pas accès aux sessions privées.

**Réception :** lecture et actions disponibles sur 320 px ; aucune caméra/microphone demandée ; navigation clavier ; contenu public léger. Responsable fonctionnel D4, revu par D1.

### C02 — Connexion

**But :** ouvrir ou retrouver un accès. Route d'entrée `/connexion` ; callback OIDC géré par l'API.

**Contenu :** message d'accès, action vers le fournisseur d'identité, liens vers conditions/notice et règles du pilote adulte. Le champ email de la proposition peut être supprimé si le fournisseur gère entièrement cette étape.

**Actions :** initier la connexion autorisée ; annuler/revenir ; recevoir une erreur compréhensible après échec. Première connexion → C03 ; connexion existante → C04 ou session autorisée initialement demandée.

**États :** attente de redirection, refus, session expirée, fournisseur indisponible. Un retour URL ne doit pas permettre une redirection libre vers un site non autorisé.

**Réception :** aucune gestion artisanale de mot de passe ; état/nonce/callback vérifiés ; paire issuer/subject liée à l'utilisateur interne ; cookie sécurisé et révocation testés. Responsable D1, revu par D5.

### C03 — Objectif et préférences

**But :** contextualiser les exercices. Route `/mon-objectif`.

**Champs :** objectif (emploi, stage, oral professionnel), domaine et expérience. Pays de lancement Burkina Faso, français de départ. Ne pas demander date de naissance précise, CV ou informations sensibles sans nécessité.

**Actions :** enregistrer → C04 ; modifier depuis C12. Les valeurs proviennent d'un référentiel serveur.

**États :** formulaire initial, sauvegarde, erreur de validation, réseau indisponible. La réussite n'est affichée qu'après confirmation serveur.

**Réception :** messages par champ ; clavier/lecteur d'écran ; propriétaire déduit de l'identité ; modification sans impact sur une session déjà figée. Responsable D1, revu par D2.

### C04 — Accueil candidat

**But :** savoir quoi faire maintenant. Route `/accueil`.

**Contenu :** exercice proposé selon préférence, bouton de préparation, dernier entraînement et lien vers historique. La recommandation initiale peut être déterministe à partir du catalogue relu ; elle ne nécessite pas un moteur IA de recommandation.

**États :** première utilisation sans historique ; session en pause ; analyse/rapport en attente ; dernier rapport disponible ; API temporairement inaccessible.

**Réception :** pas de carte vide ni de score fictif ; noms/textes accessibles ; affichage réservé au propriétaire ; statuts cohérents avec la base. Responsable D4, revu par D2.

### C05 — Catalogue d'exercices

**But :** choisir un exercice pertinent. Route `/exercices`.

**Contenu :** titre, domaine, objectif pédagogique, nombre de questions prévu, durée indicative et modalité texte. Domaines et scénarios de la maquette sont des exemples.

**Actions :** filtrer par domaine → résultats paginés/limités ; sélectionner → C06. Consultation publique possible pour les descriptions publiées.

**États :** catalogue chargé, chargement, aucun résultat, erreur, données préchargées en réseau faible. Les scénarios non publiés restent invisibles.

**Réception :** filtre conservé lors du retour ; pas de fuite de contenus non publiés ; limite serveur ; fiche associée à une version publiée. Responsable D2, revu par D4.

### C06 — Préparation de session

**But :** connaître les conditions avant de commencer. Route `/exercices/{id}/preparer`.

**Contenu :** objectif, plan, nombre de questions, durée indicative, modalité texte, pause/reprise, information sur l'analyse et minimisation des informations sur des tiers.

**Actions :** commencer → création idempotente de session puis C07 ; changer d'exercice → C05.

**États :** création en cours, quota atteint, scénario retiré, connexion indisponible. Un double clic n'ouvre pas deux sessions pour la même opération.

**Réception :** versions fixées serveur ; propriétaire serveur ; erreurs lisibles ; début possible sans micro/caméra. Responsable D2, revu par D1.

### C07 — Réponse à une question

**But :** répondre puis valider explicitement. Route `/sessions/{id}`.

**Contenu :** question courante, progression, zone de texte, statut du brouillon, action de validation et pause. L'aide situation/actions/résultat apparaît seulement pour une question où cette méthode convient.

**États :** brouillon local, validation en cours, sauvegarde confirmée, attente de synchronisation, conflit de version/droits, pause et échec réseau.

**Actions :** modifier brouillon ; relire aide ; valider → accusé sauvegardé puis C08 ; pause → reprise autorisée. Le nombre de mots est une aide descriptive, pas une note de compétence. Limites de taille fixées dans le contrat.

**Réception :** texte préservé après actualisation selon politique locale ; identité cohérente ; réponse unique pour une soumission ; même clé/contenu différent refusé ; serveur calcule la progression. Une réponse finalisée n'est pas modifiée silencieusement par « relire » : toute politique de correction est explicite. Responsables D2 (métier) et D4 (reprise/UI), revus par D3.

### C08 — Retour sur la réponse

**But :** comprendre un point d'appui et un point à retravailler. Route `/sessions/{id}/reponses/{answerId}/retour` ou sous-vue autorisée de session.

**Contenu nominal :** critère, commentaire, extrait réel et conseil applicable. Retour associé à la bonne réponse/grille/version.

**États :** réponse sauvegardée/analyse en cours ; résultat valide ; indisponible ; attente de synchronisation. Une réponse encore locale n'est pas présentée comme évaluée. Les erreurs ne produisent pas une note de remplacement.

**Actions :** consulter à nouveau ; réessayer si autorisé ; passer à la question suivante ; continuer sans retour selon plan ; signaler une erreur ; relire la réponse finalisée en lecture seule.

**Réception :** aucun extrait absent de la réponse ; action de reprise idempotente et bornée ; pas de passage automatique silencieux ; pause et prochaine question cohérentes serveur. Responsable D3, revu par D2.

### C09 — Fin de session

**But :** confirmer la fin et choisir la suite. Route `/sessions/{id}/fin`.

**Contenu :** fin de l'exercice, état du rapport, possibilité de revenir à l'accueil. Fin de session et rapport prêt sont deux états distincts.

**Actions :** terminer de façon idempotente ; consulter rapport → C11 ; accueil → C04. Les rapports tardifs citent l'ensemble cohérent d'entrées figées.

**Réception :** dernière réponse conservée même en panne IA ; double demande de fin sans travail/consommation supplémentaire ; aucune fin prématurée décidée par le client. Responsable D2, revu par D3.

### C10 — Historique

**But :** retrouver un essai ou une session interrompue. Route `/historique`.

**Contenu :** scénario, date locale correctement formatée, état session/rapport, actions reprendre ou consulter. Aucun classement entre candidats ni comparaison de versions incompatibles.

**États :** vide, chargement, pagination, session en pause, rapport en attente/prêt/partiel/indisponible.

**Réception :** pagination stable ; propriété serveur ; lecture de ressources supprimées refusée ; statut synchronisé après reprise. Responsable D4, revu par D1.

### C11 — Rapport

**But :** choisir un prochain axe de travail. Route `/sessions/{id}/rapport`.

**Contenu :** points d'appui, conseils prioritaires, extraits, réponses/évaluations citées, modalités mesurées, limites, versions du scénario/grille. Aucune mesure vocale ou vidéo dans le premier produit texte.

**États :** préparation, prêt, partiel, indisponible. La partie manquante d'un rapport partiel est annoncée.

**Actions :** nouvel exercice, retour historique, signalement ; éventuelle vue d'impression après mise en page fiable. L'export PDF professionnel et le partage à un établissement ne sont pas requis dans ce lot.

**Réception :** rapport stable par version ; mêmes droits que session ; pas de résultat tardif invalide ; retour exploitable sur mobile ; signalement enregistré avec contexte autorisé. Responsable D4 (lecture/UI) avec D3 (génération), revus par D5.

### C12 — Compte et données

**But :** modifier ses préférences et exercer ses demandes. Route `/mon-compte`.

**Contenu :** préférences, gestion de l'accès, notice, export et suppression. Le statut d'une demande suit son traitement réel.

**Actions :** préférences → C03 ; déconnexion ; demande d'export/suppression → confirmation puis statut. L'automatisation complète peut suivre un traitement administratif contrôlé au pilote, mais un mécanisme réel de demande et de suivi est nécessaire.

**Réception :** demande réservée au propriétaire ; confirmation avant suppression ; révocation/déconnexion et nettoyage local définis ; jobs invalidés et droits contrôlés à la publication ; restauration réappliquant les suppressions. Responsable D1 avec D5, revus par D4.

## 6. États transversaux à développer

| État | Message et comportement requis | Vérification |
|---|---|---|
| Chargement initial | Indiquer l'attente sans contenu inventé | Réseau lent et lecteur d'écran |
| Sauvegarde en cours | Éviter le double clic ; conserver l'identifiant | Timeout et nouvel essai |
| Brouillon local | « Sur cet appareil » | Actualisation et changement de compte |
| Réponse confirmée | Accusé serveur ; état stable | Coupure après commit |
| Analyse en cours | Retour différé ; navigation/reprise possible | Worker arrêté puis repris |
| Analyse indisponible | Erreur explicite ; reprise/continuation permises selon règle | Fournisseur en erreur et JSON invalide |
| Quota atteint | Expliquer limite et suite disponible | Soumissions concurrentes |
| Session expirée | Reconnexion puis reprise sous même identité | Session d'accès expirée |
| Rapport partiel | Nommer les limites et mesures manquantes | Une évaluation absente |
| Absence de contenu | Action utile, sans tableau vide trompeur | Premier compte et filtre sans résultat |

## 7. Modification des maquettes

Chaque changement reçoit un identifiant, les écrans concernés, le besoin observé et les critères touchés. Mettre à jour version de maquette, contrat/API éventuel et tâche de sprint ensemble. Une préférence esthétique seule ne doit pas modifier le modèle métier.

Relecture avec quelques candidats adultes sur mobile puis ordinateur ; observer choix d'exercice, compréhension de sauvegarde/analyse, lecture du retour et reprise. Cette relecture exploratoire ne constitue pas un échantillon représentatif national.

Les maquettes doivent être relues avant engagement des tâches UI du sprint concerné. Les développeurs utilisent les mêmes composants, libellés et états ; les variantes restent comparables et modifiables. Les cinq développeurs partagent les revues plutôt que de créer cinq designs distincts.

## 8. Références visuelles

Les captures et leur portée sont décrites dans [la vérification des maquettes](VERIFICATION_MAQUETTES.md). Les interactions de conception simulent uniquement les transitions ; leur comportement n'est pas une preuve du backend à construire.
