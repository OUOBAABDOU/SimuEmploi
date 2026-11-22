# SimuEmploi — ajustements UX et illustrations du parcours candidat

**Version 0.2 — 20 novembre 2026.** Proposition de conception pour le Burkina Faso, avec extension progressive vers le Mali et le Niger. Les changements ci-dessous concernent les maquettes ; ils ne constituent ni un déploiement ni une validation par des utilisateurs réels.

## 1. Ce qu’il faut améliorer en priorité

Le candidat doit pouvoir répondre à quatre questions : « Quel exercice choisir ? », « Que dois-je faire maintenant ? », « Où est conservée ma réponse ? » et « Comment utiliser le retour ? ». La qualité des images vient soutenir cette compréhension.

| Référence | Besoin et ajustement | Écrans | Priorité | État de cette version |
|---|---|---|---|---|
| UX-01 | Montrer le fonctionnement en trois étapes et permettre de voir les exercices avant la connexion | C01/C02 | Essentiel | Parcours et libellés révisés |
| UX-02 | Supprimer le champ email sans fonction et présenter une entrée de connexion compréhensible | C02 | Essentiel | Bouton unique ; connexion réelle à implémenter avec le fournisseur retenu |
| UX-03 | Limiter les préférences initiales et permettre de choisir plus tard | C03 | Utile | Action secondaire ajoutée ; valeurs réelles à connecter |
| UX-04 | Mettre la reprise de session avant la proposition d’un nouvel exercice | C04/C10 | Essentiel | Reprise de la session de démonstration depuis l’accueil et l’historique |
| UX-05 | Montrer objectif, domaine, durée indicative, modalité et illustration sur les fiches | C05/C06 | Utile | Quatre fiches illustrées ; filtres conservés dans la démonstration |
| UX-06 | Préserver le contexte de la session lorsque le candidat explore un autre exercice | C05/C06/C07 | Essentiel | Exercice préparé et exercice en cours distingués ; avertissement avant remplacement du brouillon de démonstration |
| UX-07 | Distinguer brouillon local, réponse confirmée et analyse en cours | C07/C08/C10 | Essentiel | Libellés revus ; garanties de stockage à implémenter |
| UX-08 | Laisser un nouvel essai vide et proposer une aide adaptée à la question | C07 | Essentiel | Texte initial retiré au démarrage ; aide visuelle repliable et contextualisée |
| UX-09 | Présenter une seule piste de progrès et une suite claire | C08/C11 | Essentiel | Hiérarchie des retours simplifiée ; signalement accessible |
| UX-10 | Indiquer précisément la partie manquante d’un rapport partiel | C11 | Essentiel | Exemple mentionnant le retour manquant de la question 3 |
| UX-11 | Distinguer fin de l’exercice et disponibilité du rapport | C09 | Essentiel | Message et illustration de fin ; accès au rapport et à l’accueil |
| UX-12 | Ouvrir réellement l’aide et les informations de confidentialité dans la maquette | Transversal/C12 | Essentiel | Panneaux ouvrables et fermeture ; notices définitives à produire |
| UX-13 | Améliorer lecture, taille des champs, focus et espaces sur mobile | Tous | Essentiel | Champs à 16 px sur mobile, actions d’au moins 44 px, erreurs près du champ, initiales corrigées |
| UX-14 | Ajouter des illustrations légères sans faire dépendre le parcours de leur chargement | C01/C04/C05/C06/C09/C10 | Utile | Quatre scènes, chacune en apparence claire et sombre |

« Essentiel » signifie nécessaire à un parcours compréhensible et fiable. « Utile » signifie que l’ajustement facilite l’usage mais ne doit pas retarder la correction d’un défaut de sauvegarde ou d’accès.

## 2. Règles d’expérience à garder dans le produit réel

### Un premier usage court

La découverte explique l’entraînement avant de demander un compte. Les descriptions d’exercices publiées peuvent être publiques. Avant de créer une session privée, le produit doit demander l’authentification puis revenir à l’exercice choisi. Une consultation publique ne donne aucun droit sur les réponses ou les rapports d’un candidat.

