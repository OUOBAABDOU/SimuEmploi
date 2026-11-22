# SimuEmploi — lots audio/vidéo pour cinq développeurs full stack

**20 novembre 2026 — proposition à estimer.** Ce plan complète S0–S7. Il n’intègre pas silencieusement toutes les fonctions médias dans les seize semaines proposées pour le parcours texte. Les maquettes des modalités sont conçues dès maintenant ; leur développement suit la capacité mesurée, les choix produit et la qualification des fournisseurs.

Quatre lots AM0–AM3 peuvent être organisés en sprints de deux semaines ou redécoupés. Ils ne constituent pas une promesse de livraison en huit semaines. Estimer les paquets, dépendances et essais terrain avant engagement. D1 à D5 désignent les cinq développeurs humains ; tous restent responsables d’une tranche frontend/backend et de ses vérifications.

## AM0 — Contrats, appareils et référence de conception

**Objectif :** fixer les règles des modalités et réduire les risques de navigateur/fournisseur avant la capture de production.

| Paquet | Travail détaillé | Réception | Dépendance et revue |
|---|---|---|---|
| AM0-D1 | Définir permissions/consentements ; choix de transmission/replay ; expirations et accès aux prises | Matrice claire capture/transmission/conservation ; connexion expirée ne rend pas une prise accessible au compte suivant | Politique de données ; D5 et D4 |
| AM0-D2 | Fixer contrat prise/session/question ; changement de modalité ; nouvelle prise/version ; limites du plan | Explorer ou reprendre ne modifie pas une réponse finalisée ; identité de prise et révisions documentées | Modules simulation/catalogue ; D3 |
| AM0-D3 | Qualifier transcription, voix de questions et dialogue ; corpus de français local ; erreurs et coûts | Fournisseur testé sur corpus consenti, sortie versionnée et erreurs explicites ; aucune qualité supposée sans résultat | Référents et accès fournisseur ; D2/D5 |
| AM0-D4 | Relire M01–M12 ; fabriquer composants lecteur/aperçu/états ; vérifier codecs et permissions sur appareils | Prototype navigateur avec états de refus et secours ; ergonomie mobile et clavier relue | Appareils disponibles ; D1 |
| AM0-D5 | Définir stockage privé, envoi reprenable, limites, rétention et observabilité ; benchmark technique | Contrats de finalisation et preuve de réception ; coût/poids/temps mesurés ; broker sans fichiers bruts | Exploitation et budgets ; D2 |

**Sortie :** maquettes relues, première matrice appareils/codecs, contrats préparés, fournisseur qualifié ou lacunes explicites. Une lacune bloquante entraîne un redécoupage.

## AM1 — Audio enregistré et transcription fiable

**Objectif :** question → prise audio → relecture → envoi confirmé → transcription corrigible → retour.

| Paquet | Travail détaillé | Réception | Dépendance et revue |
|---|---|---|---|
| AM1-D1 | Autoriser prises et téléchargements ; consentement avant envoi ; reprise sous la même identité | Lecture A/B interdite ; aucune transmission sans choix ; réauthentification ne perd pas le lien au propriétaire | Contrats AM0 ; D5 |
| AM1-D2 | Créer/finaliser prises ; lier à question/version ; idempotence d’envoi et de validation | Un retry conserve la même opération ; fichier incomplet non déclaré reçu ; progression réelle cohérente | Stockage D5 et capture D4 ; D3 |
| AM1-D3 | Worker ASR ; statut attente/erreur ; révisions de transcription ; évaluation de la version confirmée | Correction ne change pas le média ; aucun résultat sur version obsolète ; citations présentes | Corpus/fournisseur AM0 ; D2 |
| AM1-D4 | Capture audio, pause/arrêt, lecteur natif, erreurs de permission ; écrans envoi/transcription | Sons accessibles après geste utilisateur ; état de capture réel ; pas de perte silencieuse ni d’action cachée par le clavier | Contrats D1–D3 ; D1 |
| AM1-D5 | Envoi autorisé, confirmation de fichiers, gestion des segments, outbox et nettoyage | Coupure avant/après finalisation reçue ; reprise sans doublon ; limite et quota expliqués ; restauration maîtrisée | Infrastructure AM0 ; D2 |

**Démonstration :** une prise réelle sur appareils de test, avec refus de permission, coupure d’envoi et correction d’une transcription. Utiliser données d’essai consenties et durées de conservation définies.

