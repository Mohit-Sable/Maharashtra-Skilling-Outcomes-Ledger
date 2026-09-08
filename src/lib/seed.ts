// ============================================================
// MSOL — Seed Data (Engineering Colleges & Polytechnic Cohorts)
// ~200 engineering students, 6 institutes, 10 branches, 8 districts
// ============================================================

import {
  Trainee, TrainingEnrolment, OutcomeEvent, FollowUp, Employer,
  NonPlacementReason, Course, Provider, ProviderScore, District,
  DemoUser, IntegrityFlag, WageBand, OutcomeType, OutcomeSource,
  Confidence, FollowUpChannel, FollowUpStatus, NonPlacementReasonCode,
  Scheme, Gender, Category, Language,
  SkillPassport, SkillAssessment, CourseCatalogItem, LearningRoadmap,
  Opportunity, Application, EmployerFeedback, SalaryProgression, LearningResource
} from './types';

// --- Districts ---
export const districts: District[] = [
  { name: 'Pune', code: 'PUN' },
  { name: 'Mumbai Suburban', code: 'MBS' },
  { name: 'Nagpur', code: 'NAG' },
  { name: 'Nashik', code: 'NSK' },
  { name: 'Chhatrapati Sambhajinagar', code: 'CSN' },
  { name: 'Solapur', code: 'SLP' },
  { name: 'Amravati', code: 'AMR' },
  { name: 'Nanded', code: 'NND' },
];

