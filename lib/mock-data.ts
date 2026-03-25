import type { TenderProject, Criterion, TeamMember, EvidenceItem, WritingTip, QualityScores } from './types'

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Anna de Vries',
    email: 'anna@example.nl',
    role: 'klant',
    avatar: undefined
  },
  {
    id: '2',
    name: 'Mark Jansen',
    email: 'mark@tenderflow.nl',
    role: 'consultant',
    avatar: undefined
  },
  {
    id: '3',
    name: 'Sophie van den Berg',
    email: 'sophie@tenderflow.nl',
    role: 'beheerder',
    avatar: undefined
  }
]

export const mockProject: TenderProject = {
  id: 'proj-001',
  projectName: 'Gemeente Rotterdam - ICT Dienstverlening',
  clientName: 'TechSolutions B.V.',
  tenderTitle: 'ICT Beheer en Onderhoud Gemeentelijke Infrastructuur',
  referenceNumber: 'ROT-2024-ICT-001',
  deadline: new Date('2024-03-15'),
  sector: 'Overheid',
  region: 'Zuid-Holland',
  contractValue: '€ 2.500.000 - € 5.000.000',
  tenderType: 'Openbare aanbesteding',
  teamMembers: mockTeamMembers,
  contactPerson: 'Anna de Vries',
  internalOwner: 'Mark Jansen',
  status: 'in_progress',
  progress: 45,
  readinessScore: 52,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-02-01')
}

export const defaultQualityScores: QualityScores = {
  specificity: 'zwak',
  evidence: 'zwak',
  customerFocus: 'zwak',
  readability: 'redelijk',
  distinctiveness: 'zwak',
  smartLevel: 'zwak'
}

