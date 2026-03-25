export type ProjectStatus = 'concept' | 'in_progress' | 'review' | 'completed' | 'submitted' | 'won' | 'lost'

export type QualityLevel = 'zwak' | 'redelijk' | 'sterk'

export type ContentMode = 'bullets' | 'text'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'klant' | 'consultant' | 'beheerder'
  avatar?: string
}

export interface TenderProject {
  id: string
  projectName: string
  clientName: string
  tenderTitle: string
  referenceNumber: string
  deadline: Date
  sector: string
  region: string
  contractValue: string
  tenderType: string
  teamMembers: TeamMember[]
  contactPerson: string
  internalOwner: string
  status: ProjectStatus
  progress: number
  readinessScore: number
  createdAt: Date
  updatedAt: Date
}

export interface Criterion {
  id: string
  projectId: string
  title: string
  code: string
  weight?: number
  status: 'niet_gestart' | 'in_progress' | 'review' | 'voltooid'
  progress: number
  deadline?: Date
  questions: Question[]
  reviewNotes: ReviewNote[]
}

export interface Question {
  id: string
  criterionId: string
  text: string
  helpText: string
  bulletContent: string[]
  textContent: string
  mode: ContentMode
  qualityScores: QualityScores
  comments: Comment[]
  isRequired: boolean
  order: number
}

export interface QualityScores {
  specificity: QualityLevel
  evidence: QualityLevel
  customerFocus: QualityLevel
  readability: QualityLevel
  distinctiveness: QualityLevel
  smartLevel: QualityLevel
}

export interface Comment {
  id: string
  questionId: string
  author: TeamMember
  content: string
  createdAt: Date
  resolved: boolean
}

export interface ReviewNote {
  id: string
  criterionId: string
  author: TeamMember
  content: string
  createdAt: Date
  type: 'suggestion' | 'question' | 'approval' | 'revision'
}

export interface EvidenceItem {
  id: string
  title: string
  type: 'case' | 'certificate' | 'cv' | 'kpi' | 'policy' | 'testimonial' | 'reference'
  description: string
  fileUrl?: string
  tags: string[]
  createdAt: Date
}

export interface WritingTip {
  id: string
  title: string
  category: 'inleiding' | 'smart' | 'bewijs' | 'klantwaarde' | 'formulering' | 'structuur'
  doExample: string
  dontExample: string
  explanation: string
}

export interface CapabilityProfile {
  companyProfile: string
  coreActivities: string[]
  sectorExperience: string[]
  relevantProjects: string[]
  distinctiveStrengths: string[]
  certifications: string[]
  teamCapabilities: string[]
  geographicReach: string[]
  technicalCapabilities: string[]
  operationalCapacity: string
  complianceReadiness: string
  riskAreas: string[]
  keyDifferentiators: string[]
}