// --- Branches (Academic Programmes & Diplomas) ---
export const courses: Course[] = [
  { id: 'CRS-001', name: 'B.E. Computer Engineering (CSE)', trade: 'Computer Engineering', nsqfLevel: 7, durationWeeks: 16, sector: 'IT & Software', skills: ['Data Structures & Algorithms', 'SQL', 'Java/Python', 'React', 'Git'] },
  { id: 'CRS-002', name: 'B.E. Information Technology (IT)', trade: 'Information Technology', nsqfLevel: 7, durationWeeks: 16, sector: 'IT & Software', skills: ['Python', 'SQL', 'Web Development', 'Git', 'Cloud Basics'] },
  { id: 'CRS-003', name: 'B.E. Mechanical Engineering', trade: 'Mechanical Engineering', nsqfLevel: 7, durationWeeks: 16, sector: 'Automotive & Heavy Engg', skills: ['SolidWorks', 'GD&T', 'AutoCAD', 'Thermodynamics', 'CNC Machining'] },
  { id: 'CRS-004', name: 'B.E. Electronics & Telecommunication (ENTC)', trade: 'Electronics & Telecom', nsqfLevel: 7, durationWeeks: 16, sector: 'Electronics & Embedded', skills: ['Embedded C', 'PLC', 'Microcontrollers', 'MATLAB', 'IoT Protocols'] },
  { id: 'CRS-005', name: 'B.E. Electrical Engineering', trade: 'Electrical Engineering', nsqfLevel: 7, durationWeeks: 16, sector: 'Power & Utilities', skills: ['Power Systems', 'PLC', 'Switchgear & Protection', 'MATLAB', 'Industrial Safety'] },
  { id: 'CRS-006', name: 'B.E. Civil Engineering', trade: 'Civil Engineering', nsqfLevel: 7, durationWeeks: 16, sector: 'Infrastructure & Construction', skills: ['AutoCAD Civil', 'Site Quantity Surveying', 'Structural Analysis', 'Concrete Tech', 'Industrial Safety'] },
  { id: 'CRS-007', name: 'B.Tech Artificial Intelligence & Data Science', trade: 'AI & Data Science', nsqfLevel: 7, durationWeeks: 16, sector: 'IT & Software', skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization', 'Git'] },
  { id: 'CRS-008', name: 'Diploma in Mechanical Engineering', trade: 'Diploma Mechanical', nsqfLevel: 5, durationWeeks: 12, sector: 'Manufacturing & Heavy Engg', skills: ['AutoCAD', 'SolidWorks', 'Workshop Technology', 'CNC Operation', 'Industrial Safety'] },
  { id: 'CRS-009', name: 'Diploma in Computer Engineering', trade: 'Diploma Computer', nsqfLevel: 5, durationWeeks: 12, sector: 'IT & Software', skills: ['Java/Python', 'SQL', 'Web Technologies', 'Networking Basics', 'Git'] },
  { id: 'CRS-010', name: 'Diploma in Civil Engineering', trade: 'Diploma Civil', nsqfLevel: 5, durationWeeks: 12, sector: 'Infrastructure & Construction', skills: ['AutoCAD Civil', 'Surveying & Levelling', 'Site Supervision', 'Quantity Estimation', 'Industrial Safety'] },
];

// --- Engineering Colleges & Polytechnics (Institutes) ---
export const providers: Provider[] = [
  { id: 'PRV-001', name: 'Pune Valley College of Engineering, Pune', district: 'Pune', address: 'Sinhagad Road, Vadgaon Bk, Pune 411041', contact: '9822011234', type: 'Private' },
  { id: 'PRV-002', name: 'Government College of Engineering, Nashik', district: 'Nashik', address: 'Gangapur Road, Nashik 422013', contact: '9822011235', type: 'Government' },
  { id: 'PRV-003', name: 'Mumbai Suburban Institute of Technology, Andheri', district: 'Mumbai Suburban', address: 'MIDC, Andheri East, Mumbai 400093', contact: '9822011236', type: 'PPP' },
  { id: 'PRV-004', name: 'Vidarbha Institute of Technology, Nagpur', district: 'Nagpur', address: 'South Ambazari Road, Nagpur 440022', contact: '9822011237', type: 'Government' },
  { id: 'PRV-005', name: 'Marathwada Engineering College, Chhatrapati Sambhajinagar', district: 'Chhatrapati Sambhajinagar', address: 'Station Road, CSN 431005', contact: '9822011238', type: 'Private' },
  { id: 'PRV-006', name: 'Solapur Polytechnic (Diploma), Solapur', district: 'Solapur', address: 'Akkalkot Road, Solapur 413006', contact: '9822011239', type: 'Government' },
];

// --- Engineering Employers ---
export const employers: Employer[] = [
  { id: 'EMP-001', name: 'Tata Motors Components & CV', gstin: '27AABCT1234A1ZP', district: 'Pune', contact: '9800000001', sector: 'Automotive', confirmationRate: 88 },
  { id: 'EMP-002', name: 'Bajaj Auto Ltd - Chakan', gstin: '27AADCB5678B2ZQ', district: 'Pune', contact: '9800000002', sector: 'Automotive', confirmationRate: 90 },
  { id: 'EMP-003', name: 'L&T Heavy Civil Infrastructure', gstin: '27AABCL9012C3ZR', district: 'Mumbai Suburban', contact: '9800000003', sector: 'Infrastructure', confirmationRate: 85 },
  { id: 'EMP-004', name: 'Persistent Systems', gstin: '27AADCP3456D4ZS', district: 'Pune', contact: '9800000004', sector: 'IT & Software', confirmationRate: 92 },
  { id: 'EMP-005', name: 'Mahindra & Mahindra Automotive', gstin: '27AABCM7890E5ZT', district: 'Nashik', contact: '9800000005', sector: 'Automotive', confirmationRate: 88 },
  { id: 'EMP-006', name: 'Kirloskar Oil Engines', gstin: '27AABCK2345F6ZU', district: 'Pune', contact: '9800000006', sector: 'Heavy Engineering', confirmationRate: 85 },
  { id: 'EMP-007', name: 'TCS Delivery Centre', gstin: '27AABCT6789G7ZV', district: 'Pune', contact: '9800000007', sector: 'IT Services', confirmationRate: 86 },
  { id: 'EMP-008', name: 'Siemens Energy & Automation', gstin: '27AADCS1234H8ZW', district: 'Nashik', contact: '9800000008', sector: 'Electrical & Automation', confirmationRate: 89 },
  { id: 'EMP-009', name: 'Godrej Infotech & Engineering', gstin: '27AABCG5678I9ZX', district: 'Mumbai Suburban', contact: '9800000009', sector: 'IT & Automation', confirmationRate: 84 },
  { id: 'EMP-010', name: 'MahaTransco / MahaGenco', gstin: '27AADCM9012J0ZY', district: 'Nagpur', contact: '9800000010', sector: 'Power Utility', confirmationRate: 95 },
  { id: 'EMP-011', name: 'QuickHire Tech Solutions', gstin: '27AABCQ3456K1ZZ', district: 'Pune', contact: '9800000011', sector: 'Campus Staffing', confirmationRate: 24 },
  { id: 'EMP-012', name: 'KEC International (Civil & Power)', gstin: '27AADCK7890L2ZA', district: 'Nagpur', contact: '9800000012', sector: 'Power & Civil Infra', confirmationRate: 82 },
];

// --- Marathi first names and surnames ---
const maleFirstNames = [
  'Rahul', 'Sachin', 'Avinash', 'Prashant', 'Santosh', 'Mahesh', 'Sunil', 'Amit',
  'Ganesh', 'Vikram', 'Rajesh', 'Deepak', 'Nitin', 'Ajay', 'Sagar', 'Akash',
  'Vikas', 'Pravin', 'Yogesh', 'Tushar', 'Kiran', 'Ravi', 'Anand', 'Bhushan',
  'Swapnil', 'Mangesh', 'Omkar', 'Pratik', 'Rohan', 'Shubham', 'Vaibhav', 'Amol',
];
const femaleFirstNames = [
  'Priya', 'Sneha', 'Pooja', 'Kavita', 'Sunita', 'Anita', 'Rashmi', 'Swati',
  'Manisha', 'Rupa', 'Deepa', 'Asha', 'Savita', 'Rekha', 'Vandana', 'Shweta',
  'Pallavi', 'Madhuri', 'Vaishali', 'Jyoti', 'Komal', 'Neha', 'Archana', 'Rupali',
  'Prajakta', 'Gauri', 'Aparna', 'Smita', 'Sayali', 'Tanuja', 'Bhagyashree', 'Dhanashri',
];
const surnames = [
  'Patil', 'Deshmukh', 'Jadhav', 'Pawar', 'More', 'Shinde', 'Kulkarni', 'Gaikwad',
  'Bhosale', 'Chavan', 'Sonawane', 'Kamble', 'Kadam', 'Wagh', 'Deshpande', 'Joshi',
  'Kale', 'Mane', 'Nikam', 'Thorat', 'Salunkhe', 'Ingale', 'Waghmare', 'Suryawanshi',
  'Bansode', 'Rathod', 'Phule', 'Lokhande', 'Sawant', 'Thakur',
];

// --- Utility helpers ---
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = seededRandom(26135); // SIH problem code as seed

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeighted<T>(arr: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function generatePhone(): string {
  const prefixes = ['98', '97', '96', '95', '94', '93', '91', '90', '88', '87', '86', '85'];
  let p = pick(prefixes);
  for (let i = 0; i < 8; i++) p += Math.floor(rand() * 10);
  return p;
}

// --- Generate Students & Outcomes ---
export const trainees: Trainee[] = [];
export const enrolments: TrainingEnrolment[] = [];
export const outcomeEvents: OutcomeEvent[] = [];
export const followUps: FollowUp[] = [];
export const nonPlacementReasons: NonPlacementReason[] = [];

const categories: Category[] = ['General', 'OBC', 'SC', 'ST'];
const categoryWeights = [30, 38, 20, 12];
const wageBands: WageBand[] = ['<10k', '10-15k', '15-20k', '20-30k', '30k+'];
const schemes: Scheme[] = ['AICTE UG', 'Diploma', 'Internship', 'Add-on Skilling'];
const schemeWeights = [50, 25, 15, 10];
const channels: FollowUpChannel[] = ['WHATSAPP', 'SMS', 'IVR', 'CALL'];

const nonPlacementCodes: NonPlacementReasonCode[] = [
  'NO_VACANCY', 'WAGE_TOO_LOW', 'LOCATION', 'LANGUAGE', 'MISSING_SKILL',
  'FAMILY', 'HEALTH', 'MIGRATION', 'FAKE_LEAD', 'EMPLOYER_REJECTED', 'DOCUMENT_ISSUE', 'OTHER'
];

const missingSkillsPool = [
  'Data Structures & Algorithms', 'SQL', 'Java/Python', 'React', 'Git',
  'Spoken English', 'Aptitude', 'SolidWorks', 'GD&T', 'PLC', 'AutoCAD Civil',
  'Embedded C', 'MATLAB', 'Site Quantity Surveying', 'Industrial Safety'
];

// Institute-branch mapping
const providerCourses: Record<string, string[]> = {
  'PRV-001': ['CRS-001', 'CRS-002', 'CRS-003', 'CRS-004'], // Pune Valley College (CSE, IT, Mech, ENTC)
  'PRV-002': ['CRS-001', 'CRS-003', 'CRS-005', 'CRS-006'], // GCOE Nashik (CSE, Mech, Electrical, Civil)
  'PRV-003': ['CRS-001', 'CRS-002', 'CRS-004', 'CRS-007'], // Mumbai Suburban IT (CSE, IT, ENTC, AI&DS)
  'PRV-004': ['CRS-003', 'CRS-005', 'CRS-006'],              // Vidarbha IT Nagpur (Mech, Electrical, Civil)
  'PRV-005': ['CRS-003', 'CRS-004', 'CRS-007'],              // Marathwada Engg (Mech, ENTC, AI&DS)
  'PRV-006': ['CRS-008', 'CRS-009', 'CRS-010'],              // Solapur Polytechnic (Diploma Mech, Comp, Civil)
};

// Batch months (Final graduating year 2025/2026 batches)
const batchStartDates = [
  '2025-06-01', '2025-07-15', '2025-08-01', '2025-09-15', '2025-10-01',
  '2025-11-01', '2025-12-01', '2026-01-15', '2026-02-01', '2026-03-01',
];

let traineeCounter = 0;
let enrolmentCounter = 0;
let outcomeCounter = 0;
let followUpCounter = 0;
let nprCounter = 0;

// Generate ~200 engineering students distributed across institutes
for (const providerId of Object.keys(providerCourses)) {
  const providerObj = providers.find(p => p.id === providerId)!;
  const courseIds = providerCourses[providerId];
  const traineesPerProvider = providerId === 'PRV-001' ? 50 : providerId === 'PRV-002' ? 40 : 28;

  for (let i = 0; i < traineesPerProvider; i++) {
    traineeCounter++;
    const gender: Gender = rand() < 0.4 ? 'Female' : 'Male';
    const firstName = gender === 'Male' ? pick(maleFirstNames) : pick(femaleFirstNames);
    const surname = pick(surnames);
    const category = pickWeighted(categories, categoryWeights);
    // Ensure at least one PwD student for Story G
    const isPwd = traineeCounter === 18 ? true : rand() < 0.04;
    // Age 19 to 24 for BE / Diploma
    const age = Math.floor(rand() * 5) + 19;
    const district = providerObj.district;
    
    // Rural to Pune/Mumbai education migration
    const migrated = rand() < 0.28;
    const currentLocation = migrated 
      ? (rand() < 0.65 ? 'Pune' : 'Mumbai Suburban')
      : district;

    // Story E: Student MSOL-MH-0005 changed phone upon leaving hostel
    let phoneStatus: 'active' | 'changed' | 'unreachable';
    if (traineeCounter === 5) {
      phoneStatus = 'unreachable';
    } else {
      phoneStatus = rand() < 0.11 ? 'unreachable' : rand() < 0.08 ? 'changed' : 'active';
    }

    const traineeId = `MSOL-MH-${String(traineeCounter).padStart(4, '0')}`;
    const apaarBase = Math.floor(rand() * 9000) + 1000;
    const apaarMid = Math.floor(rand() * 9000) + 1000;
    const apaarEnd = Math.floor(rand() * 9000) + 1000;
    const apaarId = `${apaarBase}-${apaarMid}-${apaarEnd}`;

    const passportId = `PPT-${String(traineeCounter).padStart(5, '0')}`;

    const trainee: Trainee = {
      id: traineeId,
      apaarId,
      passportId,
      name: `${firstName} ${surname}`,
      gender,
      category,
      pwd: isPwd,
      age,
      phone: generatePhone(),
      phoneStatus,
      district,
      currentLocation,
      languagePreference: rand() < 0.65 ? 'mr' : rand() < 0.5 ? 'hi' : 'en',
      consent: {
        followUp: rand() < 0.94,
        employerVerify: rand() < 0.88,
        analyticsAnonymised: rand() < 0.96,
        skillPassportShare: rand() < 0.92,
        matchingShare: rand() < 0.88,
        employerFeedbackShare: rand() < 0.85,
        grantedAt: '2025-06-01',
        revokedAt: rand() < 0.02 ? '2026-05-01' : undefined,
      },
      linkedTrainingIds: [],
      avatarInitials: `${firstName[0]}${surname[0]}`,
    };

    // Override demo trainee identity (Story F: Rahul Kamble, MSOL-MH-0001)
    if (traineeCounter === 1) {
      trainee.name = 'Rahul Kamble';
      trainee.avatarInitials = 'RK';
      trainee.gender = 'Male';
      trainee.age = 22;
    }

    // Create branch enrolment
    let courseId = pick(courseIds);
    // Force MSOL-MH-0001 to CSE (Story F)
    if (traineeCounter === 1) courseId = 'CRS-001';
    // Force MSOL-MH-0005 to Mechanical (Story D/E)
    if (traineeCounter === 5) courseId = 'CRS-003';
    // Force MSOL-MH-0018 to CSE for PwD Story G
    if (traineeCounter === 18) courseId = 'CRS-001';

    const course = courses.find(c => c.id === courseId)!;
    const batchStart = pick(batchStartDates);
    const certifiedDate = addDays(batchStart, course.durationWeeks * 7);

    enrolmentCounter++;
    const enrolmentId = `ENR-${String(enrolmentCounter).padStart(4, '0')}`;

    trainee.linkedTrainingIds.push(enrolmentId);

    const isDiplomaCourse = course.trade.startsWith('Diploma');
    const assignedScheme: Scheme = isDiplomaCourse ? 'Diploma' : 'AICTE UG';

    const enrolment: TrainingEnrolment = {
      id: enrolmentId,
      traineeId,
      courseId,
      providerId,
      batchId: `BATCH-${providerId.split('-')[1]}-${batchStart.replace(/-/g, '').slice(2, 6)}`,
      scheme: assignedScheme,
      enrolledAt: batchStart,
      certifiedAt: certifiedDate,
      nsqfLevel: course.nsqfLevel,
      trade: course.trade,
      courseName: course.name,
    };

    // --- Generate outcome events based on stories ---
    const isPuneValley = providerId === 'PRV-001';
    const isGCOENashik = providerId === 'PRV-002';
    const isCSE = courseId === 'CRS-001' || courseId === 'CRS-002';
    const isMechanical = courseId === 'CRS-003' || courseId === 'CRS-008';

    // Paper placement probability (TPO Claim)
    let placementProb: number;
    if (isPuneValley) placementProb = 0.82;
    else if (isGCOENashik) placementProb = 0.61;
    else placementProb = 0.58 + rand() * 0.2;

    const placed = rand() < placementProb;

    if (placed) {
      outcomeCounter++;
      let employer = pick(employers);
      
      // Pune Valley uses QuickHire fake staffing agency for some leads
      if (isPuneValley && rand() < 0.3) {
        employer = employers.find(e => e.id === 'EMP-011') || employer;
      }

      // Initial salary band: GET and interns
      let initialWage: WageBand;
      if (isCSE) {
        // Story C: High paper placement, but many low 10-15k service/subcontract offers
        initialWage = pickWeighted(wageBands, [15, 45, 25, 10, 5]);
      } else if (isDiplomaCourse) {
        initialWage = pickWeighted(wageBands, [35, 40, 20, 5, 0]);
      } else {
        initialWage = pickWeighted(wageBands, [10, 25, 35, 20, 10]);
      }

      // PLACED event
      const placedDate = addDays(certifiedDate, Math.floor(rand() * 25) + 5);
      const placedEvent: OutcomeEvent = {
        id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
        traineeId,
        enrolmentId,
        type: 'PLACED',
        occurredAt: placedDate,
        source: isPuneValley 
          ? pickWeighted(['SELF', 'COUNSELLOR', 'EMPLOYER'] as OutcomeSource[], [60, 30, 10])
          : pickWeighted(['EMPLOYER', 'COUNSELLOR', 'SELF'] as OutcomeSource[], [45, 35, 20]),
        confidence: isPuneValley
          ? pickWeighted(['UNVERIFIED', 'EMPLOYER_CONFIRMED'] as Confidence[], [75, 25])
          : pickWeighted(['EMPLOYER_CONFIRMED', 'DOCUMENT_BACKED', 'UNVERIFIED'] as Confidence[], [55, 30, 15]),
        employerId: employer.id,
        occupation: `Junior Engineer - ${course.trade.replace('B.E. ', '')}`,
        wageBand: initialWage,
        jobLocation: employer.district,
        trainingRelevant: rand() < 0.7 ? true : rand() < 0.5 ? 'partial' : false,
        notes: isPuneValley && employer.id === 'EMP-011' ? 'Campus drive placement via QuickHire Tech Solutions' : 'Campus offer letter issued',
      };
      outcomeEvents.push(placedEvent);

      // 90-day follow-up: retention or left
      const retentionProb = isPuneValley ? 0.41 : isGCOENashik ? 0.58 / 0.61 : 0.62;
      const retained90 = rand() < retentionProb;

      if (phoneStatus === 'unreachable') {
        outcomeCounter++;
        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'UNREACHABLE',
          occurredAt: addDays(placedDate, 88 + Math.floor(rand() * 6)),
          source: 'COUNSELLOR',
          confidence: 'UNVERIFIED',
          notes: 'Hostel contact changed; student phone switched off after 3 attempts.',
        });
      } else if (retained90) {
        // RETAINED event
        outcomeCounter++;
        const retainedDate = addDays(placedDate, 90 + Math.floor(rand() * 15));
        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'RETAINED',
          occurredAt: retainedDate,
          source: pickWeighted(['EMPLOYER', 'SELF', 'COUNSELLOR'] as OutcomeSource[], [45, 35, 20]),
          confidence: isGCOENashik 
            ? pickWeighted(['EMPLOYER_CONFIRMED', 'DOCUMENT_BACKED'] as Confidence[], [70, 30])
            : pickWeighted(['UNVERIFIED', 'EMPLOYER_CONFIRMED'] as Confidence[], [55, 45]),
          employerId: employer.id,
          wageBand: initialWage,
          jobLocation: employer.district,
          trainingRelevant: placedEvent.trainingRelevant,
        });

        // Wage Progression (180d)
        if (rand() < 0.35 || isGCOENashik) {
          outcomeCounter++;
          const wageIdx = wageBands.indexOf(initialWage);
          const newWage = wageIdx < wageBands.length - 1 ? wageBands[wageIdx + 1] : initialWage;
          outcomeEvents.push({
            id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
            traineeId,
            enrolmentId,
            type: 'WAGE_UPDATE',
            occurredAt: addDays(retainedDate, 70 + Math.floor(rand() * 20)),
            source: isGCOENashik ? 'EMPLOYER' : 'SELF',
            confidence: isGCOENashik ? 'EMPLOYER_CONFIRMED' : 'UNVERIFIED',
            wageBand: newWage,
            notes: 'Confirmed GET probation completion with wage revision',
          });
        }
      } else {
        // LEFT_JOB event
        outcomeCounter++;
        const leftDate = addDays(placedDate, 30 + Math.floor(rand() * 50));
        // Story C: CSE students leave due to low wages in entry-level service contracts
        const leftReason: NonPlacementReasonCode = isCSE
          ? pickWeighted(['WAGE_TOO_LOW', 'MISSING_SKILL', 'LOCATION', 'OTHER'] as NonPlacementReasonCode[], [55, 25, 10, 10])
          : pickWeighted(nonPlacementCodes.slice(0, 8), [20, 25, 15, 10, 15, 5, 5, 5]);

        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'LEFT_JOB',
          occurredAt: leftDate,
          source: pickWeighted(['SELF', 'COUNSELLOR'] as OutcomeSource[], [60, 40]),
          confidence: 'UNVERIFIED',
          notes: `Left role. Reason: ${leftReason} — ${leftReason === 'WAGE_TOO_LOW' ? 'Offered ₹11k monthly stipend with high bond period' : 'Seeking higher technical role'}`,
        });

        // Record non-placement reason
        nprCounter++;
        const missingSkills: string[] = [];
        if (leftReason === 'MISSING_SKILL' || rand() < 0.4) {
          if (isMechanical) missingSkills.push('SolidWorks', 'GD&T');
          else if (isCSE) missingSkills.push('Data Structures & Algorithms', 'SQL');
          else missingSkills.push(pick(missingSkillsPool));
        }

        nonPlacementReasons.push({
          id: `NPR-${String(nprCounter).padStart(4, '0')}`,
          traineeId,
          enrolmentId,
          reason: leftReason,
          missingSkillTags: missingSkills,
          recordedAt: leftDate,
        });
      }

      // Fake lead flags for Pune Valley College
      if (isPuneValley && employer.id === 'EMP-011' && rand() < 0.15) {
        outcomeCounter++;
        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'NOT_PLACED',
          occurredAt: addDays(certifiedDate, 45),
          source: 'COUNSELLOR',
          confidence: 'UNVERIFIED',
          notes: 'Candidate reported campus staffing agency never called them after issuing letter. Flagged as fake lead.',
        });
      }
    } else {
      // NOT PLACED
      const selfEmp = rand() < 0.1;
      const apprentice = !selfEmp && rand() < 0.14;

      if (selfEmp) {
        outcomeCounter++;
        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'SELF_EMPLOYED',
          occurredAt: addDays(certifiedDate, Math.floor(rand() * 45) + 20),
          source: 'SELF',
          confidence: 'UNVERIFIED',
          occupation: `Founder / Tech Consultant (${course.trade})`,
          wageBand: pickWeighted(wageBands, [10, 30, 35, 20, 5]),
          trainingRelevant: true,
          notes: 'Started engineering consulting / software freelancing firm',
        });
      } else if (apprentice) {
        outcomeCounter++;
        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'APPRENTICE',
          occurredAt: addDays(certifiedDate, Math.floor(rand() * 40) + 10),
          source: 'EMPLOYER',
          confidence: 'EMPLOYER_CONFIRMED',
          employerId: pick(employers).id,
          occupation: `Graduate Apprentice Trainee (GAT) - ${course.trade}`,
          wageBand: '<10k',
          trainingRelevant: true,
        });
      } else {
        outcomeCounter++;
        const notPlacedDate = addDays(certifiedDate, Math.floor(rand() * 60) + 30);
        // Story D: Mechanical graduates missing SolidWorks & GD&T
        const reason = isMechanical
          ? pickWeighted(['MISSING_SKILL', 'NO_VACANCY', 'LOCATION'] as NonPlacementReasonCode[], [55, 30, 15])
          : pickWeighted(nonPlacementCodes.slice(0, 8), [25, 20, 15, 10, 15, 5, 5, 5]);

        outcomeEvents.push({
          id: `OE-${String(outcomeCounter).padStart(5, '0')}`,
          traineeId,
          enrolmentId,
          type: 'NOT_PLACED',
          occurredAt: notPlacedDate,
          source: 'COUNSELLOR',
          confidence: 'UNVERIFIED',
          notes: `Not placed. Primary reason: ${reason}`,
        });

        // Non-placement reason
        nprCounter++;
        const missingSkills: string[] = [];
        if (reason === 'MISSING_SKILL' || isMechanical) {
          if (isMechanical) {
            missingSkills.push('SolidWorks', 'GD&T');
          } else if (isCSE) {
            missingSkills.push('Data Structures & Algorithms', 'SQL');
          } else {
            missingSkills.push(pick(missingSkillsPool));
          }
        }
        if (reason === 'LANGUAGE') {
          missingSkills.push('Spoken English');
        }

        nonPlacementReasons.push({
          id: `NPR-${String(nprCounter).padStart(4, '0')}`,
          traineeId,
          enrolmentId,
          reason,
          missingSkillTags: missingSkills,
          recordedAt: notPlacedDate,
        });
      }
    }

    // --- Generate follow-ups ---
    const cadences = [30, 90, 180, 365];
    for (const cadence of cadences) {
      const dueDate = addDays(certifiedDate, cadence);
      if (new Date(dueDate) > new Date('2026-09-03')) continue;

      followUpCounter++;
      const pastDue = new Date(dueDate) < new Date('2026-08-01');
      const status: FollowUpStatus = pastDue 
        ? (phoneStatus === 'unreachable' 
          ? pickWeighted(['NO_REPLY', 'ESCALATED'] as FollowUpStatus[], [60, 40])
          : pickWeighted(['COMPLETED', 'NO_REPLY', 'SENT'] as FollowUpStatus[], [65, 20, 15]))
        : 'PENDING';

      followUps.push({
        id: `FU-${String(followUpCounter).padStart(5, '0')}`,
        traineeId,
        dueAt: dueDate,
        channel: pickWeighted(channels, [45, 25, 15, 15]),
        status,
        attemptCount: status === 'COMPLETED' ? Math.floor(rand() * 2) + 1 : 
                      status === 'NO_REPLY' ? Math.floor(rand() * 3) + 2 : 
                      status === 'ESCALATED' ? 3 : 0,
        completedAt: status === 'COMPLETED' ? addDays(dueDate, Math.floor(rand() * 7)) : undefined,
      });
    }

    trainees.push(trainee);
    enrolments.push(enrolment);
  }
}

