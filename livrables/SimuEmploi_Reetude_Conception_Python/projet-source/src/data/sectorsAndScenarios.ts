import { Sector, PrebuiltScenario, SavedInterviewSession, SimulationCategoryInfo } from "../types";

export const SIMULATION_CATEGORIES: SimulationCategoryInfo[] = [
  {
    id: "entretien_embauche",
    name: "Entretien d'Embauche & RH",
    icon: "Briefcase",
    badge: "Recrutement Pro",
    description: "Simulez vos entretiens d'embauche RH, techniques, managériaux et cas pratiques.",
    roleLabel: "Poste / Intitulé du métier visé",
    contextLabel: "Secteur & Entreprise cible",
    evaluatorLabel: "Recruteur RH / Manager Opérationnel",
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "examen_concours",
    name: "Examens, Concours & Grand Oral",
    icon: "GraduationCap",
    badge: "Épreuves Académiques",
    description: "Préparez vos oraux de concours administratif, grandes écoles, Grand Oral du Bac et examens.",
    roleLabel: "Intitulé de l'Examen, Concours ou Sujet",
    contextLabel: "Institution, École ou Matière",
    evaluatorLabel: "Jury d'Examen & Examinateurs Officiels",
    color: "from-purple-600 to-indigo-700"
  },
  {
    id: "pitch_keynote",
    name: "Pitchs, Levées de Fonds & Vente",
    icon: "Rocket",
    badge: "Startups & Business",
    description: "Présentez votre projet à des investisseurs, convainquez des clients ou faites une Keynote.",
    roleLabel: "Nom de la Startup, Produit ou Projet",
    contextLabel: "Cible (VCs, Business Angels, Clients B2B)",
    evaluatorLabel: "Jury d'Investisseurs & Décideurs Commercial",
    color: "from-emerald-600 to-teal-600"
  },
  {
    id: "competition_hackathon",
    name: "Compétitions & Hackathons",
    icon: "Trophy",
    badge: "Challenge & Innovation",
    description: "Défendez votre solution face à un jury d'experts lors de concours d'innovation et hackathons.",
    roleLabel: "Titre de la Solution ou Challenge",
    contextLabel: "Nom du Hackathon / Concours",
    evaluatorLabel: "Jury d'Experts Tech & Mentors",
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "soutenance_devoir",
    name: "Soutenances, Devoirs & Projets",
    icon: "BookOpenCheck",
    badge: "Université & Écoles",
    description: "Défendez votre mémoire de fin d'études, thèse, projet de groupe ou travail pratique.",
    roleLabel: "Sujet du Mémoire, Thèse ou Devoir",
    contextLabel: "Filière, Université ou Grande École",
    evaluatorLabel: "Professeur / Jury de Soutenance",
    color: "from-rose-600 to-pink-600"
  },
  {
    id: "activite_pratique",
    name: "Activités Pratiques & Média Training",
    icon: "Dumbbell",
    badge: "Mises en Situation",
    description: "Négociations sous tension, simulation de crise de presse, appels téléphoniques complexes.",
    roleLabel: "Rôle joué dans la mise en situation",
    contextLabel: "Contexte de crise ou d'activité pratique",
    evaluatorLabel: "Acteur / Modérateur de Scénario",
    color: "from-cyan-600 to-blue-700"
  }
];