## AM2 — Vidéo, replay et transitions de modalité

**Objectif :** ajouter aperçu et enregistrement vidéo réels, en conservant le contrôle de l’envoi et la relecture personnelle.

| Paquet | Travail détaillé | Réception | Dépendance et revue |
|---|---|---|---|
| AM2-D1 | Droits vidéo et choix séparés de transmission/conservation ; accès privés et suppression | Vidéo locale par défaut ; permission navigateur distincte du choix d’envoi ; demandes couvrent prises et dérivés | Politique de données et AM1 ; D5 |
| AM2-D2 | Modèles de prises multimodales ; audio extrait/lié ; bascule vidéo→audio/texte ; règles de nouvelle prise | Chaque entrée reste liée à son origine/version ; pas de mélange de réponses entre modalités | Contrats AM1 ; D3 |
| AM2-D3 | Transcription de l’audio de la vidéo ; retours de contenu ; limites du rapport multimodal | Aucune note comportementale inventée ; sources réellement utilisées identifiées ; fichier incompatible en erreur explicite | Prises D2 et worker existant ; D4 |
| AM2-D4 | Aperçu, choix caméra, lecteur natif, orientation/cadrage ; relecture avant envoi | Caméra arrêtée quand requis ; micro/caméra absents récupérables ; contrôles utilisables avec clavier et écran mobile | Capture AM1 ; D1 |
| AM2-D5 | Taille/durée/quota ; extraction technique sûre ; stockage vidéo facultatif et suppression | Encodages qualifiés ; fichier valide avant traitement ; vidéo non envoyée par défaut ; charge mémoire et réseau mesurées | Essais codecs AM0 ; D2 |

**Démonstration :** vidéo locale puis audio transmis pour conseil ; envoi vidéo facultatif si retenu ; caméra absente → audio ; coupure et replay indisponible expliqués.

## AM3 — Dialogue vocal en direct et pilote multimodal

**Objectif :** permettre un dialogue contrôlable, mesurer latence et qualité, puis ouvrir un pilote limité. La vidéo transmise en direct est un sous-lot conditionné par le besoin et la capacité du fournisseur.

| Paquet | Travail détaillé | Réception | Dépendance et revue |
|---|---|---|---|
| AM3-D1 | Autoriser session de transport éphémère ; budget ; choix de transmission/replay ; révocation | Aucun secret durable au navigateur ; accès borné ; fin ferme les droits du dialogue ; identité explicite à la reprise | Fournisseur qualifié ; D5 |
| AM3-D2 | États du dialogue, tours confirmés, interruption, pause/reprise, fin ; transition vers réponse enregistrée | Coupure ne confirme pas une réponse perdue ; question courante cohérente ; aucune mutation par simple lecture | Adaptateur D3 ; D4 |
| AM3-D3 | Adaptateur de dialogue, voix/questions/sous-titres ; interruption du coach ; erreur fournisseur | Barge-in réel contrôlé ; transcription finale versionnée ; coût/latence/qualité mesurés sur corpus local | Accord et capacité fournisseur ; D2/D5 |
| AM3-D4 | Écran direct, mute, caméra locale ou transmise, sous-titres, pause et fin ; tests de compréhension | État visible fidèle aux flux ; capture arrêtée à la fin ; solution de secours accessible ; lecteurs d’écran testés | Contrats D1–D3 ; D1 |
| AM3-D5 | Exploitation transport, réseau, éventuel TURN, métriques sobres, budgets et restauration | Sessions orphelines arrêtées ; limites de coût ; aucune donnée brute sensible dans les logs produit ; charge pilote mesurée | Environnement réseau et fournisseur ; D3 |

**Démonstration :** échange réel puis interruption, micro coupé, perte réseau, reprise/fin et rapport. Ne pas ouvrir le pilote sur la seule réussite d’une maquette ou d’un appel de démonstration.

## Règles communes de fin de paquet

Une tâche est terminée quand ses critères sont observés sur l’environnement de test, relus par le pair, et documentés avec les limites. Les tests portent sur capture/transport/stockage réels lorsque le lot les implémente. Chaque développeur écrit les vérifications de sa tranche ; D5 ne devient pas l’unique testeur.

Les contenus de maquette sont retirés ou explicitement marqués comme fixtures de test. Le produit réel ne présente pas des médias fictifs, des transcriptions statiques ou des progressions simulées comme des résultats du candidat.