// --- Institute Scores (Scorecards) ---
function computeProviderScore(providerId: string): ProviderScore {
  const provEnrolments = enrolments.filter(e => e.providerId === providerId);
  const traineeIds = provEnrolments.map(e => e.traineeId);
  const total = traineeIds.length;
  if (total === 0) {
    return {
      providerId,
      placementRatePaper: 0,
      placementRateVerified90d: 0,
      retention90d: 0,
      retention180d: 0,
      avgWageBand: '<10k',
      jobRoleMatch: 0,
      unreachable: 0,
      dataQualityScore: 0,
      suspectedInflation: false,
    };
  }

  const provOutcomes = outcomeEvents.filter(o => traineeIds.includes(o.traineeId));
  const placedEvents = provOutcomes.filter(o => o.type === 'PLACED' || o.type === 'SELF_EMPLOYED' || o.type === 'APPRENTICE');
  const retainedEvents = provOutcomes.filter(o => o.type === 'RETAINED');
  const unreachableEvents = provOutcomes.filter(o => o.type === 'UNREACHABLE');
  const confirmedEvents = provOutcomes.filter(o => o.confidence === 'EMPLOYER_CONFIRMED');

  const placementRatePaper = Math.round((placedEvents.length / total) * 100);
  const verifiedPlaced = placedEvents.filter(o => o.confidence !== 'UNVERIFIED').length;
  const placementRateVerified90d = Math.round(((retainedEvents.length + verifiedPlaced * 0.3) / total) * 100);
  const retention90d = placedEvents.length > 0 ? Math.round((retainedEvents.length / placedEvents.length) * 100) : 0;
  const retention180d = Math.max(0, retention90d - Math.floor(rand() * 12));
  const unreachablePct = Math.round((unreachableEvents.length / total) * 100);
  const jobMatch = provOutcomes.filter(o => o.trainingRelevant === true).length;
  const jobRoleMatch = Math.round((jobMatch / Math.max(1, placedEvents.length)) * 100);

  const confirmRate = placedEvents.length > 0 ? confirmedEvents.length / placedEvents.length : 0;
  let dqs = 50 + confirmRate * 30 - unreachablePct * 0.5;
  if (placementRatePaper > 80 && confirmRate < 0.3) dqs -= 20;
  dqs = Math.max(0, Math.min(100, Math.round(dqs)));

  const suspectedInflation = placementRatePaper > 75 && confirmRate < 0.35 && unreachablePct > 10;

  const wageEvents = provOutcomes.filter(o => o.wageBand);
  const wageIndex = wageEvents.length > 0 
    ? Math.round(wageEvents.reduce((sum, o) => sum + wageBands.indexOf(o.wageBand!), 0) / wageEvents.length)
    : 1;

  return {
    providerId,
    placementRatePaper,
    placementRateVerified90d: Math.min(placementRateVerified90d, placementRatePaper),
    retention90d,
    retention180d,
    avgWageBand: wageBands[Math.min(wageIndex, wageBands.length - 1)],
    jobRoleMatch,
    unreachable: unreachablePct,
    dataQualityScore: dqs,
    suspectedInflation,
  };
}