Les préférences initiales restent limitées : objectif, domaine, expérience. Si le candidat choisit plus tard, présenter un exercice général sans inventer une préférence enregistrée. Lorsqu’il revient sur son objectif, conserver les choix confirmés et ne pas modifier une session déjà créée.

### Une sauvegarde compréhensible

| Situation réelle | Message proposé | Action et preuve attendues |
|---|---|---|
| Saisie locale | Brouillon sur cet appareil | Conservation locale selon la politique retenue ; aucune promesse de présence sur un autre appareil |
| Validation demandée | Envoi en cours… | Bloquer les doubles soumissions de la même opération ; conserver le texte et l’identifiant |
| Accusé serveur reçu | Réponse sauvegardée | Affichage après confirmation de la bonne session/réponse/version |
| Absence de connexion | Brouillon à synchroniser | Reprise d’envoi sous la même identité, sans perdre le texte |
| Sauvegarde confirmée, travail IA en attente | Retour en préparation | L’utilisateur peut quitter puis revenir à la session |
| Travail IA en échec | Retour indisponible, réponse conservée | Réessai autorisé ou continuation prévue ; aucune appréciation inventée |

Ne pas utiliser une animation de coche ou un message « sauvegardé » à la place de l’accusé serveur. Une estimation du temps d’analyse ne doit pas devenir une promesse de délai fixe.

Le brouillon de la maquette est conservé **en mémoire pendant la démonstration**. L’actualisation de la page, la fermeture du navigateur ou le changement d’appareil n’ont pas été couverts par une persistance réelle. Le produit doit définir et vérifier IndexedDB, expiration, isolation par compte, nettoyage à la déconnexion et conflits de synchronisation avant de promettre cette reprise.

### Une aide adaptée, sans réponse imposée

Une question sur une expérience peut proposer Situation → Actions → Résultat. Une question de motivation propose Motivation → Exemple → Objectif. Une question sur l’organisation propose Contexte → Démarche → Vérification. La méthode figure dans le contenu pédagogique versionné de la question ; elle ne doit pas être choisie uniquement par son numéro.

L’aide est disponible à la demande dans le parcours guidé ; elle apparaît à côté de la réponse dans la variante autonome sur ordinateur. Les colonnes se réorganisent sur mobile. Les repères numérotés restent accompagnés de textes complets.

Un candidat sans emploi précédent peut utiliser un projet scolaire, associatif, personnel ou une expérience informelle pertinente. Les formulations ne doivent pas imposer un passé professionnel salarié. Le temps de l’exercice et le nombre de mots restent des repères. Le seuil local de 20 caractères est une simulation de validation de maquette, pas un critère de compétence ni une règle universelle à recopier.

### Un retour qui aide à agir

Le retour réel doit expliquer un point d’appui, une piste de progrès et une action suivante. Un extrait cité doit appartenir à la réponse concernée. Les commentaires statiques des maquettes portent un avertissement visible et ne tiennent pas compte du texte saisi.

Le rapport conserve une priorité principale, avec les détails accessibles ensuite. Un rapport partiel nomme les questions ou analyses manquantes. Aucun score fictif, classement entre candidats, mesure de personnalité, évaluation faciale ou promesse d’embauche ne doit être ajouté comme décoration.

### Une navigation qui préserve l’essai

L’accueil et l’historique montrent les sessions interrompues avec une action de reprise. Si la réponse est déjà validée, la reprise retrouve son retour ou sa lecture seule. Si elle est encore un brouillon, elle retrouve le champ modifiable.

Dans la maquette, un nouvel essai peut remplacer le brouillon unique de démonstration après avertissement. **Ce comportement ne définit pas une règle serveur de suppression.** Le produit conserve des identifiants distincts de session et doit permettre de retrouver un essai précédent conformément à sa politique ; toute perte d’un brouillon doit être évitée ou explicitement acceptée. Explorer un nouveau scénario ne change pas le scénario de la session active.

## 3. Illustrations ajoutées et règles de réutilisation

Quatre scènes originales ont été dessinées pour cette proposition. Ce sont des illustrations de conception, sans photographie ni génération IA.

