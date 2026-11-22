# Vérification technique de la démo — 22 novembre 2026

Ces contrôles concernent le logiciel et son partage. Ils ne constituent aucune séance réelle avec un candidat et ne modifient pas la réception de S0.

| Contrôle | Résultat constaté |
|---|---|
| Construction React/TypeScript avec base `/application/` | Réussie |
| Serveur de démo : tests pytest | 13 tests réussis |
| Ruff du serveur et de ses tests | Conforme, format vérifié |
| Syntaxe des quatre scripts PowerShell | Aucune erreur de parsing |
| Binaire cloudflared officiel | Version 2026.11.1, signature Authenticode valide |
| Dix boutons d’exemples T01–T10 | Dix exemples affichés sans remplir d’observation |
| Catalogue dans le navigateur de la démo | Trois exercices réels, deux après filtre premier emploi/stage |
| Maquette médias et microphone indisponible | Exemple affiché sans capture réelle |
| Export synthétique du formulaire | Dix tâches, `complete: true`, rôle relecteur, notes explicitement synthétiques ; `s0_received: false`, relecture humaine exigée |
| Actualisation après téléchargement | Compteur revenu à zéro, aucune persistance implicite |
| Largeurs vérifiées dans le navigateur | 320, 360, 768 et 1280 px, sans débordement horizontal de la page |
| Arrêt puis relance gérés | Réussis ; seuls les processus de la démo enregistrés sont arrêtés |
| Tunnel HTTPS | Connexion enregistrée en HTTP/2 ; guide accessible dans le navigateur via son adresse publique |
| Catalogue par HTTPS | Trois exercices accessibles ; OpenAPI renvoie 404 |

L’export synthétique est isolé sous `tmp/demo-tests/`, hors Git, et n’est pas intégré à `preuves-humaines.json`. Les captures du guide sont disponibles dans `captures/`.

L’adresse publique courante figure dans `.tooling/demo/lien-public.txt`, hors Git. Les scripts changent généralement cette adresse à chaque relance du tunnel. Le serveur et le tunnel étaient actifs à la remise de la démo.

**Limite d’observation :** les contrôles du lien HTTPS ont été faits depuis le poste hôte en passant par l’adresse Internet. Aucun accès effectué par un candidat sur un autre réseau ou situé dans un autre pays n’a encore été attesté. Demander ce premier contrôle extérieur lors des séances ; ne pas le déclarer acquis à partir de ces tests techniques.