export const providerScores: ProviderScore[] = providers.map(p => computeProviderScore(p.id));

// Override Pune Valley College to match MUST requirements (Story A)
const puneValleyIdx = providerScores.findIndex(ps => ps.providerId === 'PRV-001');
if (puneValleyIdx >= 0) {
  providerScores[puneValleyIdx] = {
    ...providerScores[puneValleyIdx],
    placementRatePaper: 82,
    placementRateVerified90d: 38,
    retention90d: 41,
    retention180d: 29,
    unreachable: 18,
    dataQualityScore: 32,
    suspectedInflation: true,
  };
}

// Override GCOE Nashik to match MUST requirements (Story B)
const gcoeNashikIdx = providerScores.findIndex(ps => ps.providerId === 'PRV-002');
if (gcoeNashikIdx >= 0) {
  providerScores[gcoeNashikIdx] = {
    ...providerScores[gcoeNashikIdx],
    placementRatePaper: 61,
    placementRateVerified90d: 58,
    retention90d: 74,
    retention180d: 68,
    unreachable: 5,
    dataQualityScore: 88,
    suspectedInflation: false,
  };
}

// --- Integrity Flags (Campus Placement Integrity Queue) ---
export const integrityFlags: IntegrityFlag[] = [
  {
    id: 'IF-001',
    type: 'suspected_inflation',
    description: 'Pune Valley College of Engineering: TPO reports 82% paper placement; only 38% verified at 90 days. 18% unreachable.',
    providerId: 'PRV-001',
    severity: 'high',
    createdAt: '2026-07-15',
  },
  {
    id: 'IF-002',
    type: 'zero_confirms',
    description: '12 placements attributed to QuickHire Tech Solutions (EMP-011) — 0 employer confirmations received.',
    providerId: 'PRV-001',
    severity: 'high',
    createdAt: '2026-07-20',
  },
  {
    id: 'IF-003',
    type: 'shared_phone',
    description: 'Hostel phone number 9876001234 reused across 3 different "placed" engineering graduates — possible data fabrication.',
    providerId: 'PRV-001',
    traineeIds: ['MSOL-MH-0005', 'MSOL-MH-0012', 'MSOL-MH-0031'],
    severity: 'high',
    createdAt: '2026-08-01',
  },
  {
    id: 'IF-004',
    type: 'wage_outlier',
    description: 'B.E. CSE branch: 42% of placed candidates report wages <₹12,000 — below state engineering benchmark.',
    severity: 'medium',
    createdAt: '2026-08-05',
  },
  {
    id: 'IF-005',
    type: 'duplicate_employer',
    description: '"QuickHire Tech Solutions" and "Quick Hire Staffing Pune" registered with identical premises but distinct GSTINs.',
    severity: 'medium',
    createdAt: '2026-08-10',
  },
];