export const mockCriteria: Criterion[] = [
  {
    id: 'sc1',
    projectId: 'proj-001',
    title: 'Architectuur en Technisch Ontwerp',
    code: 'SC1',
    weight: 30,
    status: 'in_progress',
    progress: 65,
    deadline: new Date('2024-02-20'),
    questions: [
      {
        id: 'q1-1',
        criterionId: 'sc1',
        text: 'Beschrijf de voorgestelde technische architectuur voor het beheer van de gemeentelijke ICT-infrastructuur.',
        helpText: 'De opdrachtgever wil begrijpen hoe uw oplossing technisch is opgebouwd. Denk aan servers, netwerken, beveiliging en integraties.',
        bulletContent: [
          'Hybride cloud-architectuur met private en public cloud componenten',
          'Centraal management platform voor monitoring en beheer',
          'Zero-trust security model als basis',
          'API-first benadering voor integraties'
        ],
        textContent: '',
        mode: 'bullets',
        qualityScores: {
          specificity: 'redelijk',
          evidence: 'zwak',
          customerFocus: 'redelijk',
          readability: 'sterk',
          distinctiveness: 'redelijk',
          smartLevel: 'redelijk'
        },
        comments: [
          {
            id: 'c1',
            questionId: 'q1-1',
            author: mockTeamMembers[1],
            content: 'Kun je het zero-trust model concreter maken met voorbeelden?',
            createdAt: new Date('2024-01-25'),
            resolved: false
          }
        ],
        isRequired: true,
        order: 1
      },
      {
        id: 'q1-2',
        criterionId: 'sc1',
        text: 'Hoe waarborgt u de schaalbaarheid van de oplossing?',
        helpText: 'De gemeente groeit en de infrastructuur moet meegroeien. Toon aan dat uw oplossing flexibel is.',
        bulletContent: [
          'Auto-scaling op basis van gebruikspatronen',
          'Modulaire opbouw voor eenvoudige uitbreiding'
        ],
        textContent: '',
        mode: 'bullets',
        qualityScores: {
          specificity: 'zwak',
          evidence: 'zwak',
          customerFocus: 'redelijk',
          readability: 'redelijk',
          distinctiveness: 'zwak',
          smartLevel: 'zwak'
        },
        comments: [],
        isRequired: true,
        order: 2
      }
    ],
    reviewNotes: []
  },
  {
    id: 'sc2',
    projectId: 'proj-001',
    title: 'Implementatie en Transitie',
    code: 'SC2',
    weight: 25,
    status: 'niet_gestart',
    progress: 10,
    deadline: new Date('2024-02-25'),
    questions: [
      {
        id: 'q2-1',
        criterionId: 'sc2',
        text: 'Beschrijf uw aanpak voor de transitie van de huidige naar de nieuwe situatie.',
        helpText: 'De opdrachtgever wil zekerheid dat de overgang soepel verloopt zonder verstoring van de dienstverlening.',
        bulletContent: [],
        textContent: '',
        mode: 'bullets',
        qualityScores: defaultQualityScores,
        comments: [],
        isRequired: true,
        order: 1
      }
    ],
    reviewNotes: []
  },
  {
    id: 'sc3',
    projectId: 'proj-001',
    title: 'Beheer en Exploitatie',
    code: 'SC3',
    weight: 25,
    status: 'niet_gestart',
    progress: 0,
    deadline: new Date('2024-03-01'),
    questions: [
      {
        id: 'q3-1',
        criterionId: 'sc3',
        text: 'Hoe organiseert u het dagelijks beheer en de supportdienstverlening?',
        helpText: 'Beschrijf uw serviceorganisatie, processen en tools voor effectief beheer.',
        bulletContent: [],
        textContent: '',
        mode: 'bullets',
        qualityScores: defaultQualityScores,
        comments: [],
        isRequired: true,
        order: 1
      }
    ],
    reviewNotes: []
  },
  {
    id: 'sc4',
    projectId: 'proj-001',
    title: 'Innovatie en Toekomstgerichtheid',
    code: 'SC4',
    weight: 20,
    status: 'niet_gestart',
    progress: 0,
    deadline: new Date('2024-03-05'),
    questions: [
      {
        id: 'q4-1',
        criterionId: 'sc4',
        text: 'Welke innovaties brengt u mee die waarde toevoegen voor de gemeente?',
        helpText: 'Toon aan dat u vooruitdenkt en de gemeente helpt om toekomstbestendig te zijn.',
        bulletContent: [],
        textContent: '',
        mode: 'bullets',
        qualityScores: defaultQualityScores,
        comments: [],
        isRequired: true,
        order: 1
      }
    ],
    reviewNotes: []
  }
]

export const mockEvidence: EvidenceItem[] = [
  {
    id: 'ev1',
    title: 'Case Study: Gemeente Amsterdam',
    type: 'case',
    description: 'Succesvolle implementatie van cloud-migratie voor 5000 gebruikers',
    tags: ['overheid', 'cloud', 'migratie'],
    createdAt: new Date('2023-06-15')
  },
  {
    id: 'ev2',
    title: 'ISO 27001 Certificering',
    type: 'certificate',
    description: 'Informatiebeveiliging certificering geldig tot 2025',
    tags: ['security', 'certificering'],
    createdAt: new Date('2023-01-01')
  },
  {
    id: 'ev3',
    title: 'CV: Jan Pietersen - Lead Architect',
    type: 'cv',
    description: '15 jaar ervaring in enterprise architectuur',
    tags: ['team', 'architectuur'],
    createdAt: new Date('2024-01-05')
  }
]

