// ============================================================
// MSOL — Maharashtra Skilling Outcomes Ledger
// Data Model Types
// ============================================================

// --- Enums / Union Types ---

export type Gender = 'Male' | 'Female' | 'Other';
export type Category = 'General' | 'OBC' | 'SC' | 'ST';
export type Language = 'mr' | 'hi' | 'en';

export type Scheme = 'AICTE UG' | 'Diploma' | 'Internship' | 'Add-on Skilling' | 'PMKVY' | 'State Skill Dev' | 'Apprenticeship' | 'ITI';

export type OutcomeType =
  | 'PLACED'
  | 'SELF_EMPLOYED'
  | 'APPRENTICE'
  | 'NOT_PLACED'
  | 'LEFT_JOB'
  | 'UNREACHABLE'
  | 'WAGE_UPDATE'
  | 'RETAINED';

export type OutcomeSource =
  | 'SELF'
  | 'EMPLOYER'
  | 'COUNSELLOR'
  | 'DOCUMENT'
  | 'IVR'
  | 'WHATSAPP';

export type Confidence =
  | 'UNVERIFIED'
  | 'EMPLOYER_CONFIRMED'
  | 'DOCUMENT_BACKED';

export type WageBand = '<10k' | '10-15k' | '15-20k' | '20-30k' | '30k+';

export type FollowUpChannel = 'WHATSAPP' | 'SMS' | 'IVR' | 'CALL';

export type FollowUpStatus =
  | 'PENDING'
  | 'SENT'
  | 'COMPLETED'
  | 'NO_REPLY'
  | 'ESCALATED';

export type NonPlacementReasonCode =
  | 'NO_VACANCY'
  | 'WAGE_TOO_LOW'
  | 'LOCATION'
  | 'LANGUAGE'
  | 'MISSING_SKILL'
  | 'FAMILY'
  | 'HEALTH'
  | 'MIGRATION'
  | 'FAKE_LEAD'
  | 'EMPLOYER_REJECTED'
  | 'DOCUMENT_ISSUE'
  | 'OTHER';

export type UserRole =
  | 'state_admin'
  | 'district_officer'
  | 'training_provider'
  | 'employer'
  | 'counsellor'
  | 'trainee';

// --- Core Data Interfaces ---

export interface Consent {
  followUp: boolean;
  employerVerify: boolean;
  analyticsAnonymised: boolean;
  skillPassportShare?: boolean;
  matchingShare?: boolean;
  employerFeedbackShare?: boolean;
  grantedAt: string; // ISO date
  revokedAt?: string;
}

export interface Trainee {
  id: string; // MSOL-MH-xxxx
  apaarId?: string; // 12-digit APAAR ID
  passportId?: string;
  name: string;
  gender: Gender;
  category: Category;
  pwd: boolean;
  age: number;
  phone: string;
  phoneStatus: 'active' | 'changed' | 'unreachable';
  district: string;
  currentLocation: string;
  languagePreference: Language;
  consent: Consent;
  linkedTrainingIds: string[];
  avatarInitials?: string;
}

export interface TrainingEnrolment {
  id: string;
  traineeId: string;
  courseId: string;
  providerId: string;
  batchId: string;
  scheme: Scheme;
  enrolledAt: string;
  certifiedAt: string;
  nsqfLevel: number;
  trade: string;
  courseName: string;
}

export interface OutcomeEvent {
  id: string;
  traineeId: string;
  enrolmentId: string;
  type: OutcomeType;
  occurredAt: string;
  source: OutcomeSource;
  confidence: Confidence;
  employerId?: string;
  occupation?: string;
  wageBand?: WageBand;
  jobLocation?: string;
  trainingRelevant?: boolean | 'partial';
  notes?: string;
}

export interface FollowUp {
  id: string;
  traineeId: string;
  dueAt: string;
  channel: FollowUpChannel;
  status: FollowUpStatus;
  attemptCount: number;
  completedAt?: string;
  surveySnapshot?: SurveySnapshot;
}

export interface SurveySnapshot {
  working: boolean;
  sameEmployer?: boolean;
  wageBand?: WageBand;
  trainingUsedOnJob?: boolean | 'partial';
  reasonIfNotWorking?: NonPlacementReasonCode;
  missingSkills?: string[];
  notes?: string;
}

export interface Employer {
  id: string;
  name: string;
  gstin: string;
  district: string;
  contact: string;
  sector: string;
  confirmationRate: number; // 0-100
}

export interface NonPlacementReason {
  id: string;
  traineeId: string;
  enrolmentId: string;
  reason: NonPlacementReasonCode;
  missingSkillTags: string[];
  notes?: string;
  recordedAt: string;
}

export interface Course {
  id: string;
  name: string;
  trade: string;
  nsqfLevel: number;
  durationWeeks: number;
  sector: string;
  skills?: string[]; // Specific skills acquired
}

export interface Provider {
  id: string;
  name: string;
  district: string;
  address: string;
  contact: string;
  type: 'Private' | 'Government' | 'PPP';
}