// --- Demo Users ---
export const demoUsers: DemoUser[] = [
  { email: 'admin@msol.demo', password: 'demo123', role: 'state_admin', name: 'Dr. Anand Kulkarni (DTE / MSINS)', district: undefined },
  { email: 'district@msol.demo', password: 'demo123', role: 'district_officer', name: 'Smt. Manjiri Deshmukh', district: 'Pune' },
  { email: 'provider@msol.demo', password: 'demo123', role: 'training_provider', name: 'Prof. Rajesh Patil (TPO Pune Valley)', providerId: 'PRV-001' },
  { email: 'employer@msol.demo', password: 'demo123', role: 'employer', name: 'Vikram Sharma (Tata Motors HR)', employerId: 'EMP-001' },
  { email: 'counsellor@msol.demo', password: 'demo123', role: 'counsellor', name: 'Sneha Jadhav (Career Counsellor)', district: 'Pune' },
  { email: 'trainee@msol.demo', password: 'demo123', role: 'trainee', name: 'Rahul Kamble (B.E. CSE)', traineeId: 'MSOL-MH-0001' },
];

// --- Helper to get aggregate KPIs ---
export function getKPIs(filters?: {
  providerId?: string;
  courseId?: string;
  district?: string;
  scheme?: string;
  verifiedOnly?: boolean;
}) {
  let filteredEnrolments = [...enrolments];
  if (filters?.providerId) filteredEnrolments = filteredEnrolments.filter(e => e.providerId === filters.providerId);
  if (filters?.courseId) filteredEnrolments = filteredEnrolments.filter(e => e.courseId === filters.courseId);
  if (filters?.scheme) filteredEnrolments = filteredEnrolments.filter(e => e.scheme === filters.scheme);
  if (filters?.district) {
    const distTrainees = trainees.filter(t => t.district === filters.district).map(t => t.id);
    filteredEnrolments = filteredEnrolments.filter(e => distTrainees.includes(e.traineeId));
  }

  const traineeIds = filteredEnrolments.map(e => e.traineeId);
  const total = traineeIds.length;
  let outcomes = outcomeEvents.filter(o => traineeIds.includes(o.traineeId));
  
  if (filters?.verifiedOnly) {
    outcomes = outcomes.filter(o => o.confidence !== 'UNVERIFIED');
  }

  const placed = new Set(outcomes.filter(o => ['PLACED', 'SELF_EMPLOYED', 'APPRENTICE'].includes(o.type)).map(o => o.traineeId));
  const retained = new Set(outcomes.filter(o => o.type === 'RETAINED').map(o => o.traineeId));
  const selfEmp = new Set(outcomes.filter(o => o.type === 'SELF_EMPLOYED').map(o => o.traineeId));
  const unreachable = new Set(outcomes.filter(o => o.type === 'UNREACHABLE').map(o => o.traineeId));

  return {
    certified: total,
    paperPlacement: total > 0 ? Math.round((placed.size / total) * 100) : 0,
    verifiedPlacement: total > 0 ? Math.round((retained.size / total) * 100) : 0,
    retention90d: placed.size > 0 ? Math.round((retained.size / placed.size) * 100) : 0,
    medianWageBand: '15-20k' as WageBand,
    unreachable: total > 0 ? Math.round((unreachable.size / total) * 100) : 0,
    selfEmployment: total > 0 ? Math.round((selfEmp.size / total) * 100) : 0,
  };
}