export const mockEvidenceItems = [
  { id: 'e1', title: 'Referentie Gemeente Amsterdam', category: 'referentie', description: 'Cloud-migratie voor 5000+ gebruikers met 99.9% uptime', year: '2023' },
  { id: 'e2', title: 'Referentie Provincie Utrecht', category: 'referentie', description: 'Implementatie hybride werkplek oplossing', year: '2022' },
  { id: 'e3', title: 'Referentie Waterschap Hollandse Delta', category: 'referentie', description: 'Netwerkmodernisatie en security upgrade', year: '2023' },
  { id: 'e4', title: 'ISO 27001:2022 Certificaat', category: 'certificaat', description: 'Informatiebeveiliging managementsysteem', year: '2024' },
  { id: 'e5', title: 'ISO 9001:2015 Certificaat', category: 'certificaat', description: 'Kwaliteitsmanagementsysteem', year: '2023' },
  { id: 'e6', title: 'NEN 7510 Certificaat', category: 'certificaat', description: 'Informatiebeveiliging in de zorg', year: '2023' },
  { id: 'e7', title: 'CV: Jan Pietersen - Lead Architect', category: 'cv', description: '15 jaar ervaring in enterprise architectuur, Azure certified', year: null },
  { id: 'e8', title: 'CV: Maria van Dijk - Project Manager', category: 'cv', description: 'Prince2, PMP gecertificeerd, 50+ overheidsprojecten', year: null },
  { id: 'e9', title: 'CV: Thomas Bakker - Security Specialist', category: 'cv', description: 'CISSP, CEH, 12 jaar ervaring in cybersecurity', year: null },
  { id: 'e10', title: 'Architectuurschema Hybride Cloud', category: 'document', description: 'Technisch diagram van de voorgestelde oplossing', year: '2024' },
  { id: 'e11', title: 'SLA Template', category: 'document', description: 'Standaard Service Level Agreement met KPIs', year: '2024' },
  { id: 'e12', title: 'Transitieplan Template', category: 'document', description: 'Gefaseerd implementatieplan met mijlpalen', year: '2024' },
]

export const mockProjects: TenderProject[] = [
  mockProject,
  {
    id: 'proj-002',
    projectName: 'Rijkswaterstaat - Monitoring Systeem',
    clientName: 'InfraTech Solutions',
    tenderTitle: 'Real-time Monitoring Watermanagement',
    referenceNumber: 'RWS-2024-MON-002',
    deadline: new Date('2024-04-01'),
    sector: 'Overheid',
    region: 'Landelijk',
    contractValue: '€ 1.000.000 - € 2.500.000',
    tenderType: 'Europese aanbesteding',
    teamMembers: mockTeamMembers,
    contactPerson: 'Anna de Vries',
    internalOwner: 'Sophie van den Berg',
    status: 'concept',
    progress: 15,
    readinessScore: 22,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'proj-003',
    projectName: 'GGD Regio - Digitale Zorgplatform',
    clientName: 'HealthIT B.V.',
    tenderTitle: 'Patiëntportaal en Afsprakensysteem',
    referenceNumber: 'GGD-2024-DIG-003',
    deadline: new Date('2024-02-28'),
    sector: 'Zorg',
    region: 'Noord-Holland',
    contractValue: '€ 500.000 - € 1.000.000',
    tenderType: 'Meervoudig onderhands',
    teamMembers: [mockTeamMembers[0], mockTeamMembers[2]],
    contactPerson: 'Mark Jansen',
    internalOwner: 'Anna de Vries',
    status: 'review',
    progress: 85,
    readinessScore: 78,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-02-05')
  }
]