| Scène | Fonction | Usages actuels |
|---|---|---|
| Préparer | Montrer une personne en train de préparer sa réponse | Découverte, accueil, stage |
| Commerce | Identifier une situation de service client | Catalogue et préparation |
| Organiser | Identifier les tâches administratives | Catalogue, préparation, filtre sans résultat |
| Progresser | Accompagner la fin d’un essai et le premier pas | Présentation professionnelle, fin, historique vide |

Les huit fichiers WebP mesurent 480 × 320 px et pèsent chacun environ 8 à 9 Ko. Deux palettes permettent de suivre l’apparence claire ou sombre. Les sources SVG et le générateur local sont fournis pour modifier les scènes ; les textes, labels et boutons restent dans l’interface, indépendamment des images.

- Utiliser les WebP pour la livraison du produit ; garder les sources éditables dans le dossier de conception.
- Conserver largeur et hauteur pour réserver l’espace et éviter les sauts de mise en page.
- Garder les illustrations secondaires ; la première action reste avant l’image sur les petits écrans de découverte.
- Les images de cette version sont décoratives : alternative vide et retrait du parcours du lecteur d’écran. Une image informative future devra avoir une alternative décrivant son information.
- Prévoir une version sans médias décoratifs en contexte de connexion limitée, sans supprimer les questions, les aides ou les boutons.
- Précharger seulement ce qui sert au parcours courant ; ne pas rendre obligatoire le téléchargement de toute une bibliothèque d’images.
- En cas d’ajout de photographies, vérifier les droits et consentements, leur pertinence locale et leurs tailles avant intégration. Éviter l’idée qu’une tenue, une ville ou un niveau de diplôme représente tous les candidats.

La maquette intègre les WebP directement pour pouvoir être relue sans connexion. Le frontend réel pourra les servir comme fichiers statiques versionnés et mis en cache. Ce choix d’assets n’impose aucun microservice supplémentaire.

## 4. Répartition pour les cinq développeurs

Ces tâches précisent les paquets du plan existant. Elles doivent être estimées dans leur capacité ; elles ne s’ajoutent pas gratuitement aux huit sprints.

| Responsable | Paquets concernés | Travail détaillé | Critères de réception | Revue |
|---|---|---|---|---|
| D1 | S0-D1, S2-D1, S6-D1 | Dessiner entrée de connexion et reprise après expiration ; préserver destination autorisée ; rendre les préférences facultatives ; afficher les notices et le statut réel des demandes ; nettoyer les données locales à la déconnexion | Parcours au clavier ; échec d’accès expliqué ; connexion revient à la ressource autorisée ; aucune confirmation fictive de sauvegarde/export ; compte suivant ne voit pas le brouillon précédent | D5 pour identité/données, D4 pour compréhension |
| D2 | S0-D2, S2-D2, S3-D2, S5-D2 | Fournir objectif, question, aide et versions du scénario ; maintenir filtre au retour ; distinguer exercice exploré/session active ; afficher reprise et création d’un nouvel essai avec identifiants distincts | Question et aide du scénario sélectionné ; catalogue vide récupérable ; exploration ne modifie aucune réponse ; session validée reste stable | D3 pour provenance, D4 pour parcours |
| D3 | S0-D3, S4-D3, S6-D3 | Produire un retour fondé sur la réponse ; différencier sauvegarde/travail en attente/erreur ; rendre les limites explicites ; associer le signalement à la bonne évaluation | Citation présente dans la réponse ; aucune appréciation de secours en panne ; rapport partiel nomme les absences ; commentaires compris lors des essais | D2 pour liaison métier, D4 pour lecture |
| D4 | S0-D4, S1-D4, S3-D4, S5-D4, S6-D4 | Créer composants partagés et tokens ; intégrer les illustrations ; adapter layout mobile ; gérer brouillons, focus et aide repliable ; prioriser reprise et prochain conseil | Lecture à 320 px et zoom ; clavier virtuel sans action masquée ; erreur au champ ; retour du focus après annulation ; parcours utilisable sans images | D1 pour accès, D5 pour performance |
| D5 | S1-D5, S3-D5, S6-D5, S7-D5 | Livrer assets statiques et cache ; mesurer poids/latence ; vérifier sauvegarde réelle, panne et restauration ; configurer observabilité sobre et suivi des demandes | Coupure puis reprise sans doublon ; images ne bloquent pas le texte ; aucun texte candidat brut dans les traces produit ; restauration respecte suppressions et droits | D2 pour état métier, D1 pour données |

