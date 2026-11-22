# Relecture interne du premier corpus

Référence S0-0.4, 22 novembre 2026. **Les trois banques version 3, leurs aides, critères et limites adaptatives sont approuvées par OUOBA Abdou Rasmané le 22 novembre 2026**, après lecture, dans ce chat. La relecture interne de conception et les corrections antérieures sont conservées ci-dessous. Cette approbation ne qualifie pas les questions futures d’un modèle IA et ne remplace pas les essais candidats.

## Corpus proposé

- Premier entretien de stage : motivation, projet, apprentissage d’une tâche, organisation et question à poser.
- Premier entretien d’emploi : intérêt pour le poste, compétence, difficulté, travail avec d’autres et premiers repères.
- Présentation de parcours : objectif, exemple, apprentissage, lien au poste et idée à retenir.

Chaque scénario comporte une banque de cinq questions/axes, trois critères qualitatifs et des conseils simples. La première question est déterminée ; les suivantes dépendent du tour précédent confirmé. Le candidat ne reçoit pas obligatoirement les cinq libellés de référence dans cet ordre. Les quinze questions complètes sont dans `corpus-relecture.json` et dans l’atelier. Les durées de 10–15 minutes sont indicatives et seront confrontées aux essais.

## Ajustements effectués dans la proposition version 2

| ID | Constat | Ajustement / raison |
|---|---|---|
| RM-01 | Stage, question `deadline` : démarche hypothétique, mais critère exigeant un exemple réel | Remplacer `concrete_example` par `clarity`. Une démarche pertinente n’exige pas d’inventer une expérience. |
| RM-02 | Présentation, question `goal` : expliquer un lien à un poste, avec exigence d’un nouvel exemple concret | Retenir `relevance` et `clarity`. L’exemple a déjà sa question dédiée ; ne pas imposer une deuxième anecdote. |
| RM-03 | Questions réelles, hypothétiques et explicatives non distinguées | Ajouter `response_kind` dans le corpus de relecture ; l’évaluation future respecte ce type. |
| RM-04 | Anciennes maquettes proposant plusieurs métiers en plus de la priorité retenue | Adapter une copie au corpus premier stage/emploi et présentation ; garder l’original historique. |
| RM-05 | Aide générique parfois différente de la question posée | Injecter les conseils de chaque question dans la copie de maquette. |
| RM-06 | Ancienne validation de maquette imposant 20 caractères pour avancer | Accepter un texte non vide. La longueur ne démontre pas la compétence ; l’exemple vide reste interdit. |
| RM-07 | Maquette pouvant laisser croire à une conservation locale durable | Ajouter une notice permanente : mémoire de démonstration, perdue à l’actualisation, aucune sauvegarde serveur. |

Ces modifications sont faites uniquement dans le dossier de relecture. Une publication dans le catalogue réel nécessitera la validation et un changement explicite de version.

## Critères à utiliser

**Pertinence :** la personne répond à la demande avec des éléments liés à l’objectif. Une compétence peut venir de l’école, d’une activité familiale, associative ou informelle.

**Clarté :** on comprend les idées et la démarche. Ne pas confondre clarté et accent, niveau de langue prestigieux, longueur ou personnalité. Une difficulté d’expression justifie une aide et une vérification de compréhension, pas une inférence sur la valeur de la personne.

**Exemple concret :** seulement quand la question le demande. Le contexte, la contribution et le résultat ou apprentissage appartiennent à ce que la personne a décrit. Aucun résultat chiffré n’est obligatoire ; aucun parcours n’est inventé.

Aucun score global, diagnostic de personnalité ou classement d’employabilité n’est défini en S0. L’oral et la vidéo ne donnent pas accès à des appréciations d’émotion, d’apparence ou de confiance présumée.

## Travail du relecteur métier

Pour chaque scénario, lire chaque question avec son type, ses conseils et ses critères. Vérifier : utilité pour le premier stage/emploi, vocabulaire compris localement, absence de diplôme/emploi salarié implicite, aide adaptée et conseil utilisable. Répondre « approuvé » seulement après lecture des cinq questions et de la grille ; sinon préciser la question et la modification demandée.

Échantillons de réponses à construire avec le référent : absence d’emploi salarié, activité informelle, projet scolaire, réponse brève compréhensible, réponse hors sujet et demande d’aide. Toute réponse d’exemple doit être fictive ou utilisée avec une autorisation adaptée. Les réponses des candidats aux essais ne deviennent pas automatiquement des données pour entraîner un modèle.

La décision est enregistrée dans l’atelier avec relecteur, date, version et notes. Un changement après approbation exige une nouvelle version et une nouvelle relecture de son périmètre.

Les avis reçus sont dans `preuves-humaines.json` et affichés dans l’atelier. Les métadonnées de préparation du corpus restent celles de sa construction ; elles ne constituent pas le registre des approbations. Le catalogue applicatif historique d’exemples n’est pas publié ou modifié par cette relecture.

## Évolution adaptative reçue le 22 novembre

La banque est portée à la version 3 avec une politique adaptative : cinq axes, maximum proposé sept questions dont deux relances. Les corrections de critères de la version 2 sont conservées. Relire aussi les règles de pertinence des relances, leur lien au tour précédent, les questions interdites et les limites dans `07_ENTRETIEN_ADAPTATIF_ET_MULTI_IA.md`. L’approbation de la banque ne qualifie pas à elle seule les questions produites par un fournisseur futur.