export const writingTips: WritingTip[] = [
  {
    id: 'tip1',
    title: 'Een sterke inleiding in 3 stappen',
    category: 'inleiding',
    doExample: 'Wij begrijpen dat de gemeente Rotterdam een betrouwbare ICT-partner zoekt die...',
    dontExample: 'In dit hoofdstuk beschrijven wij onze aanpak voor de ICT-dienstverlening.',
    explanation: 'Begin met het tonen van begrip voor de vraag, vat daarna kort uw aanpak samen, en sluit af met het belangrijkste voordeel voor de opdrachtgever.'
  },
  {
    id: 'tip2',
    title: 'SMART schrijven',
    category: 'smart',
    doExample: 'Binnen 30 dagen na start leveren wij een volledig werkend monitoringdashboard op.',
    dontExample: 'Wij zorgen voor goede monitoring van de systemen.',
    explanation: 'Maak uw uitspraken Specifiek, Meetbaar, Acceptabel, Realistisch en Tijdgebonden.'
  },
  {
    id: 'tip3',
    title: 'Claims onderbouwen met bewijs',
    category: 'bewijs',
    doExample: 'Dit blijkt uit ons project bij Gemeente Amsterdam waar wij de uptime verhoogden van 97% naar 99,8%.',
    dontExample: 'Wij hebben veel ervaring met vergelijkbare projecten.',
    explanation: 'Elke claim wordt sterker met een concreet voorbeeld, cijfer of referentie.'
  },
  {
    id: 'tip4',
    title: 'Focus op klantwaarde',
    category: 'klantwaarde',
    doExample: 'Hierdoor bespaart de gemeente jaarlijks circa 200 uur aan handmatig werk.',
    dontExample: 'Ons systeem heeft geavanceerde automatiseringsfuncties.',
    explanation: 'Vertaal features naar voordelen voor de opdrachtgever. Wat levert het hen op?'
  },
  {
    id: 'tip5',
    title: 'Actief formuleren',
    category: 'formulering',
    doExample: 'Onze projectmanager coördineert wekelijks de voortgang met uw team.',
    dontExample: 'Er wordt wekelijks voortgang gecoördineerd.',
    explanation: 'Gebruik actieve zinnen met een duidelijk onderwerp. Dit maakt tekst levendiger en concreter.'
  }
]

export const contextQuestions = {
  sc1: {
    title: 'Architectuur en Technisch Ontwerp',
    clientQuestion: 'Wat vraagt de opdrachtgever hier echt?',
    clientAnswer: 'De opdrachtgever wil zekerheid dat uw technische oplossing robuust, veilig en toekomstbestendig is. Zij zoeken een partner die begrijpt hoe complexe IT-omgevingen werken.',
    whyImportant: 'Een goede architectuur voorkomt problemen later. De opdrachtgever beoordeelt hier uw technische kennis en vermogen om vooruit te denken.',
    whatScoresWell: 'Concrete diagrammen, bewezen technologiekeuzes, aandacht voor security by design, en duidelijke uitleg waarom deze keuzes passen bij de gemeentelijke context.'
  },
  sc2: {
    title: 'Implementatie en Transitie',
    clientQuestion: 'Wat vraagt de opdrachtgever hier echt?',
    clientAnswer: 'Hoe zorgt u ervoor dat de overgang soepel verloopt zonder verstoring? De gemeente kan zich geen downtime veroorloven.',
    whyImportant: 'Veel projecten falen in de transitiefase. Dit criterium toetst of u een realistisch en dooracht plan heeft.',
    whatScoresWell: 'Een gefaseerde aanpak, duidelijke mijlpalen, risicomitigatie, en bewezen ervaring met vergelijkbare transities.'
  },
  sc3: {
    title: 'Beheer en Exploitatie',
    clientQuestion: 'Wat vraagt de opdrachtgever hier echt?',
    clientAnswer: 'Kan uw organisatie dagelijks leveren wat nodig is? Bent u bereikbaar en betrouwbaar?',
    whyImportant: 'Dit gaat over de langetermijnrelatie. De opdrachtgever wil weten dat u een solide serviceorganisatie heeft.',
    whatScoresWell: 'Concrete SLAs, duidelijke escalatiepaden, proactieve monitoring, en voorbeelden van hoe u problemen voorkomt.'
  },
  sc4: {
    title: 'Innovatie en Toekomstgerichtheid',
    clientQuestion: 'Wat vraagt de opdrachtgever hier echt?',
    clientAnswer: 'Helpt u ons om voorop te blijven lopen? Brengt u meer dan alleen het minimale?',
    whyImportant: 'De wereld verandert snel. De opdrachtgever zoekt een partner die meedenkt over de toekomst.',
    whatScoresWell: 'Concrete innovaties die waarde toevoegen, geen buzzwords maar uitlegbare technologieën, en een visie op trends die relevant zijn.'
  }
}
