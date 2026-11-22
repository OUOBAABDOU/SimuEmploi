# SimuEmploi — kit candidat, UX et illustrations 0.2

**20 novembre 2026.** Construction neuve, cinq développeurs full stack, backend Python/FastAPI et modules séparés. Ce kit réunit conception, maquettes et planification ; il n'est pas une application installable.

Commencer par [les ajustements UX et les tâches des développeurs](docs/candidat/04_AJUSTEMENTS_UX_ET_VISUELS.md), puis [l'index candidat](docs/candidat/README.md), [les écrans](docs/candidat/01_MAQUETTES_ET_PARCOURS.md), [les huit sprints](docs/candidat/02_SPRINTS_CINQ_DEVELOPPEURS.md) et [les modules/contrats](docs/candidat/03_MODULES_ET_CONTRATS.md).

La version 0.2 ajoute quatre scènes illustrées en apparence claire/sombre, des aides adaptées aux questions, une reprise plus visible, des libellés de conservation plus clairs et des corrections de lecture sur mobile. Les retours IA restent explicitement fictifs.

- `maquettes/simuemploi-candidat.fragment.html` : copie du fragment modifiable présenté dans le chat, avec les images intégrées ; ce n'est pas une page autonome de production.
- `maquettes/candidat-interactions.js` : source des interactions de conception, sans données personnelles réelles ni appels réseau.
- `docs/candidat/illustrations/` : WebP, sources SVG et manifeste de poids/dimensions.
- `docs/candidat/visuels/` : huit captures de relecture.
- `docs/candidat/VERIFICATION_MAQUETTES.md` : portée des vérifications locales et limites.

Le contexte du chat fournit le carousel, les icônes et les réglages de style. Les interactions métier sont simulées. Le brouillon de démonstration reste en mémoire pendant la consultation ; aucune identité, analyse réelle, suppression ou persistance serveur n'est exécutée.

Les outils fournis utilisent les dépendances et certains chemins du poste de conception. Adapter ces chemins pour un autre ordinateur. Le générateur d'illustrations écrit les exports, l'assembleur met à jour le fragment, et le vérificateur utilise Playwright et Chrome. Ces helpers ne sont pas le code applicatif à reprendre pour construire le produit.

Les références historiques et la conception générale sont incluses pour conserver le contexte. Le code du prototype original n'est pas inclus. Les règles proposées et la capacité des sprints restent à estimer puis à valider avec le porteur, les développeurs et les candidats.