export const SECTORS: Sector[] = [
  {
    id: "tech",
    name: "Tech & Informatique",
    icon: "Code",
    description: "Développement logiciel, IA, Cyber-sécurité, Product Management, Cloud",
    popularRoles: [
      "Développeur Fullstack React/Node",
      "Lead Tech / Software Architect",
      "Product Manager",
      "Ingénieur DevOps & Cloud",
      "Data Scientist / IA Specialist",
      "Expert Cybersécurité"
    ],
    keyCompetencies: ["Résolution de problèmes", "Code review & Design patterns", "Agilité / Scrum", "Communication technique"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "finance",
    name: "Finance & Banque",
    icon: "TrendingUp",
    description: "Banque d'investissement, Analyse financière, Fintech, Gestion de risques",
    popularRoles: [
      "Analyste Financier / M&A",
      "Gestionnaire de Patrimoine",
      "Risk Manager",
      "Contrôleur de Gestion",
      "Trésorier d'Entreprise"
    ],
    keyCompetencies: ["Rigueur chiffrée", "Modélisation financière", "Réglementation bancaire", "Gestion du stress"],
    color: "from-emerald-600 to-teal-600"
  },
  {
    id: "health",
    name: "Santé & Médical",
    icon: "HeartPulse",
    description: "Industrie pharmaceutique, Hôpitaux, Biotech, Recherche clinique",
    popularRoles: [
      "Infirmier / Cadre de Santé",
      "Chef de Produit Pharma",
      "Attaché de Recherche Clinique",
      "Pharmacien d'Officine",
      "Biologiste Médical"
    ],
    keyCompetencies: ["Empathie & Écoute", "Rigueur protocolaire", "Gestion d'urgence", "Travail en équipe plurisectorielle"],
    color: "from-rose-600 to-pink-600"
  },
  {
    id: "marketing",
    name: "Ventes & Marketing",
    icon: "Megaphone",
    description: "Growth Marketing, Business Development, E-commerce, Key Account Manager",
    popularRoles: [
      "Account Executive B2B",
      "Responsable Growth & Acquisition",
      "Social Media Manager",
      "Chef de Marque",
      "Directeur Commercial"
    ],
    keyCompetencies: ["Négociation & Persuasion", "Analyse de conversion", "Aisance orale", "Orienté résultats"],
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "engineering",
    name: "Ingénierie & Industrie",
    icon: "Cpu",
    description: "Automobile, Aéronautique, Énergie renouvelable, BTP & Infrastructures",
    popularRoles: [
      "Ingénieur Projet BTP",
      "Chef de Projet R&D",
      "Ingénieur Systèmes Embarqués",
      "Responsable Qualité & Sécurité (HSE)",
      "Ingénieur Énergie"
    ],
    keyCompetencies: ["Rigueur technique", "Gestion de projet PMO", "Normes environnementales", "Leadership terrain"],
    color: "from-slate-700 to-zinc-800"
  },
  {
    id: "hr",
    name: "Ressources Humaines",
    icon: "Users",
    description: "Talent Acquisition, Compensation & Benefits, Formation, HR Business Partner",
    popularRoles: [
      "HR Business Partner (HRBP)",
      "Talent Acquisition Manager",
      "Responsable Formation & GPEC",
      "Directeur des Ressources Humaines"
    ],
    keyCompetencies: ["Médiation de conflit", "Marque employeur", "Droit du travail", "Pédagogie"],
    color: "from-violet-600 to-purple-600"
  },
  {
    id: "legal",
    name: "Droit & Juridique",
    icon: "Scale",
    description: "Juriste de droit des affaires, Avocat, Conformité RGPD, Propriété intellectuelle",
    popularRoles: [
      "Juriste Droit des Affaires",
      "Compliance Officer",
      "Avocat Collaborateur",
      "Juriste Propriété Intellectuelle"
    ],
    keyCompetencies: ["Éloquence & Argumentation", "Analyse de risques juridiques", "Rédaction contractuelle", "Méthode"],
    color: "from-cyan-700 to-blue-800"
  },
  {
    id: "hospitality",
    name: "Hôtellerie & Tourisme",
    icon: "UtensilsCrossed",
    description: "Hôtellerie de luxe, Restauration, Event Management, Direction d'établissement",
    popularRoles: [
      "Directeur d'Hôtel",
      "Chef de Rang / Maître d'Hôtel",
      "Event & Wedding Planner",
      "Responsable Yield Management"
    ],
    keyCompetencies: ["Sens du service premium", "Gestion de crise client", "Gestion des équipes", "Maîtrise des langues"],
    color: "from-yellow-600 to-amber-700"
  }
];

export const PREBUILT_SCENARIOS: PrebuiltScenario[] = [
  // 1. Entretien d'embauche
  {
    id: "sc-tech-incident",
    title: "Gestion d'incident de prod majeur & Communication Comex",
    category: "entretien_embauche",
    sectorId: "tech",
    role: "Lead Developer / Incident Commander",
    level: "senior",
    difficulty: "Avancé",
    description: "Mise en situation d'urgence suite à une panne critique de la plateforme ayant entraîné des pertes de données pécuniaires.",
    context: "Le recruteur joue le rôle du Directeur Technique (CTO) qui veut évaluer votre sang-froid, votre méthode de résolution de crise et votre clarté sous pression.",
    mode: "mise_en_situation",
    estimatedDuration: 15,
    tags: ["Crise", "Post-Mortem", "Leadership", "Communication"]
  },
  {
    id: "sc-sales-negoc",
    title: "Négociation B2B Grands Comptes - Annulation de contrat",
    category: "entretien_embauche",
    sectorId: "marketing",
    role: "Senior Key Account Manager",
    level: "confirme",
    difficulty: "Expert",
    description: "Un client grand compte à 200k€/an menace de résilier suite à un mécontentement de service. Vous devez inverser la tendance.",
    context: "Le recruteur incarne le Directeur des Achats exigeant. Test d'empathie commerciale, de traitement des objections et d'accroche de valeur.",
    mode: "negociation_salaire",
    estimatedDuration: 12,
    tags: ["Négociation", "Rétention Client", "Vente B2B", "Persuasion"]
  },

  // 2. Examens & Concours
  {
    id: "sc-grand-oral-concours",
    title: "Grand Oral de Concours Administratif (ENA / INSP / Attaché)",
    category: "examen_concours",
    sectorId: "legal",
    role: "Candidat au Concours d'Attaché d'État",
    level: "confirme",
    difficulty: "Expert",
    description: "Présentation de vos motivations de service public suivie d'un interrogatoire de culture générale administrative, déontologie et gestion publique.",
    context: "Le Jury d'Examen est composé d'un haut fonctionnaire exigeant et d'un universitaire. Ils testent la neutralité, l'esprit de synthèse et la réactivité juridique.",
    mode: "cas_pratique",
    estimatedDuration: 15,
    tags: ["Concours", "Grand Oral", "Service Public", "Éloquence"]
  },
  {
    id: "sc-oral-grandes-ecoles",
    title: "Épreuve d'Entretien de Titre Grandes Écoles de Commerce / Ingénieurs",
    category: "examen_concours",
    sectorId: "tech",
    role: "Candidat Master Grande École (HEC / Essec / Polytechnique)",
    level: "debutant",
    difficulty: "Avancé",
    description: "Présentez votre parcours, votre projet professionnel et répondez aux questions pièges sur la géopolitique, l'éthique IA et le leadership.",
    context: "Le Jury d'Admission évalue l'authenticité, la pertinence du projet personnel et la réaction face au déstabilisement intellectuel.",
    mode: "classique",
    estimatedDuration: 12,
    tags: ["Grandes Écoles", "Oral d'Admission", "Motivation", "Culture Générale"]
  },

  // 3. Pitchs & Levées de Fonds
  {
    id: "sc-pitch-seed-vc",
    title: "Pitch de Levée de Fonds Seed (1,5M€) face aux Investisseurs VC",
    category: "pitch_keynote",
    sectorId: "tech",
    role: "CEO & Co-Fondateur Startup GreenTech",
    level: "executive",
    difficulty: "Expert",
    description: "Défendez votre vision, votre traction (ARR), la taille de votre marché (TAM) et vos projections financières pour convaincre le comité d'investissement.",
    context: "Le Jury est composé de Partner VC aguerris. Ils vont challenger la barrière à l'entrée (Moat), l'unit economics et le risque d'exécution.",
    mode: "cas_pratique",
    estimatedDuration: 10,
    tags: ["Pitch VC", "Levée de fonds", "Startups", "Finance"]
  },
  {
    id: "sc-pitch-commercial-b2b",
    title: "Pitch Commercial B2B & Démo Produit à un Comité de Direction",
    category: "pitch_keynote",
    sectorId: "marketing",
    role: "Directeur Commercial SaaS",
    level: "senior",
    difficulty: "Intermédiaire",
    description: "Présentez la proposition de valeur de votre logiciel RH/SaaS en 5 minutes chrono pour décrocher la signature de la convention annuelle.",
    context: "Le DSI et la DRH d'un groupe industriel écoutent votre pitch et posent des questions sur le ROI, la sécurité RGPD et le déploiement.",
    mode: "mise_en_situation",
    estimatedDuration: 10,
    tags: ["Pitch Vente", "Démo SaaS", "ROI", "Négociation"]
  },

  // 4. Compétitions & Hackathons
  {
    id: "sc-hackathon-ai-demo",
    title: "Soutenance Finale de Hackathon d'Innovation IA & Data",
    category: "competition_hackathon",
    sectorId: "tech",
    role: "Capitaine d'Équipe Hackathon",
    level: "confirme",
    difficulty: "Avancé",
    description: "Présentez le prototype fonctionnel de votre agent IA créé en 48h devant le Jury du Concours d'Innovation.",
    context: "Le Jury de Hackathon veut voir la démo live, comprendre la faisabilité technique, l'ergonomie UX et la viabilité du business model.",
    mode: "cas_pratique",
    estimatedDuration: 8,
    tags: ["Hackathon", "IA Demo", "Innovation", "Challenge"]
  },

  // 5. Soutenances & Devoirs
  {
    id: "sc-soutenance-memoire",
    title: "Soutenance de Mémoire de Master / Thèse Universitaire",
    category: "soutenance_devoir",
    sectorId: "education",
    role: "Étudiant de Master / Doctorant",
    level: "confirme",
    difficulty: "Intermédiaire",
    description: "Présentez la synthèse de vos recherches universitaires, la méthodologie empirique et répondez aux critiques méthodologiques du jury.",
    context: "Le Professeur Rapporteur et le Président du Jury examinent la rigueur académique, les références scientifiques et l'apport théorique.",
    mode: "classique",
    estimatedDuration: 15,
    tags: ["Soutenance", "Mémoire", "Université", "Recherche"]
  },

  // 6. Activités Pratiques & Média Training
  {
    id: "sc-media-training-crise",
    title: "Média Training & Conférence de Presse sous Crise Médiatique",
    category: "activite_pratique",
    sectorId: "marketing",
    role: "Porte-Parole d'Entreprise / Directeur Communication",
    level: "executive",
    difficulty: "Expert",
    description: "Répondez aux questions incisives des journalistes lors d'un JT ou d'une conférence de presse suite à un scandale sanitaire ou industriel.",
    context: "Un journaliste investigateur pose des questions directes et incisives. Test du contrôle de l'image, de l'élément de langage et de la sérénité.",
    mode: "mise_en_situation",
    estimatedDuration: 10,
    tags: ["Média Training", "Crise", "Journaliste", "Communication"]
  }
];

export const INITIAL_SAVED_SESSIONS: SavedInterviewSession[] = [
  {
    id: "sess-001",
    dateIso: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: "entretien_embauche",
    categoryName: "Entretien d'Embauche & RH",
    sectorId: "tech",
    sectorName: "Tech & Informatique",
    role: "Développeur Senior Fullstack",
    experienceLevel: "senior",
    interviewStyle: "professionnel",
    mode: "classique",
    durationSeconds: 520,
    totalQuestions: 4,
    recruiterInfo: {
      name: "Marc Laurent",
      title: "Directeur de l'Ingénierie",
      companyName: "Nexus Digital Tech"
    },
    history: [
      {
        questionIndex: 1,
        questionText: "Bonjour ! Pouvez-vous me présenter une réalisation récente dont vous êtes particulièrement fier ?",
        userAnswerText: "Bonjour Marc. Lors de mon précédent poste chez Cloudify, j'ai piloté la refonte de notre architecture microservices. L'ancienne plateforme subissait des ralentissements majeurs lors des pics de trafic de fin de mois. J'ai proposé de passer à une architecture événementielle avec Kafka et Node.js, réduisant les temps de réponse de 65% et éliminant tout crash pendant 12 mois.",
        answerDurationSeconds: 48,
        audioMetrics: {
          wpm: 138,
          volumeLevel: 78,
          pitchStability: 88,
          pauseDurationAvg: 1.2,
          fillerWordsCount: 2,
          confidenceScore: 88
        },
        videoMetrics: {
          eyeContactScore: 91,
          postureQuality: "Posture droite et dynamique",
          facialExpression: "Souriant & Captivant",
          perceivedConfidence: 90,
          headMovementStability: 85,
          realtimeTip: "Excellente accroche !"
        },
        instantFeedback: {
          starScore: 92,
          relevanceScore: 95,
          concisenessRating: "Excellente structure",
          strongAspect: "L'impact chiffré (-65% de latence) rend la réponse très percutante.",
          improvementHint: "Mentionnez brièvement la taille de l'équipe mobilisée."
        }
      },
      {
        questionIndex: 2,
        questionText: "Comment gérez-vous les désaccords techniques avec un membre senior de votre équipe ?",
        userAnswerText: "Euh, en fait quand il y a un désaccord, j'essaie de ne pas en faire une affaire d'égo. Je propose toujours de faire une preuve de concept objective (PoC) mesurable sur 48h au lieu de débattre sans fin. Par exemple, sur le choix entre GraphQL et REST, nous avons benchmarké les deux en charge réelle et le PoC a tranché de lui-même.",
        answerDurationSeconds: 42,
        audioMetrics: {
          wpm: 142,
          volumeLevel: 72,
          pitchStability: 82,
          pauseDurationAvg: 1.5,
          fillerWordsCount: 4,
          confidenceScore: 82
        },
        videoMetrics: {
          eyeContactScore: 84,
          postureQuality: "Attentif",
          facialExpression: "Concentré",
          perceivedConfidence: 84,
          headMovementStability: 80,
          realtimeTip: "Léger tic 'euh', gardez un débit mesuré."
        },
        instantFeedback: {
          starScore: 85,
          relevanceScore: 88,
          concisenessRating: "Bonne idée de PoC",
          strongAspect: "Approche pragmatique orientée données.",
          improvementHint: "Éliminez les tics de langage 'euh, en fait' au début de phrase."
        }
      }
    ],
    report: {
      overallScore: 88,
      vocalToneScore: 85,
      bodyLanguageScore: 89,
      contentStarScore: 90,
      fluencyPaceScore: 87,
      executiveSummary: "Prestation solide et professionnelle. Vous démontrez une maîtrise technique manifeste et une articulation structurée de vos réussites grâce à des métriques précises.",
      topStrengths: [
        "L'utilisation d'exemples chiffrés réels (-65% latence, 12 mois sans arrêt)",
        "Postures visuelles stables et excellent contact visuel vers la caméra (91%)",
        "Pragmatisme dans la résolution de conflits techniques (approche PoC)"
      ],
      keyAreasForImprovement: [
        "Réduire les tics de langage au démarrage de réponse (euh, en fait)",
        "Détailler davantage la partie 'Situation & Tâche' avant d'enchaîner sur l'Action",
        "Varier légèrement le rythme pour accentuer les mots-clés stratégiques"
      ],
      questionAnalysis: [
        {
          questionIndex: 1,
          questionText: "Pouvez-vous me présenter une réalisation dont vous êtes fier ?",
          userResponse: "Refonte microservices chez Cloudify avec Kafka et Node.js (-65% latence).",
          questionScore: 92,
          strength: "Structure STAR exemplaire avec métriques d'impact réelles.",
          improvement: "Ajouter la dimension managériale (taille d'équipe et budget).",
          idealStarResponse: "SITUATION: Chez Cloudify, la plateforme saturait à 100k utilisateurs simultanés.\nTÂCHE: Je devais moderniser l'architecture en 3 mois sans interruption de service.\nACTION: J'ai conçu une architecture événementielle avec Kafka et formé 5 dev.\nRÉSULTAT: +65% de rapidité et 0 downtime constaté."
        },
        {
          questionIndex: 2,
          questionText: "Comment gérez-vous un désaccord technique ?",
          userResponse: "Gestion par la preuve de concept (PoC) neutre et mesurée sur 48h.",
          questionScore: 84,
          strength: "Approche neutre fondée sur des faits et des benchmarks.",
          improvement: "Lisser la présence de mots de remplissage oraux.",
          idealStarResponse: "SITUATION: Conflit entre GraphQL et REST pour l'API mobile.\nTÂCHE: Trouver un consensus sans ralentir le calendrier de livraison.\nACTION: Organisation d'un hackathon PoC de 48h avec critères d'évaluation clairs.\nRÉSULTAT: Adoption à l'unanimité de GraphQL avec 20% de gain de bande passante."
        }
      ],
      personalizedActionPlan: [
        "Appliquer la règle des 2 secondes de silence bienveillant au lieu de combler avec 'euh'.",
        "Garder la posture ouverte actuelle qui inspire la confiance (89/100).",
        "S'entraîner à la grille STAR pour les questions comportementales complexes."
      ],
      fillerWordsCount: 6,
      avgSpeakingSpeedWpm: 140
    }
  }
];