**En S0 :** relire cette version et les messages avec le porteur et des candidats avant de figer la référence. **En S1 :** construire les composants et assets partagés. **En S2–S5 :** brancher progressivement les états réels. **En S6 :** vérifier appareils, accessibilité et réseau. **En S7 :** corriger les blocages du pilote et observer l’usage réel.

Une bibliothèque de composants unique évite que chaque développeur crée son bouton, sa carte ou son message d’état. Les cinq développeurs restent full stack et responsables des contrôles de leurs fonctions.

## 5. Adaptation Burkina Faso, puis AES

La priorité mobile et la tolérance aux coupures sont des choix de conception à vérifier sur le terrain, sans supposer que tous les candidats ont les mêmes appareils ou la même connexion. Le français constitue la proposition de départ ; le besoin d’autres langues devra être étudié avec des candidats et des référents.

Avant l’extension au Mali et au Niger : relire scénarios et vocabulaire avec des personnes de chaque pays, adapter référentiels métiers et textes de service, externaliser les traductions et formats de dates, et revoir les règles d’accès et de données applicables. Un sélecteur de pays ne suffit pas à rendre le service adapté à l’AES.

Ne pas ajouter aujourd’hui un catalogue international incomplet ni une fonctionnalité de traduction automatique sans évaluation. Les modules séparés permettent d’étendre pays, contenus et acteurs au rythme des besoins observés.

## 6. Recette de compréhension avant développement et pilote

Commencer par 6 à 8 candidats adultes avec des profils différents : recherche de premier stage, reconversion, expérience professionnelle, usages numériques variés et appareils disponibles. Cette première série est exploratoire et ne permet pas de conclure pour toute la population. Ajouter des participants utilisant des aides techniques dès la conception.

| Tâche observée | Consigne neutre | Ce qu’on regarde |
|---|---|---|
| Comprendre le service | Découvrez le service et expliquez ce qu’il vous permet de faire | Compréhension de l’entraînement et de ses limites |
| Choisir un exercice | Préparez un entretien de stage | Choix sans guidage et compréhension de l’objectif |
| Répondre | Commencez et rédigez une réponse | Repérage du champ, de l’aide et de la validation |
| Comprendre la conservation | La connexion est coupée ; où est votre réponse ? | Distinction appareil/serveur et action suivante |
| Reprendre | Faites une pause puis retrouvez votre essai | Accès à la bonne session et au même texte |
| Utiliser un retour | Expliquez ce que vous feriez au prochain essai | Capacité à nommer une action concrète |
| Gérer un échec | Le retour est indisponible ; choisissez la suite | Réessai/continuation sans confusion sur la réponse |
| Comprendre ses droits | Retrouvez les informations sur vos données | Accès à la notice et distinction demande/traitement |

Observer sans donner le chemin. Noter réussites, hésitations, erreurs, durée et besoin d’aide, avec consentement et données minimales. Une perte de réponse, une confusion récurrente sur la sauvegarde ou un blocage d’accès empêche de considérer le parcours prêt. Corriger puis refaire les tâches concernées avec d’autres personnes. Définir les seuils de réussite du pilote après cette première mesure ; ne pas inventer des taux de satisfaction.

## 7. Vérification disponible et limites

Les contrôles locaux et les captures figurent dans [VERIFICATION_MAQUETTES.md](VERIFICATION_MAQUETTES.md). Les vérifications de cette maquette couvrent le rendu et certaines interactions locales. Elles ne prouvent pas une sauvegarde durable, une identité réelle, la qualité du fournisseur IA, une conformité réglementaire ni une accessibilité complète.

La référence guidée reste la proposition de départ ; la variante autonome reste disponible pour comparer la compréhension et les préférences. Le choix final doit suivre les observations des candidats.
