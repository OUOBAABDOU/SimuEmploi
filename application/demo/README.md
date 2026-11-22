# SimuEmploi — démonstration S0 sur l’ordinateur du porteur

Ce dossier ajoute un guide public d’essais à la référence S0-0.4. Il ne reçoit pas S0 et ne démarre pas un nouveau sprint métier. La branche de travail est `demo/hebergement-tests`.

## Ce que les testeurs peuvent essayer

| Espace | Fonctionnement réel | Limites |
|---|---|---|
| Guide | Dix consignes S0, exemples cliquables, notes, vérification de complétude, téléchargement JSON | Notes en mémoire de la page, sans transmission automatique |
| Application | Frontend React construit, catalogue servi par FastAPI, filtres, lecture des cinq questions | Pas de compte, séance réelle, réponses sauvegardées ou retour IA |
| Candidat | Maquette cliquable, règles adaptatives locales, pause, coupure, reprise, rapport partiel | Réponses fictives en mémoire ; aucun fournisseur IA |
| Audio / vidéo | Réglages, prises, relecture et direct simulés | Aucun accès au microphone ou à la caméra ; aucun média enregistré |

## Démarrer sur ce poste Windows

Prérequis : dépendances Python et frontend installées selon `application/README.md`, connexion Internet et cloudflared. Le binaire téléchargé depuis Cloudflare est placé dans `.tooling/cloudflared/cloudflared.exe`, hors Git. Sa signature Authenticode et sa version ont été vérifiées le 22 novembre 2026.

Depuis la racine du projet :

```powershell
.\application\start-demo.ps1
```

Le script construit le frontend avec la base `/application/`, lance FastAPI sur **127.0.0.1:5180** et ouvre un tunnel Cloudflare Quick Tunnel en HTTPS. Les deux processus sont lancés en arrière-plan, dans des fenêtres masquées. Le terminal peut ensuite être fermé ; l’ordinateur et la session Windows doivent rester actifs.

Le lien à partager est affiché et conservé dans **`.tooling/demo/lien-public.txt`**. Il change généralement à chaque nouveau lancement du tunnel. Ne pas ajouter ce fichier ni les journaux à Git.

```powershell
Get-Content .\.tooling\demo\lien-public.txt
```

