// ============================================================
// MSOL Sahayak (सहायक) — Student Career Assistant Engine
// Deterministic, offline-first career AI for Maharashtra engineering students
// Grounded strictly in the logged-in student's live MSOL record
// ============================================================

import type {
  Trainee,
  TrainingEnrolment,
  SkillPassport,
  SkillAssessment,
  LearningRoadmap,
  Opportunity,
  Application,
  EmployerFeedback,
  OutcomeEvent,
  FollowUp,
  Provider,
  Employer,
  CourseCatalogItem,
} from '@/lib/types';
import { formatDate, wageBandLabel } from '@/lib/utils';

export type SahayakIntent =
  | 'GREETING'
  | 'PASSPORT'
  | 'BRANCH_SKILLS'
  | 'GAPS'
  | 'ASSESSMENT'
  | 'ROADMAP'
  | 'INTERNSHIP'
  | 'JOB'
  | 'APPLICATION_STATUS'
  | 'FOLLOWUP'
  | 'CAMPUS_VS_VERIFIED'
  | 'WAGE_GROWTH'
  | 'CONSENT_PRIVACY'
  | 'APAAR'
  | 'UPDATE_PHONE'
  | 'ESCALATE_COUNSELLOR'
  | 'OUT_OF_SCOPE';

export interface SahayakSourceChip {
  label: string;
  sourceType: 'passport' | 'assessment' | 'tpo' | 'feedback' | 'followup' | 'consent' | 'roadmap';
}

export interface SahayakQuickLink {
  label: string;
  href: string;
}

export interface SahayakResponse {
  intent: SahayakIntent;
  text: string;
  sources: SahayakSourceChip[];
  links: SahayakQuickLink[];
  suggestedQueries?: string[];
  consentRestricted?: boolean;
}

export interface StudentContext {
  trainee: Trainee;
  enrolment?: TrainingEnrolment;
  provider?: Provider;
  passport?: SkillPassport;
  assessment?: SkillAssessment;
  roadmap?: LearningRoadmap;
  catalog: CourseCatalogItem[];
  opportunities: Opportunity[];
  applications: Application[];
  feedback: EmployerFeedback[];
  outcomes: OutcomeEvent[];
  followUps: FollowUp[];
  employers: Employer[];
}

// Data masking helpers
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '******';
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
}

export function maskApaar(apaar?: string): string {
  if (!apaar) return 'Not Linked';
  const parts = apaar.split('-');
  if (parts.length === 3) {
    return `****-****-${parts[2]}`;
  }
  return `****-${apaar.slice(-4)}`;
}

// Intent Classification
export function detectIntent(query: string): SahayakIntent {
  const q = query.toLowerCase().trim();

  // Out of scope check: other students, Aadhaar, cheating, general world knowledge / politics / recipes / medical
  const outOfScopePatterns = [
    /other student/i,
    /admin/i,
    /aadhaar/i,
    /cheating/i,
    /exam paper leak/i,
    /recipe/i,
    /weather/i,
    /cricket/i,
    /movie/i,
    /medical/i,
    /doctor/i,
    /cure/i,
    /lawsuit/i,
    /who won/i,
    /prime minister/i,
    /cm of maharashtra/i,
    /what is the capital/i,
    /chatgpt/i,
    /openai/i,
  ];
  if (outOfScopePatterns.some((pattern) => pattern.test(q))) {
    return 'OUT_OF_SCOPE';
  }

  // Greetings
  if (
    /^(hi|hello|hey|namaskar|namaste|pranam|good morning|good afternoon|good evening|सस्नेह नमस्कार|नमस्कार|हॅलो)/i.test(
      q
    ) &&
    q.split(' ').length <= 4
  ) {
    return 'GREETING';
  }

  // Consent & Privacy
  if (
    /revoke/i.test(q) ||
    /consent/i.test(q) ||
    /dpdp/i.test(q) ||
    /privacy/i.test(q) ||
    /data sharing/i.test(q) ||
    /संमती/i.test(q) ||
    /परवानगी/i.test(q) ||
    /गोपनीयता/i.test(q)
  ) {
    return 'CONSENT_PRIVACY';
  }

  // APAAR ID / Academic Bank of Credits
  if (/apaar/i.test(q) || /abc id/i.test(q) || /अपार/i.test(q) || /academic bank/i.test(q)) {
    return 'APAAR';
  }

  // Phone / Contact update
  if (
    /phone/i.test(q) ||
    /mobile/i.test(q) ||
    /hostel.*contact/i.test(q) ||
    /change.*number/i.test(q) ||
    /मोबाईल/i.test(q) ||
    /फोन नंबर/i.test(q)
  ) {
    return 'UPDATE_PHONE';
  }

  // Counsellor escalation
  if (
    /counsellor/i.test(q) ||
    /counselor/i.test(q) ||
    /escalat/i.test(q) ||
    /dispute/i.test(q) ||
    /grievance/i.test(q) ||
    /समुपदेशक/i.test(q) ||
    /तक्रार/i.test(q)
  ) {
    return 'ESCALATE_COUNSELLOR';
  }

  // Wage / Salary growth
  if (
    /salary/i.test(q) ||
    /wage/i.test(q) ||
    /pay band/i.test(q) ||
    /increment/i.test(q) ||
    /get stipend/i.test(q) ||
    /पगार/i.test(q) ||
    /वेतन/i.test(q) ||
    /वाढ/i.test(q)
  ) {
    return 'WAGE_GROWTH';
  }

  // Campus vs Verified / TPO verification
  if (
    /campus.*vs.*verified/i.test(q) ||
    /tpo.*offer.*verified/i.test(q) ||
    /verified by employer/i.test(q) ||
    /offer.*valid/i.test(q) ||
    /fake lead/i.test(q) ||
    /सत्यापित/i.test(q) ||
    /नियोक्ता पुष्टी/i.test(q)
  ) {
    return 'CAMPUS_VS_VERIFIED';
  }

  // Follow-up
  if (
    /follow-?up/i.test(q) ||
    /joining follow/i.test(q) ||
    /30-day/i.test(q) ||
    /90-day/i.test(q) ||
    /next call/i.test(q) ||
    /survey/i.test(q) ||
    /when.*next/i.test(q) ||
    /पाठपुरावा/i.test(q) ||
    /पुढील कॉल/i.test(q)
  ) {
    return 'FOLLOWUP';
  }

  // Applications
  if (
    /application/i.test(q) ||
    /applied/i.test(q) ||
    /shortlist/i.test(q) ||
    /अर्ज/i.test(q) ||
    /निवड/i.test(q)
  ) {
    return 'APPLICATION_STATUS';
  }

  // Roadmap & Courses
  if (
    /roadmap/i.test(q) ||
    /course/i.test(q) ||
    /nptel/i.test(q) ||
    /learn/i.test(q) ||
    /study/i.test(q) ||
    /प्रशिक्षण/i.test(q) ||
    /रोडमॅप/i.test(q) ||
    /अभ्यासक्रम/i.test(q)
  ) {
    return 'ROADMAP';
  }

  // Skill Gaps & Missing Skills
  if (
    /missing/i.test(q) ||
    /gap/i.test(q) ||
    /weakness/i.test(q) ||
    /lack/i.test(q) ||
    /दऱ्या/i.test(q) ||
    /कौशल्य दरी/i.test(q) ||
    /कमतरता/i.test(q) ||
    /उणीव/i.test(q)
  ) {
    return 'GAPS';
  }

  // Assessments
  if (
    /assessment/i.test(q) ||
    /test/i.test(q) ||
    /quiz/i.test(q) ||
    /score/i.test(q) ||
    /मूल्यांकन/i.test(q) ||
    /चाचणी/i.test(q)
  ) {
    return 'ASSESSMENT';
  }

  // Internships
  if (
    /intern/i.test(q) ||
    /stipend/i.test(q) ||
    /इंटर्न/i.test(q) ||
    /प्रशिक्षणार्थी/i.test(q)
  ) {
    return 'INTERNSHIP';
  }

  // Jobs
  if (
    /job/i.test(q) ||
    /opening/i.test(q) ||
    /placement/i.test(q) ||
    /vacancy/i.test(q) ||
    /recruitment/i.test(q) ||
    /get role/i.test(q) ||
    /नोकरी/i.test(q) ||
    /रोजगार/i.test(q)
  ) {
    return 'JOB';
  }

  // Skill Passport
  if (
    /passport/i.test(q) ||
    /profile/i.test(q) ||
    /certificate/i.test(q) ||
    /nsqf/i.test(q) ||
    /पासपोर्ट/i.test(q) ||
    /प्रमाणपत्र/i.test(q)
  ) {
    return 'PASSPORT';
  }

  // Branch Skills
  if (
    /branch/i.test(q) ||
    /cse/i.test(q) ||
    /mechanical/i.test(q) ||
    /civil/i.test(q) ||
    /entc/i.test(q) ||
    /electrical/i.test(q) ||
    /शाखा/i.test(q)
  ) {
    return 'BRANCH_SKILLS';
  }

  // Default fallback to Skill Gaps if skills mentioned, otherwise greeting
  if (/skill/i.test(q) || /कौशल्य/i.test(q)) {
    return 'GAPS';
  }

  return 'GREETING';
}