// --- Retention curve data ---
export function getRetentionCurve(providerId?: string): { day: number; rate: number }[] {
  const ps = providerId ? providerScores.find(p => p.providerId === providerId) : null;
  if (ps) {
    return [
      { day: 0, rate: ps.placementRatePaper },
      { day: 30, rate: Math.round(ps.placementRatePaper * 0.88) },
      { day: 90, rate: ps.retention90d },
      { day: 180, rate: ps.retention180d },
      { day: 365, rate: Math.max(15, ps.retention180d - 8) },
    ];
  }
  // Aggregate state-wide engineering cohort
  return [
    { day: 0, rate: 71 },
    { day: 30, rate: 62 },
    { day: 90, rate: 49 },
    { day: 180, rate: 42 },
    { day: 365, rate: 36 },
  ];
}

// --- Skill gap aggregation ---
export function getSkillGaps(): { courseId: string; courseName: string; skill: string; count: number; percentage: number }[] {
  const gaps: Record<string, Record<string, number>> = {};
  const courseTotals: Record<string, number> = {};

  for (const npr of nonPlacementReasons) {
    const enr = enrolments.find(e => e.id === npr.enrolmentId);
    if (!enr) continue;
    const courseKey = enr.courseId;
    if (!gaps[courseKey]) gaps[courseKey] = {};
    if (!courseTotals[courseKey]) courseTotals[courseKey] = 0;
    courseTotals[courseKey]++;
    
    for (const skill of npr.missingSkillTags) {
      gaps[courseKey][skill] = (gaps[courseKey][skill] || 0) + 1;
    }
    if (npr.reason === 'LANGUAGE') {
      gaps[courseKey]['Spoken English'] = (gaps[courseKey]['Spoken English'] || 0) + 1;
    }
  }

  const result: { courseId: string; courseName: string; skill: string; count: number; percentage: number }[] = [];
  for (const courseId of Object.keys(gaps)) {
    const course = courses.find(c => c.id === courseId);
    if (!course) continue;
    for (const [skill, count] of Object.entries(gaps[courseId])) {
      result.push({
        courseId,
        courseName: course.name,
        skill,
        count,
        percentage: Math.round((count / Math.max(1, courseTotals[courseId])) * 100),
      });
    }
  }

  return result.sort((a, b) => b.count - a.count);
}

// --- Engineering Remedial & Skilling Catalog ---
export const catalog: CourseCatalogItem[] = [
  { id: 'CAT-001', title: 'Data Structures & Algorithms in Java/C++ (NPTEL)', providerName: 'IIT Bombay / NPTEL', nsqfLevel: 7, skillTags: ['Data Structures & Algorithms', 'Java/Python'], cost: 'FREE', hours: 40, mode: 'ONLINE', urlPlaceholder: '#' },
  { id: 'CAT-002', title: 'Advanced SQL, Query Optimization & Indexing', providerName: 'Persistent Systems Tech Academy', nsqfLevel: 7, skillTags: ['SQL', 'Database Indexing'], cost: 'FREE', hours: 25, mode: 'ONLINE', urlPlaceholder: '#' },
  { id: 'CAT-003', title: 'SolidWorks & GD&T Professional 30-Hour Lab', providerName: 'COEP Technological University', nsqfLevel: 7, skillTags: ['SolidWorks', 'GD&T'], cost: 'PAID', priceInr: 3500, hours: 30, mode: 'BLENDED', district: 'Pune', urlPlaceholder: '#' },
  { id: 'CAT-004', title: 'Corporate Technical Spoken English & GD Prep', providerName: 'British Council & MSINS', nsqfLevel: 6, skillTags: ['Spoken English', 'Aptitude'], cost: 'FREE', hours: 20, mode: 'ONLINE', urlPlaceholder: '#' },
  { id: 'CAT-005', title: 'Industrial PLC, SCADA & Automation Lab', providerName: 'Siemens Automation Centre', nsqfLevel: 7, skillTags: ['PLC', 'Embedded C', 'Industrial Safety'], cost: 'PAID', priceInr: 4500, hours: 35, mode: 'CENTRE', district: 'Nashik', urlPlaceholder: '#' },
  { id: 'CAT-006', title: 'AutoCAD Civil & Total Station Site Estimation', providerName: 'L&T Construction Academy', nsqfLevel: 7, skillTags: ['AutoCAD Civil', 'Site Quantity Surveying'], cost: 'PAID', priceInr: 3000, hours: 40, mode: 'CENTRE', district: 'Mumbai Suburban', urlPlaceholder: '#' },
  { id: 'CAT-007', title: 'Production Git & Open-Source Portfolio Building', providerName: 'Maharashtra Open Tech Foundation', nsqfLevel: 6, skillTags: ['Git', 'React'], cost: 'FREE', hours: 15, mode: 'ONLINE', urlPlaceholder: '#' },
];

// --- Engineering Opportunities (Jobs & Internships) ---
export const opportunities: Opportunity[] = [
  { id: 'OPP-001', kind: 'INTERNSHIP', employerId: 'EMP-004', title: 'Software Development Engineer (SDE) Intern', occupation: 'Software Engineer', district: 'Pune', skillTagsRequired: ['Data Structures & Algorithms', 'SQL'], skillTagsNice: ['Java/Python', 'React', 'Git'], stipendOrWageBand: '15-20k', careerGoalTags: ['Software Engineer', 'SDE', 'Computer Engineering'], openings: 20, postedAt: '2025-08-01', status: 'OPEN' },
  { id: 'OPP-002', kind: 'JOB', employerId: 'EMP-001', title: 'Graduate Engineer Trainee (GET) - Mechanical', occupation: 'Mechanical Engineer', district: 'Pune', skillTagsRequired: ['SolidWorks', 'GD&T'], skillTagsNice: ['AutoCAD', 'Industrial Safety'], stipendOrWageBand: '20-30k', careerGoalTags: ['Mechanical Engineer', 'Design Engineer'], openings: 12, postedAt: '2025-09-01', status: 'OPEN' },
  { id: 'OPP-003', kind: 'JOB', employerId: 'EMP-003', title: 'Junior Site Engineer (Metro Infra)', occupation: 'Civil Engineer', district: 'Mumbai Suburban', skillTagsRequired: ['AutoCAD Civil', 'Site Quantity Surveying'], skillTagsNice: ['Industrial Safety'], stipendOrWageBand: '20-30k', careerGoalTags: ['Civil Engineer', 'Site Engineer'], openings: 8, postedAt: '2025-10-15', status: 'OPEN' },
  { id: 'OPP-004', kind: 'INTERNSHIP', employerId: 'EMP-008', title: 'Embedded Firmware & IoT Intern', occupation: 'Embedded Engineer', district: 'Nashik', skillTagsRequired: ['Embedded C', 'PLC'], skillTagsNice: ['MATLAB', 'IoT Protocols'], stipendOrWageBand: '10-15k', careerGoalTags: ['Embedded Engineer', 'Electronics & Telecom'], openings: 6, postedAt: '2025-11-01', status: 'OPEN' },
  { id: 'OPP-005', kind: 'JOB', employerId: 'EMP-007', title: 'Associate Systems Engineer (Accessible IT Support)', occupation: 'Systems Engineer', district: 'Pune', skillTagsRequired: ['SQL', 'Git'], skillTagsNice: ['Python', 'Spoken English'], stipendOrWageBand: '20-30k', careerGoalTags: ['Software Engineer', 'IT Support', 'Systems Engineer'], openings: 15, postedAt: '2025-12-01', status: 'OPEN' },
  { id: 'OPP-006', kind: 'JOB', employerId: 'EMP-010', title: 'Sub-Station Electrical Engineer Trainee', occupation: 'Electrical Engineer', district: 'Nagpur', skillTagsRequired: ['Power Systems', 'Switchgear & Protection'], skillTagsNice: ['PLC', 'Industrial Safety'], stipendOrWageBand: '20-30k', careerGoalTags: ['Electrical Engineer'], openings: 5, postedAt: '2026-01-10', status: 'OPEN' },
];