Sur un poste neuf, télécharger cloudflared depuis la [publication officielle Cloudflare](https://github.com/cloudflare/cloudflared/releases/latest), choisir `cloudflared-windows-amd64.exe` pour Windows x64 et le placer sous le nom attendu. Vérifier sa signature avec `Get-AuthenticodeSignature` avant son exécution. Le script de lancement ne télécharge rien automatiquement.

## Arrêter et relancer

```powershell
.\application\stop-demo.ps1
.\application\start-demo.ps1 -SkipBuild
```

`stop-demo.ps1` contrôle le PID, l’heure de démarrage et le chemin de chaque processus avant d’arrêter son arbre. Il ne tue pas tous les processus Python du poste. `-SkipBuild` réutilise le frontend construit ; reconstruire après modification du code React.

Alternative dans deux terminaux attachés, avec arrêt par Ctrl+C :

```powershell
# Terminal 1, racine du projet
.\application\run-demo.ps1
# Terminal 2, racine du projet
.\application\run-demo-tunnel.ps1
```

Ne pas lancer les deux modes simultanément sur le même port.

## Comment organiser un essai à distance

1. Ouvrir le lien HTTPS sur le téléphone ou l’ordinateur du testeur. Un essai sur un autre réseau, par exemple les données mobiles, permet de vérifier l’accès extérieur. Un test depuis l’étranger doit être confirmé par un testeur situé ailleurs ; il ne peut pas être déduit d’un contrôle local.
2. Lire l’introduction : on teste les écrans, pas le candidat. Utiliser un exemple inventé et aucun nom, CV ou contact personnel. Si un animateur observe, il peut accompagner par un canal déjà convenu ; cette démo ne crée pas une visioconférence.
3. Choisir pays, objectif et rôle, accepter la participation et démarrer. Le code de séance est aléatoire. Les champs pays/objectif/rôle sont ensuite figés pour éviter de changer le contexte du compte rendu en cours.
4. Essayer T01–T10 et noter un résultat et une observation factuelle par tâche. Le bouton « Voir un exemple fictif » prépare l’écran avec une réponse inventée. Il ne coche aucun succès. Pour observer la découverte spontanée, laisser le testeur chercher avant de montrer l’exemple et noter l’aide apportée.
5. Les onglets Application et Médias sont des explorations complémentaires A01–A03 et M01–M04. Ils ne remplacent pas les dix tâches candidates. Les sélecteurs Écran / Situation sont des outils d’animation de maquette, pas des fonctions du futur produit.
6. Rédiger le bilan puis vérifier la complétude. Télécharger les observations et vérifier le fichier dans les téléchargements. Fermer/recharger la page perd les notes non exportées ; un avertissement apparaît si elles ont changé.
7. Le testeur remet le JSON au coordinateur par le canal convenu. Aucun envoi automatique, nom de destinataire ou collecte centrale n’est configuré. Le responsable relit les notes et atteste le contexte réel avant de les reporter dans l’atelier interne local à `http://127.0.0.1:5174/atelier.html`.

Les exports portent le schéma `simuemploi.demo-observations.v1`, avec `human_review_required: true` et `s0_received: false`. **Ils ne remplacent pas automatiquement `preuves-humaines.json`.** Les essais de développeurs et tests synthétiques sont séparés des essais candidats. Les retours étrangers peuvent compléter la relecture ; la qualification du marché burkinabè exige ses propres candidats.

## Accès, disponibilité et limites

Le tunnel crée une connexion sortante ; aucune redirection de port du routeur n’est nécessaire. Le serveur reste sur la boucle locale. Le lien est accessible à toute personne qui le possède et n’a pas de mot de passe. Cette démo est donc limitée à du contenu fictif ; une bêta avec comptes et réponses privées devra avoir une authentification et une politique de données qualifiée.

Cloudflare transporte le trafic HTTPS du test et voit les requêtes qui transitent par son service. La démo n’envoie les réponses de maquette et observations à aucun serveur applicatif. Les accès réseau nécessaires aux pages traversent néanmoins ce tunnel tiers.

Le tunnel temporaire ne fournit pas de domaine fixe ni de garantie de disponibilité. La veille, l’arrêt du PC, la fermeture de session, une panne électrique/réseau ou l’arrêt des processus coupent l’accès. Pour une séance prévue, brancher le poste, garder la session ouverte et éviter la veille pendant la séance. Aucun réglage d’alimentation ou pare-feu du poste n’est modifié par les scripts.

Le partage expose uniquement le guide, les deux maquettes sélectionnées, le frontend construit et les routes de lecture du catalogue. Il n’expose pas le serveur Vite, Swagger, OpenAPI, le dépôt, les documents internes, l’atelier de preuves ou un répertoire de fichiers. Les permissions de caméra, micro et géolocalisation sont désactivées pour la démo.

## Vérifier et diagnostiquer

```powershell
Invoke-RestMethod http://127.0.0.1:5180/health/live
Get-Content .\.tooling\demo\server.error.log -Tail 20
Get-Content .\.tooling\demo\tunnel.log -Tail 25
.\application\backend\.venv\Scripts\python.exe -m pytest application/tools/tests/test_demo_server.py -q
```

Les tests vérifient le catalogue réel, les maquettes et la frontière des fichiers exposés. Leurs résultats ne sont pas des essais candidats. Pour une disponibilité durable et un lien fixe, qualifier ensuite un domaine, un tunnel nommé et son contrôle d’accès ou un hébergement serveur ; ce serait une étape distincte de cette démonstration temporaire.