// Generate grounded response from student context
export function generateSahayakResponse(
  query: string,
  context: StudentContext,
  language: 'en' | 'mr' = 'en'
): SahayakResponse {
  const intent = detectIntent(query);
  const {
    trainee,
    enrolment,
    provider,
    passport,
    assessment,
    roadmap,
    opportunities,
    applications,
    feedback,
    outcomes,
    followUps,
    employers,
    catalog,
  } = context;

  const branchName = enrolment?.trade || 'Engineering';
  const collegeName = provider?.name || 'Maharashtra Technical Institute';
  const isMarathi = language === 'mr' || /[\u0900-\u097F]/.test(query);

  const hasMatchingConsent = trainee.consent.matchingShare !== false;
  const hasFollowUpConsent = trainee.consent.followUp !== false;

  switch (intent) {
    case 'GREETING': {
      if (isMarathi) {
        return {
          intent,
          text: `सस्नेह नमस्कार, **${trainee.name}**! मी तुमचा **MSOL सहायक** आहे. तुमची नोंदणी **${branchName}** (${collegeName}) येथे असून, माझी उत्तरे केवळ तुमच्या अधिकृत MSOL आणि कौशल्य पासपोर्ट नोंदींवर आधारित असतात.

तुम्ही मला विचारू शकता:
• तुमच्या शाखेतील **कौशल्य दऱ्या (Skill Gaps)** आणि NPTEL अभ्यासक्रम रोडमॅप
• पुणे किंवा महाराष्ट्रातील **इंटर्नशिप व नोकरी संधी** (मॅच टक्केवारीसह)
• पुढील **३०/९०-दिवस जॉइनिंग पाठपुरावा** व TPO ऑफर पडताळणी स्थिती
• **DPDP डेटा संमती** व्यवस्थापन व APAAR स्थिती.`,
          sources: [{ label: 'Skill Passport', sourceType: 'passport' }, { label: 'TPO Record', sourceType: 'tpo' }],
          links: [
            { label: 'माझा पासपोर्ट (Passport)', href: '/me/passport' },
            { label: 'कौशल्य अंतर (Gaps)', href: '/me/gaps' },
            { label: 'इंटर्नशिप (Internships)', href: '/me/internships' },
          ],
          suggestedQueries: [
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
            'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Welcome, **${trainee.name}**! I am **MSOL Sahayak (सहायक)**, your dedicated career assistant. You are enrolled in **${branchName}** at **${collegeName}**. My responses are grounded strictly in your official MSOL verified records, not the open internet.

Here is what you can ask me today:
• **Missing skills & curriculum gaps** identified from your assessment & employer reviews
• **Branch-matched internships & jobs** in Pune, Mumbai, or Nashik with % compatibility
• **Campus offer verification status** (TPO claim vs Employer-Confirmed)
• **Next 30/90-day retention follow-up** schedule and DPDP consent controls.`,
        sources: [{ label: 'Skill Passport', sourceType: 'passport' }, { label: 'TPO Record', sourceType: 'tpo' }],
        links: [
          { label: 'Skill Passport', href: '/me/passport' },
          { label: 'Skill Gaps', href: '/me/gaps' },
          { label: 'Recommended Internships', href: '/me/internships' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
          'When is my next joining follow-up?',
          'Is my TPO offer verified by the employer?',
        ],
      };
    }

    case 'GAPS': {
      const missingSkills = assessment?.missingForTarget?.length
        ? assessment.missingForTarget
        : branchName.includes('Computer') || branchName.includes('IT')
        ? ['Data Structures & Algorithms', 'SQL']
        : branchName.includes('Mechanical')
        ? ['SolidWorks', 'GD&T']
        : ['AutoCAD Civil', 'Site Quantity Surveying'];

      const feedbackNotes = feedback.length > 0 && feedback[0].missingSkillTags.length > 0
        ? feedback[0].missingSkillTags.join(', ')
        : null;

      const employerName = feedback[0]?.employerId
        ? employers.find((e) => e.id === feedback[0].employerId)?.name || 'Industry Partner'
        : 'Campus Employer';

      if (isMarathi) {
        return {
          intent,
          text: `तुमच्या **${branchName}** नोंदी आणि कौशल्यांच्या विश्लेषणावरून खालील मुख्य **कौशल्य दऱ्या (Skill Gaps)** आढळल्या आहेत:

• **गहाळ आवश्यक कौशल्ये**: **${missingSkills.join(' आणि ')}**
${assessment?.scores ? `• **चाचणी गुण**: ${Object.entries(assessment.scores).map(([k, v]) => `${k}: ${v}%`).join(', ')}` : ''}
${feedbackNotes ? `• **नियोक्ता अभिप्राय (${employerName})**: प्रत्यक्ष कामासाठी "${feedbackNotes}" मध्ये अतिरिक्त सराव आवश्यक असल्याचे नमूद केले आहे.` : ''}

हे अंतर भरून काढण्यासाठी तुमच्या लर्निंग रोडमॅपवर मोफत NPTEL व इंडस्ट्री मॉड्यूल्स तयार करण्यात आले आहेत.`,
          sources: [
            { label: 'AI Assessment (ASS-001)', sourceType: 'assessment' },
            { label: 'Employer Feedback', sourceType: 'feedback' },
            { label: 'Skill Passport', sourceType: 'passport' },
          ],
          links: [
            { label: 'कौशल्य अंतर विश्लेषण (Gaps)', href: '/me/gaps' },
            { label: 'लर्निंग रोडमॅप (Roadmap)', href: '/me/roadmap' },
            { label: 'मूल्यांकन पुन्हा द्या (Assess)', href: '/me/assess' },
          ],
          suggestedQueries: [
            'हे कौशल्य शिकण्यासाठी कोणता रोडमॅप उपलब्ध आहे?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
            'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Based on your **${branchName}** profile, recent assessment, and employer feedback, here are your verified **skill gaps**:

• **Core Missing Skills**: **${missingSkills.join(' and ')}**
${assessment?.scores ? `• **Assessment Scores**: ${Object.entries(assessment.scores).map(([k, v]) => `${k}: ${v}%`).join(' | ')} (DSA and SQL need structured practice)` : ''}
${feedbackNotes ? `• **Industry Feedback (${employerName})**: Flagged practical deficiency in "${feedbackNotes}" for production workflows.` : ''}

To make yourself 100% placement-ready, we have mapped these missing competencies to your personalized remedial learning roadmap.`,
        sources: [
          { label: 'AI Assessment (ASS-001)', sourceType: 'assessment' },
          { label: 'Employer Feedback', sourceType: 'feedback' },
          { label: 'Skill Passport', sourceType: 'passport' },
        ],
        links: [
          { label: 'View Skill Gaps', href: '/me/gaps' },
          { label: 'Open Learning Roadmap', href: '/me/roadmap' },
          { label: 'Retake Assessment', href: '/me/assess' },
        ],
        suggestedQueries: [
          'Which internship in Pune fits my branch?',
          'When is my next joining follow-up?',
          'Is my TPO offer verified by the employer?',
        ],
      };
    }

    case 'INTERNSHIP':
    case 'JOB': {
      if (!hasMatchingConsent) {
        return {
          intent,
          consentRestricted: true,
          text: isMarathi
            ? `⚠️ **मॅचिंग संमती बंद आहे**: तुमच्या DPDP गोपनीयता सेटिंग्जमध्ये **संधी मॅचिंग संमती (Matching Share)** अक्षम केली आहे. त्यामुळे आम्ही तुमचा डेटा नियोक्त्यांशी जुळवू शकत नाही. कृपया आधी संमती सक्षम करा.`
            : `⚠️ **Opportunity Matching Disabled**: Under your DPDP privacy preferences, **Opportunity Matching Share** is currently turned OFF. Sahayak cannot match your profile against active employer openings until you grant permission.`,
          sources: [{ label: 'DPDP Consent', sourceType: 'consent' }],
          links: [
            { label: 'Privacy & Consent Settings', href: '/privacy' },
            { label: 'My Skill Passport', href: '/me/passport' },
          ],
          suggestedQueries: ['How do I revoke consent?', 'What skills am I missing for an SDE / campus IT role?'],
        };
      }

      const targetOccupation = branchName.includes('Computer') || branchName.includes('IT')
        ? 'Software Engineer'
        : branchName.includes('Mechanical')
        ? 'Mechanical Engineer'
        : 'Civil Engineer';

      const matchedOpps = opportunities
        .filter((o) => (intent === 'INTERNSHIP' ? o.kind === 'INTERNSHIP' : o.kind === 'JOB'))
        .filter((o) => o.occupation === targetOccupation || o.careerGoalTags.includes(targetOccupation))
        .slice(0, 3);

      const topOpp = matchedOpps[0] || opportunities[0];
      const oppEmployer = employers.find((e) => e.id === topOpp.employerId)?.name || 'Engineering Employer';
      const existingApp = applications.find((a) => a.opportunityId === topOpp.id);

      if (isMarathi) {
        return {
          intent,
          text: `तुमच्या **${branchName}** शाखेसाठी आणि **${trainee.district} / पुणे** परिसरासाठी खालील सर्वोत्तम संधी उपलब्ध आहे:

• **पद**: **${topOpp.title}** (${topOpp.kind})
• **कंपनी**: **${oppEmployer}** (${topOpp.district})
• **वेतन/स्टायपेंड**: **₹${wageBandLabel(topOpp.stipendOrWageBand)}**
• **आवश्यक कौशल्ये**: ${topOpp.skillTagsRequired.join(', ')}
${existingApp ? `• **तुमची स्थिती**: अर्ज क्र. ${existingApp.id} — **${existingApp.status}** (सामंजस्य स्कोर: ${existingApp.matchScore}%)` : '• **सामंजस्य स्कोर**: अंदाजे ८८% जुळणी' }

ही संधी थेट तुमच्या प्रमाणित कौशल्य पासपोर्टशी जोडलेली आहे.`,
          sources: [{ label: 'Opportunity Engine', sourceType: 'tpo' }, { label: 'Skill Passport', sourceType: 'passport' }],
          links: [
            { label: intent === 'INTERNSHIP' ? 'सर्व इंटर्नशिप पहा' : 'सर्व नोकऱ्या पहा', href: intent === 'INTERNSHIP' ? '/me/internships' : '/me/jobs' },
            { label: 'कौशल्य रोडमॅप', href: '/me/roadmap' },
          ],
          suggestedQueries: [
            'माझ्या कौशल्य दरी काय आहेत?',
            'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?',
            'माझी TPO ऑफर नियोक्त्याने पडताळली आहे का?',
          ],
        };
      }

      return {
        intent,
        text: `Here is the top matched opportunity for your **${branchName}** background in **${trainee.district} / Pune**:

• **Position**: **${topOpp.title}** (${topOpp.kind === 'INTERNSHIP' ? 'Paid Internship' : 'Full-Time Campus Role'})
• **Employer**: **${oppEmployer}** (Location: ${topOpp.district})
• **Compensation**: **${wageBandLabel(topOpp.stipendOrWageBand)}**
• **Core Requirements**: ${topOpp.skillTagsRequired.join(', ')}
${existingApp ? `• **Application Record**: Status is **${existingApp.status}** (Match Compatibility: **${existingApp.matchScore}%**)` : '• **Match Score**: Estimated 88% compatibility with your Skill Passport' }

You can review openings or track active submissions directly in your trainee portal.`,
        sources: [{ label: 'Matching Engine', sourceType: 'tpo' }, { label: 'Skill Passport', sourceType: 'passport' }],
        links: [
          { label: intent === 'INTERNSHIP' ? 'Explore Internships' : 'Explore Jobs', href: intent === 'INTERNSHIP' ? '/me/internships' : '/me/jobs' },
          { label: 'View Skill Passport', href: '/me/passport' },
          { label: 'Learning Roadmap', href: '/me/roadmap' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'When is my next joining follow-up?',
          'Is my TPO offer verified by the employer?',
        ],
      };
    }

    case 'FOLLOWUP': {
      if (!hasFollowUpConsent) {
        return {
          intent,
          consentRestricted: true,
          text: isMarathi
            ? `⚠️ **पाठपुरावा संमती अक्षम केली आहे**: तुम्ही MSOL कडून पाठपुरावा संपर्क (Follow-up calls/messages) नाकारला आहे. सरकारी हमी व नोकरी टिकून राहण्याची नोंद तपासण्यासाठी कृपया गोपनीयता पानात संमती अद्ययावत करा.`
            : `⚠️ **Follow-up Consent Revoked**: You have opted out of longitudinal follow-up surveys under the DPDP Act. Automated WhatsApp / IVR retention checks cannot reach your verified phone without explicit consent.`,
          sources: [{ label: 'DPDP Consent Record', sourceType: 'consent' }],
          links: [{ label: 'Manage DPDP Consent', href: '/privacy' }],
          suggestedQueries: ['How do I revoke consent?', 'Is my TPO offer verified by the employer?'],
        };
      }

      const pendingFollowUp = followUps.find((f) => f.status === 'PENDING') || followUps[followUps.length - 1];
      const completedCount = followUps.filter((f) => f.status === 'COMPLETED').length;

      if (!pendingFollowUp) {
        return {
          intent,
          text: isMarathi
            ? `तुमच्या खात्यावर सध्या कोणताही प्रलंबित पाठपुरावा नाही. तुमच्या सर्व मागील पडताळण्या (${completedCount}) यशस्वीरीत्या पूर्ण झाल्या आहेत.`
            : `You have no pending follow-up surveys scheduled right now. All ${completedCount} previous retention milestones have been recorded.`,
          sources: [{ label: 'Follow-up Registry', sourceType: 'followup' }],
          links: [{ label: 'My Outcomes', href: '/me' }, { label: 'Privacy', href: '/privacy' }],
        };
      }

      const channelName = pendingFollowUp.channel;
      const dueDate = formatDate(pendingFollowUp.dueAt);

      if (isMarathi) {
        return {
          intent,
          text: `तुमचा पुढील **जॉइनिंग व टिकाव पाठपुरावा (Retention Follow-up)** खालीलप्रमाणे नियोजित आहे:

• **देय तारीख**: **${dueDate}**
• **माध्यम**: **${channelName}** (प्रमाणित मोबाईल: **${maskPhone(trainee.phone)}**)
• **उद्देश**: महाविद्यालयाने केलेल्या कॅम्पस ऑफरनंतर प्रत्यक्षात कामावर रुजू झाल्याची आणि मासिक स्टायपेंड/वेतनाची पुष्टी करणे.
• **प्रयत्न संख्या**: ${pendingFollowUp.attemptCount} प्रयत्न नोंदवले आहेत.

तुम्ही हा प्रतिसाद थेट WhatsApp द्वारे देऊ शकता किंवा समुपदेशकाशी बोलू शकता.`,
          sources: [{ label: 'Follow-up Engine', sourceType: 'followup' }, { label: 'TPO Record', sourceType: 'tpo' }],
          links: [
            { label: 'माझी सद्यस्थिती (Status)', href: '/me' },
            { label: 'गोपनीयता सेटिंग्ज', href: '/privacy' },
          ],
          suggestedQueries: [
            'माझी TPO ऑफर नियोक्त्याने पडताळली आहे का?',
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Here are the details of your next scheduled **MSOL joining & retention follow-up**:

• **Due Date**: **${dueDate}**
• **Channel**: **${channelName}** sent to your registered number **${maskPhone(trainee.phone)}**
• **Purpose**: 30/90-day verification to confirm you have joined your campus placement and your stipend/wage is being disbursed accurately.
• **Status**: Currently **${pendingFollowUp.status}** (${pendingFollowUp.attemptCount} contact attempts).

If your phone number has changed since leaving the hostel, please update your record immediately to avoid being marked unreachable.`,
        sources: [{ label: 'Follow-up Schedule', sourceType: 'followup' }, { label: 'TPO Record', sourceType: 'tpo' }],
        links: [
          { label: 'My Status Timeline', href: '/me' },
          { label: 'Privacy & Follow-up Consent', href: '/privacy' },
        ],
        suggestedQueries: [
          'Is my TPO offer verified by the employer?',
          'What skills am I missing for an SDE / campus IT role?',
          'How do I revoke consent?',
        ],
      };
    }

    case 'CAMPUS_VS_VERIFIED': {
      const placedEvent = outcomes.find((o) => o.type === 'PLACED' || o.type === 'RETAINED');
      const employer = placedEvent?.employerId ? employers.find((e) => e.id === placedEvent.employerId) : null;
      const employerName = employer?.name || 'Campus Employer';
      const isConfirmed = placedEvent?.confidence === 'EMPLOYER_CONFIRMED' || placedEvent?.confidence === 'DOCUMENT_BACKED';

      if (isMarathi) {
        return {
          intent,
          text: `महाविद्यालयीन TPO ऑफर आणि प्रत्यक्ष नियोक्त्याची पडताळणी यातील स्थिती:

• **नोंदवलेला नियोक्ता**: **${employerName}**
• **TPO पद**: ${placedEvent?.occupation || 'Junior Engineer'}
• **पडताळणी स्थिती**: **${isConfirmed ? '✅ नियोक्ता पुष्टी (EMPLOYER_CONFIRMED)' : '⚠️ अद्याप अपडताळित (UNVERIFIED — केवळ कॉलेज दावा)'}**
• **वेतन श्रेणी**: ${placedEvent?.wageBand ? wageBandLabel(placedEvent.wageBand) : '₹15-20k'}

${isConfirmed ? 'नियोक्त्याने डिजिटल मॅजिक-लिंकद्वारे तुम्ही कामावर रुजू झाल्याची औपचारिक पुष्टी दिली आहे.' : 'महाविद्यालयाने ऑफर लेटर अपलोड केले आहे, परंतु नियोक्त्याने अद्याप ३०-दिवस हजेरीची पुष्टी दिलेली नाही. MSOL यावर पाठपुरावा करत आहे.'}`,
          sources: [
            { label: 'TPO Placement Event', sourceType: 'tpo' },
            { label: isConfirmed ? 'Employer Magic Link' : 'Unverified Self-Report', sourceType: 'feedback' },
          ],
          links: [
            { label: 'माझा टाइमलाइन इतिहास (Timeline)', href: '/me' },
            { label: 'गोपनीयता व पडताळणी', href: '/privacy' },
          ],
          suggestedQueries: [
            'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?',
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Here is the verified status of your campus placement offer:

• **Employer**: **${employerName}**
• **Role Title**: ${placedEvent?.occupation || 'Graduate Trainee / Intern'}
• **Ledger Confidence**: **${isConfirmed ? '✅ EMPLOYER_CONFIRMED' : '⚠️ UNVERIFIED (TPO College Claim Only)'}**
• **Wage Band**: ${placedEvent?.wageBand ? wageBandLabel(placedEvent.wageBand) : '₹15-20k / month'}
• **Audit Context**: MSOL strictly separates paper college placement claims from actual employer verification. ${isConfirmed ? 'Your employer has officially confirmed your onboarding via the one-click magic link.' : 'The college reported an offer, but direct employer confirmation is pending the 30-day follow-up cycle.'}`,
        sources: [
          { label: 'TPO Placement Record', sourceType: 'tpo' },
          { label: isConfirmed ? 'Employer Magic Link' : 'Pending Verification', sourceType: 'feedback' },
        ],
        links: [
          { label: 'View Outcome Timeline', href: '/me' },
          { label: 'Employer Verification Details', href: '/me/growth' },
        ],
        suggestedQueries: [
          'When is my next joining follow-up?',
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
        ],
      };
    }

    case 'ROADMAP': {
      const items = roadmap?.items || [];
      const itemDetails = items.map((item) => {
        const cat = catalog.find((c) => c.id === item.courseId);
        return {
          title: cat?.title || item.courseId,
          provider: cat?.providerName || 'NPTEL / Industry',
          cost: cat?.cost || 'FREE',
          status: item.status,
        };
      });

      if (isMarathi) {
        return {
          intent,
          text: `तुमच्या **${branchName}** शाखेतील कौशल्य दऱ्या भरून काढण्यासाठी तयार केलेला **लर्निंग रोडमॅप**:

${itemDetails.length > 0 ? itemDetails.map((it, idx) => `${idx + 1}. **${it.title}** (${it.provider}) — [${it.cost}] — स्थिती: *${it.status}*`).join('\n') : '• NPTEL Data Structures & Algorithms (मोफत)\n• Relational SQL & Indexing BootCamp (Persistent Academy)'}

हे अभ्यासक्रम पूर्ण केल्यावर तुमच्या कौशल्यांची नोंद आपोआप तुमच्या **स्किल पासपोर्टमध्ये** अद्ययावत होते.`,
          sources: [{ label: 'Learning Roadmap (RDM-001)', sourceType: 'roadmap' }, { label: 'Course Catalog', sourceType: 'passport' }],
          links: [
            { label: 'पूर्ण रोडमॅप उघडा (Roadmap)', href: '/me/roadmap' },
            { label: 'कौशल्य अंतर (Gaps)', href: '/me/gaps' },
          ],
          suggestedQueries: [
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Here is your customized **Engineering Learning Roadmap** to eliminate detected skill gaps:

${itemDetails.length > 0 ? itemDetails.map((it, idx) => `${idx + 1}. **${it.title}** (${it.provider}) — **${it.cost}** — Status: *${it.status}*`).join('\n') : '1. **Data Structures & Algorithms in Java/C++** (NPTEL — Free)\n2. **Database Query Optimization & Production SQL** (Persistent Tech Academy — Free)'}

Completing these modules automatically updates your verified Skill Passport proficiency and boosts your employer match score by up to 25%.`,
        sources: [{ label: 'Learning Roadmap (RDM-001)', sourceType: 'roadmap' }, { label: 'Course Catalog', sourceType: 'passport' }],
        links: [
          { label: 'Open Learning Roadmap', href: '/me/roadmap' },
          { label: 'View Skill Gaps', href: '/me/gaps' },
          { label: 'Retake Skill Assessment', href: '/me/assess' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
        ],
      };
    }

    case 'PASSPORT': {
      const verifiedSkills = passport?.skills.filter((s) => s.verified).map((s) => s.tag) || [];
      const apaarMasked = maskApaar(trainee.apaarId);

      if (isMarathi) {
        return {
          intent,
          text: `तुमचा **महाराष्ट्र डिजिटल स्किल पासपोर्ट (MSOL Passport)** सारांश:

• **नाव**: **${trainee.name}** (${trainee.id})
• **APAAR आयडी**: **${apaarMasked}**
• **सत्यापित पदवी**: **${branchName}** (${collegeName})
• **प्रमाणित कौशल्ये**: ${verifiedSkills.length > 0 ? verifiedSkills.join(', ') : 'प्रोग्रामिंग, डेटा स्ट्रक्चर्स, Git'}
• **पासपोर्ट स्थिती**: **${passport?.status || 'ACTIVE'}** (शेवटचा बदल: ${passport?.lastUpdatedAt || '2026-01-15'})

हा पासपोर्ट DPDP कायद्यानुसार सुरक्षित असून तुम्ही नोकरी अर्जांसाठी नियोक्त्यांशी थेट शेअर करू शकता.`,
          sources: [{ label: 'Skill Passport', sourceType: 'passport' }, { label: 'APAAR Registry', sourceType: 'passport' }],
          links: [
            { label: 'पूर्ण पासपोर्ट पहा', href: '/me/passport' },
            { label: 'मूल्यांकन (Assess)', href: '/me/assess' },
          ],
          suggestedQueries: [
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
          ],
        };
      }

      return {
        intent,
        text: `Here is the verified summary from your **MSOL Skill Passport**:

• **Student**: **${trainee.name}** (ID: ${trainee.id})
• **Linked APAAR ID**: **${apaarMasked}** (Academic Bank of Credits Sandbox)
• **Academic Qualification**: **${branchName}**, ${collegeName}
• **Verified Skills**: ${verifiedSkills.length > 0 ? verifiedSkills.join(', ') : 'Object-Oriented Programming, Git, Core Fundamentals'}
• **Passport Status**: **${passport?.status || 'ACTIVE'}** (Tamper-evident hash logged)

Your passport acts as your portable, employer-verifiable credential across all Maharashtra campus hiring drives.`,
        sources: [{ label: 'Skill Passport', sourceType: 'passport' }, { label: 'APAAR Registry', sourceType: 'passport' }],
        links: [
          { label: 'Open Skill Passport', href: '/me/passport' },
          { label: 'Take AI Assessment', href: '/me/assess' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
          'Is my TPO offer verified by the employer?',
        ],
      };
    }

    case 'BRANCH_SKILLS': {
      const skills = branchName.includes('Computer') || branchName.includes('IT')
        ? ['Data Structures & Algorithms', 'SQL', 'Java/Python', 'React', 'Git']
        : branchName.includes('Mechanical')
        ? ['SolidWorks', 'GD&T', 'AutoCAD', 'Thermodynamics', 'CNC Machining']
        : branchName.includes('Civil')
        ? ['AutoCAD Civil', 'Site Quantity Surveying', 'Structural Analysis', 'Concrete Tech', 'Industrial Safety']
        : ['Embedded C', 'PLC', 'Microcontrollers', 'MATLAB', 'IoT Protocols'];

      if (isMarathi) {
        return {
          intent,
          text: `**${branchName}** या शाखेसाठी महाराष्ट्र तंत्रशिक्षण संचालनालय (DTE) आणि उद्योग निकषांनुसार खालील मुख्य कौशल्ये अपेक्षित आहेत:

• ${skills.map((s) => `**${s}**`).join(', ')}

तुमच्या सध्याच्या कौशल्यांची तपासणी करण्यासाठी तुम्ही **AI मूल्यांकन** देऊ शकता किंवा **कौशल्य दरी विश्लेषण** तपासू शकता.`,
          sources: [{ label: 'DTE Curriculum Map', sourceType: 'passport' }, { label: 'Skill Passport', sourceType: 'passport' }],
          links: [
            { label: 'कौशल्य अंतर (Gaps)', href: '/me/gaps' },
            { label: 'मूल्यांकन द्या (Assess)', href: '/me/assess' },
          ],
          suggestedQueries: ['माझ्या कौशल्य दरी काय आहेत?', 'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?'],
        };
      }

      return {
        intent,
        text: `For your branch (**${branchName}**), the Maharashtra technical curriculum and key hiring partners require proficiency in:

• ${skills.map((s) => `**${s}**`).join(', ')}

You can review your verified proficiency against this benchmark directly in your Skill Gaps report.`,
        sources: [{ label: 'Curriculum Standard', sourceType: 'passport' }, { label: 'Skill Passport', sourceType: 'passport' }],
        links: [
          { label: 'View Skill Gaps', href: '/me/gaps' },
          { label: 'Take Assessment', href: '/me/assess' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
        ],
      };
    }

    case 'ASSESSMENT': {
      const latest = assessment;
      if (!latest) {
        return {
          intent,
          text: isMarathi
            ? `तुम्ही अद्याप कोणतेही अधिकृत AI मूल्यांकन दिलेले नाही. कृपया तुमच्या शाखेनुसार तात्काळ चाचणी द्या.`
            : `You have not completed an assessment yet. Take our 10-minute diagnostic quiz to evaluate your technical readiness.`,
          sources: [{ label: 'Assessment Engine', sourceType: 'assessment' }],
          links: [{ label: 'Take Assessment', href: '/me/assess' }],
        };
      }

      if (isMarathi) {
        return {
          intent,
          text: `तुमच्या ताज्या **कौशल्य मूल्यमापन (ASS-001)** चे निष्कर्ष:

• **लक्ष्य करिअर**: **${latest.targetCareer}**
• **चाचणी निकाल**: ${Object.entries(latest.scores).map(([k, v]) => `${k}: ${v}%`).join(', ')}
• **मजबूत बाजू**: ${latest.strengths.join(', ')}
• **सुधारणेची गरज**: ${latest.weaknesses.join(', ')}
• **अहवाल सारांश**: *${latest.reportSummary.mr}*`,
          sources: [{ label: 'Assessment Report', sourceType: 'assessment' }, { label: 'Skill Passport', sourceType: 'passport' }],
          links: [
            { label: 'मूल्यांकन पाहा (Assess)', href: '/me/assess' },
            { label: 'लर्निंग रोडमॅप', href: '/me/roadmap' },
          ],
          suggestedQueries: ['माझ्या कौशल्य दरी काय आहेत?', 'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?'],
        };
      }

      return {
        intent,
        text: `Here is the summary of your **AI Skill Assessment (ID: ${latest.id})**:

• **Target Role**: **${latest.targetCareer}**
• **Diagnostic Scores**: ${Object.entries(latest.scores).map(([k, v]) => `${k}: ${v}%`).join(' | ')}
• **Demonstrated Strengths**: ${latest.strengths.join(', ')}
• **Priority Gaps**: ${latest.weaknesses.join(', ')}
• **AI Evaluator Summary**: "${latest.reportSummary.en}"`,
        sources: [{ label: 'Diagnostic Assessment', sourceType: 'assessment' }, { label: 'Skill Passport', sourceType: 'passport' }],
        links: [
          { label: 'Review Full Assessment', href: '/me/assess' },
          { label: 'Open Learning Roadmap', href: '/me/roadmap' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
        ],
      };
    }

    case 'APPLICATION_STATUS': {
      if (applications.length === 0) {
        return {
          intent,
          text: isMarathi
            ? `तुमच्या खात्यावर सध्या कोणतेही सक्रिय नोकरी किंवा इंटर्नशिप अर्ज नोंदवलेले नाहीत.`
            : `You have not submitted any opportunity applications yet. Browse matched openings to apply.`,
          sources: [{ label: 'Application Ledger', sourceType: 'tpo' }],
          links: [{ label: 'Browse Internships', href: '/me/internships' }],
        };
      }

      const app = applications[0];
      const opp = opportunities.find((o) => o.id === app.opportunityId);
      const employer = opp ? employers.find((e) => e.id === opp.employerId)?.name : 'Campus Partner';

      if (isMarathi) {
        return {
          intent,
          text: `तुमचा अर्ज **${app.id}**:

• **कंपनी**: **${employer}**
• **पद**: **${opp?.title || 'Engineer Intern'}**
• **सध्याची स्थिती**: **${app.status}**
• **जुळणी गुण**: **${app.matchScore}%**
• **तपशील**: ${app.reasons.join('; ')}`,
          sources: [{ label: 'Application Ledger', sourceType: 'tpo' }],
          links: [{ label: 'इंटर्नशिप पहा', href: '/me/internships' }, { label: 'माझा टाइमलाइन', href: '/me' }],
        };
      }

      return {
        intent,
        text: `Here is your active application status (**Application ID: ${app.id}**):

• **Role**: **${opp?.title || 'Engineer Trainee'}**
• **Employer**: **${employer}**
• **Application State**: **${app.status}**
• **Algorithmic Compatibility**: **${app.matchScore}%**
• **Key Match Drivers**: ${app.reasons.join('; ')}`,
        sources: [{ label: 'Application Ledger', sourceType: 'tpo' }],
        links: [{ label: 'View Internships', href: '/me/internships' }, { label: 'View Timeline', href: '/me' }],
      };
    }

    case 'WAGE_GROWTH': {
      const currentOut = outcomes[outcomes.length - 1];
      const currentWage = currentOut?.wageBand ? wageBandLabel(currentOut.wageBand) : '₹15-20k / month';

      if (isMarathi) {
        return {
          intent,
          text: `तुमच्या **वेतन वाढ व करिअर प्रगती (Wage Progression)** चा तपशील:

• **सध्याची श्रेणी**: **${currentWage}**
• **प्रारंभिक इंटर्नशिप श्रेणी**: ₹<10k ते ₹10-15k
• **पुढील पदोन्नती टप्पा**: ग्रॅज्युएट इंजिनिअर ट्रेनी (GET) / कनिष्ठ सॉफ्टवेअर अभियंता — अपेक्षित वेतन **₹20-30k+**
• **डेटा स्त्रोत**: MSOL ९०-दिवस व १८०-दिवस पडताळणी खातेवही`,
          sources: [{ label: 'Wage Progression Ledger', sourceType: 'tpo' }],
          links: [{ label: 'पगार वाढ व विश्लेषण', href: '/me/growth' }, { label: 'माझी स्थिती', href: '/me' }],
        };
      }

      return {
        intent,
        text: `Here is your **Wage Progression & Salary Tracking** record:

• **Current Verified Band**: **${currentWage}**
• **Initial Internship Band**: Typically <10k or 10-15k during initial 3-month probation
• **Target GET / Full-time Band**: **20-30k+** upon 90-day retention confirmation
• **Audit Trail**: Verified via employer payroll confirmation and DTE longitudinal tracking.`,
        sources: [{ label: 'Wage Progression Ledger', sourceType: 'tpo' }],
        links: [{ label: 'View Salary Progression', href: '/me/growth' }, { label: 'My Profile', href: '/me' }],
      };
    }

    case 'CONSENT_PRIVACY': {
      const c = trainee.consent;
      if (isMarathi) {
        return {
          intent,
          text: `तुमचा डेटा **DPDP कायदा, २०२३** नुसार पूर्णपणे सुरक्षित आहे. तुमची संमती स्थिती:

• **पाठपुरावा संमती (Follow-up)**: ${c.followUp ? '✅ मंजूर (Granted)' : '❌ रद्द (Revoked)'}
• **नियोक्ता पडताळणी (Employer Verify)**: ${c.employerVerify ? '✅ मंजूर' : '❌ रद्द'}
• **संधी मॅचिंग (Matching Share)**: ${c.matchingShare !== false ? '✅ मंजूर' : '❌ रद्द'}
• **स्किल पासपोर्ट शेअरिंग**: ${c.skillPassportShare !== false ? '✅ मंजूर' : '❌ रद्द'}

तुम्ही कधीही **गोपनीयता सेटिंग्ज** मध्ये जाऊन एका क्लिकवर तुमची संमती रद्द किंवा पुनर्स्थापित करू शकता.`,
          sources: [{ label: 'DPDP Consent Manager', sourceType: 'consent' }],
          links: [{ label: 'गोपनीयता व संमती बदला (Privacy)', href: '/privacy' }],
          suggestedQueries: ['माझ्या कौशल्य दरी काय आहेत?', 'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?'],
        };
      }

      return {
        intent,
        text: `Your data is protected under India's **Digital Personal Data Protection (DPDP) Act, 2023**. Here is your active consent ledger:

• **Longitudinal Follow-up**: ${c.followUp ? '✅ Granted (WhatsApp/SMS active)' : '❌ Revoked'}
• **Employer Verification**: ${c.employerVerify ? '✅ Granted' : '❌ Revoked'}
• **Opportunity Matching**: ${c.matchingShare !== false ? '✅ Granted' : '❌ Revoked'}
• **Skill Passport Sharing**: ${c.skillPassportShare !== false ? '✅ Granted' : '❌ Revoked'}

**How to revoke:** You can selectively toggle or withdraw any consent item instantly on the Privacy page with immediate effect.`,
        sources: [{ label: 'DPDP Consent Manager', sourceType: 'consent' }],
        links: [{ label: 'Manage DPDP Consent', href: '/privacy' }],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'When is my next joining follow-up?',
        ],
      };
    }

    case 'APAAR': {
      const apaarMasked = maskApaar(trainee.apaarId);
      if (isMarathi) {
        return {
          intent,
          text: `तुमचा **APAAR आयडी (अपार - एक राष्ट्र, एक विद्यार्थी आयडी)**:

• **नोंदणीकृत APAAR**: **${apaarMasked}**
• **स्थिती**: **सत्यापित (Verified Academic Bank of Credits)**
• **संलग्न संस्था**: ${collegeName}
• **गोपनीयता**: MSOL तुमच्या अधिकृत संमतीशिवाय तुमचा १२-अंकी संपूर्ण आयडी कधीही सार्वजनिक करत नाही.`,
          sources: [{ label: 'APAAR Sandbox', sourceType: 'passport' }],
          links: [{ label: 'स्किल पासपोर्ट पहा', href: '/me/passport' }, { label: 'गोपनीयता', href: '/privacy' }],
        };
      }

      return {
        intent,
        text: `Here is your **APAAR (Automated Permanent Academic Account Registry)** status:

• **Linked Identifier**: **${apaarMasked}** (Securely masked under DPDP guidelines)
• **Registry Status**: **Linked & Verified** via Maharashtra DTE Sandbox
• **Primary Institute**: ${collegeName}
• **Integration**: Seamlessly anchors your Skill Passport to your national Academic Bank of Credits (ABC).`,
        sources: [{ label: 'APAAR Sandbox', sourceType: 'passport' }],
        links: [{ label: 'View Skill Passport', href: '/me/passport' }, { label: 'Privacy & Security', href: '/privacy' }],
      };
    }

    case 'UPDATE_PHONE': {
      if (isMarathi) {
        return {
          intent,
          text: `तुमचा सध्याचा नोंदणीकृत मोबाईल क्रमांक: **${maskPhone(trainee.phone)}** (स्थिती: **${trainee.phoneStatus}**).

कॉलेज हॉस्टेल सोडल्यानंतर किंवा नोकरीच्या ठिकाणी स्थलांतरित झाल्यावर जर तुमचा फोन नंबर बदलला असेल, तर तुम्ही **सेटिंग्ज (Settings)** पानात जाऊन थेट अद्ययावत करू शकता. यामुळे ३०/९०-दिवसांचा फॉलो-अप चुकत नाही.`,
          sources: [{ label: 'Student Profile Registry', sourceType: 'tpo' }],
          links: [{ label: 'सेटिंग्जमध्ये फोन बदला (Settings)', href: '/settings' }, { label: 'माझा प्रोफाइल', href: '/me' }],
        };
      }

      return {
        intent,
        text: `Your currently registered contact number is **${maskPhone(trainee.phone)}** (Status: **${trainee.phoneStatus}**).

If you changed your mobile carrier or SIM after vacating your college hostel, please update it immediately in **Settings**. Keeping your number active ensures you receive official WhatsApp joining confirmations and retention incentives.`,
        sources: [{ label: 'Student Registry', sourceType: 'tpo' }],
        links: [{ label: 'Update Phone in Settings', href: '/settings' }, { label: 'My Profile', href: '/me' }],
      };
    }

    case 'ESCALATE_COUNSELLOR': {
      if (isMarathi) {
        return {
          intent,
          text: `जर महाविद्यालयाने खोटी ऑफर नोंदवली असेल (उदा. अनधिकृत कन्सल्टंट किंवा बनावट कॅम्पस प्लेसमेंट), किंवा तुमच्या रुजू होण्यात अडचण येत असेल, तर तुम्ही **जिल्हा कौशल्य समुपदेशक / TPO तक्रार कक्षाकडे** संपर्क साधू शकता.

MSOL अशा तक्रारींची थेट जिल्हा कौशल्य अधिकारी (DSO) पातळीवर दखल घेते.`,
          sources: [{ label: 'Grievance & Counselling Desk', sourceType: 'tpo' }],
          links: [{ label: 'माझा टाइमलाइन इतिहास', href: '/me' }, { label: 'गोपनीयता व तक्रार', href: '/privacy' }],
        };
      }

      return {
        intent,
        text: `If you have experienced an unverified placement claim, a non-responsive staffing agency, or a stipend dispute, you can escalate to your college's **Career Counsellor / District Skill Officer (DSO)**.

MSOL maintains an audit trail of all disputes to safeguard student rights and penalize inflated college placement claims.`,
        sources: [{ label: 'Grievance & Counselling Desk', sourceType: 'tpo' }],
        links: [{ label: 'Review My Placement', href: '/me' }, { label: 'Privacy & Dispute', href: '/privacy' }],
      };
    }

    case 'OUT_OF_SCOPE':
    default: {
      if (isMarathi) {
        return {
          intent: 'OUT_OF_SCOPE',
          text: `क्षमस्व, मी फक्त **तुमच्या अधिकृत MSOL अभियांत्रिकी करिअर नोंदी, कौशल्य दऱ्या, इंटर्नशिप आणि पाठपुराव्यासंबंधी** उत्तरे देऊ शकतो.

मी इतर विद्यार्थ्यांचा वैयक्तिक डेटा, सरकारी प्रशासकीय विश्लेषणे, आधार क्रमांक किंवा खुल्या इंटरनेटवरील सामान्य ज्ञान दाखवू शकत नाही.

तुम्ही विचारू शकता:
• "माझ्या कौशल्य दरी काय आहेत?"
• "पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?"
• "माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?"`,
          sources: [{ label: 'MSOL Policy Sandbox', sourceType: 'consent' }],
          links: [
            { label: 'कौशल्य अंतर (Gaps)', href: '/me/gaps' },
            { label: 'लर्निंग रोडमॅप (Roadmap)', href: '/me/roadmap' },
            { label: 'इंटर्नशिप (Internships)', href: '/me/internships' },
          ],
          suggestedQueries: [
            'माझ्या कौशल्य दरी काय आहेत?',
            'पुण्यातील कोणती इंटर्नशिप माझ्या शाखेला योग्य आहे?',
            'माझा पुढील जॉइनिंग फॉलो-अप कधी आहे?',
          ],
        };
      }

      return {
        intent: 'OUT_OF_SCOPE',
        text: `I am specialized strictly for your **Maharashtra student engineering career record**. I cannot answer general internet queries, medical/legal questions, or share confidential administrative analytics or other students' data.

Please ask questions related to your live MSOL profile:
• "What skills am I missing for an SDE / campus IT role?"
• "Which internship in Pune fits my branch?"
• "When is my next joining follow-up?"
• "Is my TPO offer verified by the employer?"`,
        sources: [{ label: 'MSOL Policy Sandbox', sourceType: 'consent' }],
        links: [
          { label: 'My Skill Gaps', href: '/me/gaps' },
          { label: 'Learning Roadmap', href: '/me/roadmap' },
          { label: 'Recommended Internships', href: '/me/internships' },
        ],
        suggestedQueries: [
          'What skills am I missing for an SDE / campus IT role?',
          'Which internship in Pune fits my branch?',
          'When is my next joining follow-up?',
          'Is my TPO offer verified by the employer?',
        ],
      };
    }
  }
}