export const skillPassports: SkillPassport[] = [];
export const assessments: SkillAssessment[] = [];
export const roadmaps: LearningRoadmap[] = [];
export const applications: Application[] = [];
export const employerFeedback: EmployerFeedback[] = [];
export const salaryLogs: SalaryProgression[] = [];

// Generate Skill Passports for all students
for (const trainee of trainees) {
  const enrs = enrolments.filter(e => e.traineeId === trainee.id);
  const mySkills: { tag: string, source: 'SELF'|'TRAINING'|'ASSESSMENT'|'EMPLOYER'|'CERTIFICATE', proficiency: number, verified: boolean }[] = [];
  const certs: { enrolmentId?: string, mockCertId?: string, name: string, issuedBy: string, date: string, nsqfLevel?: number }[] = [];
  
  for (const enr of enrs) {
    const course = courses.find(c => c.id === enr.courseId);
    if (course && course.skills) {
      course.skills.forEach(skill => {
        mySkills.push({ tag: skill, source: 'TRAINING', proficiency: 3, verified: true });
      });
      certs.push({ enrolmentId: enr.id, name: course.name, issuedBy: 'Directorate of Technical Education (DTE)', date: enr.certifiedAt, nsqfLevel: course.nsqfLevel });
    }
  }

  // Derive jobs/internships from OutcomeEvents
  const outs = outcomeEvents.filter(o => o.traineeId === trainee.id && (o.type === 'PLACED' || o.type === 'APPRENTICE'));
  const myJobs = outs.map((o, idx) => ({
    id: `JOB-${trainee.id}-${idx}`,
    org: o.employerId ? employers.find(e => e.id === o.employerId)?.name || 'Engineering Firm' : 'Self-Employed',
    role: o.occupation || 'Graduate Engineer Trainee',
    location: o.jobLocation || trainee.district,
    start: o.occurredAt,
    wageBand: o.wageBand,
    verified: o.confidence === 'EMPLOYER_CONFIRMED' || o.confidence === 'DOCUMENT_BACKED'
  }));

  const isDiplomaStudent = enrs[0]?.trade.startsWith('Diploma');
  const mockCgpa = (7.2 + (parseInt(trainee.id.slice(-2)) % 25) * 0.1).toFixed(2);

  skillPassports.push({
    id: trainee.passportId || `PPT-${trainee.id}`,
    traineeId: trainee.id,
    apaarId: trainee.apaarId || '0000-0000-0000',
    status: 'ACTIVE',
    educationHistory: isDiplomaStudent ? [
      { level: '10th', institution: 'Maharashtra State Board', boardOrUniversity: 'Pune Board', year: '2022', result: '84.2%' },
      { level: 'Diploma', institution: 'Solapur Polytechnic', boardOrUniversity: 'MSBTE', year: '2025', stream: enrs[0]?.trade, result: `${mockCgpa} CGPA` }
    ] : [
      { level: '10th', institution: 'Maharashtra State Board', boardOrUniversity: 'Pune Board', year: '2020', result: '88.5%' },
      { level: '12th', institution: 'Maharashtra Higher Secondary Board', boardOrUniversity: 'Pune Board', year: '2022', stream: 'Science (PCM)', result: '82.6%' },
      { level: 'UG', institution: providers.find(p => p.id === enrs[0]?.providerId)?.name || 'Engineering College', boardOrUniversity: 'Savitribai Phule Pune University', year: '2026', stream: enrs[0]?.trade, result: `${mockCgpa} CGPA` }
    ],
    skills: mySkills,
    certifications: certs,
    internships: [],
    jobs: myJobs,
    careerGoal: { 
      targetOccupation: enrs[0]?.trade.includes('Computer') ? 'Software Engineer' :
                        enrs[0]?.trade.includes('Mechanical') ? 'Mechanical Engineer' :
                        enrs[0]?.trade.includes('Civil') ? 'Civil Engineer' :
                        enrs[0]?.trade.includes('Telecom') ? 'Embedded Engineer' : 'Electrical Engineer', 
      preferredDistricts: [trainee.district, 'Pune'], 
      willingToMigrate: true 
    },
    lastUpdatedAt: '2026-01-15'
  });
}

// Seed Story F: Demo CSE Student Rahul Kamble (MSOL-MH-0001)
const demoTraineeId = 'MSOL-MH-0001';
assessments.push({
  id: 'ASS-001',
  traineeId: demoTraineeId,
  takenAt: '2025-08-15',
  targetCareer: 'Software Engineer',
  responses: [
    { question: 'What is the time complexity of searching in a balanced BST?', answer: 'O(log n)', score: 100 },
    { question: 'Which clause filters rows after GROUP BY in SQL?', answer: 'WHERE clause', score: 0 },
    { question: 'What is database indexing and when does it degrade write speed?', answer: 'Not clear', score: 20 }
  ],
  scores: { 'Data Structures & Algorithms': 55, 'SQL': 30, 'Git': 70 },
  strengths: ['Git', 'Object-Oriented Programming'],
  weaknesses: ['Data Structures & Algorithms', 'SQL'],
  missingForTarget: ['Data Structures & Algorithms', 'SQL'],
  reportSummary: { 
    en: 'Solid programming syntax fundamentals, but needs structured practice in Data Structures & Algorithms and relational SQL query optimization.', 
    mr: 'प्रोग्रामिंगच्या मूलभूत संकल्पना चांगल्या आहेत, परंतु अल्गोरिदम आणि रिलेशनल SQL मध्ये तातडीने सरावाची गरज आहे.' 
  }
});

roadmaps.push({
  id: 'RDM-001',
  traineeId: demoTraineeId,
  generatedAt: '2025-08-16',
  items: [
    { courseId: 'CAT-001', reason: 'Covers missing core skill: Data Structures & Algorithms (Free NPTEL)', priority: 'HIGH', status: 'RECOMMENDED' },
    { courseId: 'CAT-002', reason: 'Covers database indexing & complex SQL queries (Persistent Tech Academy)', priority: 'HIGH', status: 'RECOMMENDED' }
  ]
});

applications.push({
  id: 'APP-001',
  traineeId: demoTraineeId,
  opportunityId: 'OPP-001',
  matchScore: 88,
  reasons: ['Preferred location Pune (Hinjewadi)', 'Computer Engineering degree alignment', 'Core Java/Python match'],
  status: 'JOINED',
  appliedAt: '2025-08-20',
  updatedAt: '2025-09-01'
});