export interface ProviderScore {
  providerId: string;
  placementRatePaper: number;
  placementRateVerified90d: number;
  retention90d: number;
  retention180d: number;
  avgWageBand: WageBand;
  jobRoleMatch: number; // percentage
  unreachable: number; // percentage
  dataQualityScore: number; // 0-100
  suspectedInflation: boolean;
}

export interface District {
  name: string;
  code: string;
}

// --- Auth / Demo ---

export interface DemoUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  district?: string;
  providerId?: string;
  employerId?: string;
  traineeId?: string;
}

export interface AppState {
  currentUser: DemoUser | null;
  language: Language;
  isLoggedIn: boolean;
}

// --- Aggregated / Computed ---

export interface KPIData {
  certified: number;
  paperPlacement: number;
  verifiedPlacement: number;
  retention90d: number;
  medianWageBand: WageBand;
  unreachable: number;
  selfEmployment: number;
}

export interface SkillGapEntry {
  courseId: string;
  courseName: string;
  skill: string;
  count: number;
  percentage: number;
}

export interface RetentionPoint {
  day: number; // 0, 30, 90, 180, 365
  rate: number;
}

export interface IntegrityFlag {
  id: string;
  type: 'duplicate_employer' | 'shared_phone' | 'zero_confirms' | 'wage_outlier' | 'suspected_inflation' | 'unverified_skills' | 'matching_without_consent';
  description: string;
  providerId?: string;
  traineeIds?: string[];
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

// ============================================================
// Phase 2: Skill Passport & Matching
// ============================================================

export interface SkillPassport {
  id: string;
  traineeId: string;
  apaarId: string;
  status: 'DRAFT' | 'ACTIVE' | 'REVOKED';
  educationHistory: { level: '10th'|'12th'|'ITI'|'Diploma'|'UG'|'PG'|'Other', institution: string, boardOrUniversity: string, year: string, stream?: string, result?: string }[];
  skills: { tag: string, source: 'SELF'|'TRAINING'|'ASSESSMENT'|'EMPLOYER'|'CERTIFICATE', proficiency: number, verified: boolean }[];
  certifications: { enrolmentId?: string, mockCertId?: string, name: string, issuedBy: string, date: string, nsqfLevel?: number }[];
  internships: { id: string, org: string, role: string, location: string, start: string, end?: string, stipendBand?: string, verified: boolean }[];
  jobs: { id: string, org: string, role: string, location: string, start: string, end?: string, wageBand?: string, verified: boolean }[];
  careerGoal?: { targetOccupation: string, targetNsqf?: number, preferredDistricts: string[], willingToMigrate: boolean };
  lastUpdatedAt: string;
}

export interface SkillAssessment {
  id: string;
  traineeId: string;
  takenAt: string;
  targetCareer: string;
  responses: { question: string, answer: string, score: number }[];
  scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  missingForTarget: string[];
  reportSummary: { en: string, mr: string };
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  providerName: string;
  nsqfLevel?: number;
  skillTags: string[];
  cost: 'FREE' | 'PAID';
  priceInr?: number;
  hours: number;
  mode: 'ONLINE' | 'BLENDED' | 'CENTRE';
  district?: string;
  urlPlaceholder: string;
}

export interface LearningRoadmap {
  id: string;
  traineeId: string;
  generatedAt: string;
  items: { courseId: string, reason: string, priority: 'HIGH'|'MED'|'LOW', status: 'RECOMMENDED'|'ENROLLED'|'COMPLETED' }[];
}

export interface Opportunity {
  id: string;
  kind: 'INTERNSHIP' | 'JOB';
  employerId: string;
  title: string;
  occupation: string;
  district: string;
  skillTagsRequired: string[];
  skillTagsNice: string[];
  stipendOrWageBand: string;
  careerGoalTags: string[];
  openings: number;
  postedAt: string;
  status: 'OPEN' | 'CLOSED';
}

export interface Application {
  id: string;
  traineeId: string;
  opportunityId: string;
  matchScore: number;
  reasons: string[];
  status: 'SUGGESTED' | 'APPLIED' | 'SHORTLISTED' | 'SELECTED' | 'REJECTED' | 'JOINED';
  appliedAt?: string;
  updatedAt: string;
}

export interface EmployerFeedback {
  id: string;
  employerId: string;
  traineeId: string;
  applicationId?: string;
  occurredAt: string;
  ratings: { technical: number, workplaceReadiness: number, communication: number, safety: number, retentionLikelihood: number };
  missingSkillTags: string[];
  wouldHireAgain: boolean;
  notes?: string;
}

export interface SalaryProgression {
  traineeId: string;
  events: { at: string, wageBand: string, source: string, promotion?: boolean, roleTitle?: string }[];
}

// --- Learning Resources (Skill Videos uploaded by Training Providers) ---
export type ResourceType = 'VIDEO' | 'PDF' | 'LINK';
export type ResourceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface LearningResource {
  id: string;
  providerId: string;
  title: string;
  description: string;
  skillTags: string[];
  branch?: string;
  type: ResourceType;
  level: ResourceLevel;
  url: string;
  thumbnailUrl?: string;
  durationMins?: number;
  uploadedAt: string;
  views: number;
}