employerFeedback.push({
  id: 'FB-001',
  employerId: 'EMP-004',
  traineeId: demoTraineeId,
  applicationId: 'APP-001',
  occurredAt: '2025-10-15',
  ratings: { technical: 3, workplaceReadiness: 5, communication: 4, safety: 4, retentionLikelihood: 4 },
  missingSkillTags: ['SQL'],
  wouldHireAgain: true,
  notes: 'High work ethic and good problem-solving, but needs mentoring in database indexing and production SQL queries.'
});

// Seed Story G: Accessible IT match for PwD student (MSOL-MH-0018)
applications.push({
  id: 'APP-002',
  traineeId: 'MSOL-MH-0018',
  opportunityId: 'OPP-005',
  matchScore: 92,
  reasons: ['Accessible workplace compliance certified', 'Computer Engineering alignment', 'High aptitude score'],
  status: 'SHORTLISTED',
  appliedAt: '2025-12-10',
  updatedAt: '2025-12-20'
});

// Seed 10 realistic salary progressions (Intern stipend -> GET bands)
for (let i = 0; i < 10; i++) {
  const t = trainees[i];
  if (t) {
    salaryLogs.push({
      traineeId: t.id,
      events: [
        { at: '2025-06-01', wageBand: '<10k', source: 'COLLEGE_TPO', roleTitle: 'Engineering Intern' },
        { at: '2025-09-01', wageBand: '15-20k', source: 'EMPLOYER', promotion: true, roleTitle: 'Junior Associate Engineer' },
        { at: '2026-01-15', wageBand: '20-30k', source: 'EMPLOYER', promotion: true, roleTitle: 'Graduate Engineer Trainee (GET)' }
      ]
    });
  }
}

// --- Learning Resources (Skill Videos) Seed ---
export const learningResources: LearningResource[] = [
  {
    id: 'RES-001',
    providerId: 'PRV-001',
    title: 'Data Structures & Algorithms — Arrays & Linked Lists (NPTEL)',
    description: 'Foundation module covering dynamic arrays, linked list traversal, insertion/deletion, and time complexity analysis. Recommended for all CSE final-year students before campus recruitment.',
    skillTags: ['Data Structures & Algorithms', 'Java/Python'],
    branch: 'Computer Engineering',
    type: 'VIDEO',
    level: 'BEGINNER',
    url: 'https://www.youtube.com/embed/RBSGKlAvoiM',
    thumbnailUrl: 'https://img.youtube.com/vi/RBSGKlAvoiM/hqdefault.jpg',
    durationMins: 42,
    uploadedAt: '2025-08-01',
    views: 312,
  },
  {
    id: 'RES-002',
    providerId: 'PRV-001',
    title: 'SQL Query Optimization & Indexing — Intermediate',
    description: 'Covers B-Tree indexes, query plan analysis, JOIN optimizations, and common anti-patterns seen in production SQL. Directly addresses the most flagged skill gap from employer feedback.',
    skillTags: ['SQL'],
    branch: 'Computer Engineering',
    type: 'VIDEO',
    level: 'INTERMEDIATE',
    url: 'https://www.youtube.com/embed/HubezKbFL7E',
    thumbnailUrl: 'https://img.youtube.com/vi/HubezKbFL7E/hqdefault.jpg',
    durationMins: 38,
    uploadedAt: '2025-08-10',
    views: 198,
  },
  {
    id: 'RES-003',
    providerId: 'PRV-002',
    title: 'SolidWorks 3D Modelling — Part Design Basics',
    description: 'Step-by-step introduction to SolidWorks sketch constraints, extrude/revolve features, and assembly design. Created for Mechanical Engineering students targeting Tata Motors & Bajaj GET roles.',
    skillTags: ['SolidWorks', 'GD&T'],
    branch: 'Mechanical Engineering',
    type: 'VIDEO',
    level: 'BEGINNER',
    url: 'https://www.youtube.com/embed/qFGSMNMHbB4',
    thumbnailUrl: 'https://img.youtube.com/vi/qFGSMNMHbB4/hqdefault.jpg',
    durationMins: 55,
    uploadedAt: '2025-08-15',
    views: 245,
  },
  {
    id: 'RES-004',
    providerId: 'PRV-002',
    title: 'GD&T Fundamentals for Mechanical Engineers',
    description: 'Geometric Dimensioning & Tolerancing: symbols, datum references, and form/position tolerances explained with industry drawing examples. Maps to Tier-1 automotive GET job requirements.',
    skillTags: ['GD&T', 'SolidWorks'],
    branch: 'Mechanical Engineering',
    type: 'VIDEO',
    level: 'INTERMEDIATE',
    url: 'https://www.youtube.com/embed/D4rXiQwMoEU',
    thumbnailUrl: 'https://img.youtube.com/vi/D4rXiQwMoEU/hqdefault.jpg',
    durationMins: 30,
    uploadedAt: '2025-08-22',
    views: 167,
  },
  {
    id: 'RES-005',
    providerId: 'PRV-003',
    title: 'Git & GitHub for Engineering Students — Zero to PR',
    description: 'Covers branching strategy, merge conflicts, pull requests, and CI/CD basics. Every engineering student should complete this before their first industry internship.',
    skillTags: ['Git'],
    branch: undefined,
    type: 'VIDEO',
    level: 'BEGINNER',
    url: 'https://www.youtube.com/embed/RGOj5yH7evk',
    thumbnailUrl: 'https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg',
    durationMins: 68,
    uploadedAt: '2025-09-01',
    views: 421,
  },
  {
    id: 'RES-006',
    providerId: 'PRV-001',
    title: 'Spoken English & Technical Communication for Interviews',
    description: 'Practical workshop on STAR method answers, technical vocabulary for engineering roles, and mock HR interview techniques. Targeted at students from rural Maharashtra backgrounds.',
    skillTags: ['Spoken English'],
    branch: undefined,
    type: 'VIDEO',
    level: 'BEGINNER',
    url: 'https://www.youtube.com/embed/1G0hVqvDXvU',
    thumbnailUrl: 'https://img.youtube.com/vi/1G0hVqvDXvU/hqdefault.jpg',
    durationMins: 45,
    uploadedAt: '2025-09-10',
    views: 534,
  },
  {
    id: 'RES-007',
    providerId: 'PRV-004',
    title: 'PLC Programming & Industrial Automation — Ladder Logic',
    description: 'Hands-on PLC ladder logic programming, timer/counter instructions, and real SCADA interface design. For Electrical Engineering students targeting L&T, Siemens, and MahaTransco GET roles.',
    skillTags: ['PLC', 'MATLAB'],
    branch: 'Electrical Engineering',
    type: 'VIDEO',
    level: 'INTERMEDIATE',
    url: 'https://www.youtube.com/embed/E2HnALNnM9c',
    thumbnailUrl: 'https://img.youtube.com/vi/E2HnALNnM9c/hqdefault.jpg',
    durationMins: 50,
    uploadedAt: '2025-09-15',
    views: 89,
  },
  {
    id: 'RES-008',
    providerId: 'PRV-001',
    title: 'Aptitude & Logical Reasoning — Campus Placement Crash Course',
    description: 'High-frequency quantitative aptitude, logical reasoning, and verbal ability problems from recent TCS, Infosys, and Persistent Systems campus drives. Covers 120+ solved problems.',
    skillTags: ['Aptitude'],
    branch: undefined,
    type: 'VIDEO',
    level: 'BEGINNER',
    url: 'https://www.youtube.com/embed/v68zYyaEmEA',
    thumbnailUrl: 'https://img.youtube.com/vi/v68zYyaEmEA/hqdefault.jpg',
    durationMins: 90,
    uploadedAt: '2025-10-01',
    views: 762,
  },
];

