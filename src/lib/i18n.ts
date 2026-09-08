// ============================================================
// MSOL — i18n Label Map (English / Marathi)
// ============================================================

export type LangKey = 'en' | 'mr';

const labels: Record<string, Record<LangKey, string>> = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', mr: 'डॅशबोर्ड' },
  'nav.trainees': { en: 'Students', mr: 'विद्यार्थी' },
  'nav.followups': { en: 'Follow-ups', mr: 'पाठपुरावा' },
  'nav.employers': { en: 'Employers', mr: 'नियोक्ते' },
  'nav.outcomes': { en: 'Outcomes', mr: 'परिणाम' },
  'nav.analytics': { en: 'Analytics', mr: 'विश्लेषण' },
  'nav.skillgaps': { en: 'Skill Gaps', mr: 'कौशल्य अंतर' },
  'nav.providers': { en: 'Colleges & Institutes', mr: 'महाविद्यालये व संस्था' },
  'nav.policy': { en: 'Policy Brief', mr: 'धोरण सारांश' },
  'nav.privacy': { en: 'Privacy', mr: 'गोपनीयता' },
  'nav.settings': { en: 'Settings', mr: 'सेटिंग्ज' },
  'nav.consent': { en: 'Consent', mr: 'संमती' },
  'nav.myprofile': { en: 'My Profile', mr: 'माझी प्रोफाइल' },
  'nav.passport': { en: 'Skill Passport', mr: 'स्किल पासपोर्ट' },
  'nav.assessments': { en: 'Assessments', mr: 'मूल्यांकन' },
  'nav.roadmap': { en: 'Learning Roadmap', mr: 'लर्निंग रोडमॅप' },
  'nav.internships': { en: 'Internships', mr: 'इंटर्नशिप' },
  'nav.jobs': { en: 'Jobs', mr: 'नोकऱ्या' },
  'nav.growth': { en: 'Growth', mr: 'पगार वाढ' },
  'nav.sahayak': { en: 'Sahayak AI', mr: 'सहायक' },
  'nav.resources': { en: 'Learning Videos', mr: 'शिक्षण व्हिडिओ' },
  'nav.skill_videos': { en: 'Skill Videos', mr: 'कौशल्य व्हिडिओ' },
  'nav.matching': { en: 'Matching', mr: 'मॅचिंग' },
  'nav.opportunities': { en: 'Opportunities', mr: 'संधी' },
  'nav.post_job': { en: 'Post Job', mr: 'नोकरी पोस्ट करा' },
  'nav.candidates': { en: 'Find Candidates', mr: 'उमेदवार शोधा' },
  'nav.logout': { en: 'Logout', mr: 'बाहेर पडा' },
  'nav.login': { en: 'Login', mr: 'प्रवेश करा' },

  // Sahayak AI Assistant
  'sahayak.title': { en: 'MSOL Sahayak (सहायक)', mr: 'एमएसओएल सहायक' },
  'sahayak.subtitle': { en: 'Student Career Assistant — Grounded in your MSOL record', mr: 'विद्यार्थी करिअर सहायक — तुमच्या अधिकृत MSOL नोंदींवर आधारित' },
  'sahayak.badge': { en: 'Demo assistant — your MSOL record, not the open internet.', mr: 'डेमो सहायक — तुमच्या अधिकृत MSOL नोंदी, खुल्या इंटरनेटवरील माहिती नाही.' },
  'sahayak.disclaimer': { en: 'Grounded in your verified MSOL record. Not a live helpline or emergency legal service.', mr: 'तुमच्या अधिकृत MSOL नोंदींवर आधारित. थेट हेल्पलाइन किंवा आपत्कालीन कायदेशीर सेवा नाही.' },
  'sahayak.input_placeholder': { en: 'Ask about your CSE gaps, Pune internships, next follow-up, consent...', mr: 'तुमच्या कौशल्य दऱ्या, पुणे इंटर्नशिप, पुढील पाठपुरावा किंवा संमतीबद्दल विचारा...' },
  'sahayak.send': { en: 'Send', mr: 'पाठवा' },
  'sahayak.clear_chat': { en: 'Clear Chat', mr: 'संभाषण साफ करा' },

  // Header
  'header.govt': { en: 'Government of Maharashtra', mr: 'महाराष्ट्र शासन' },
  'header.dept': { en: 'Department of Skills, Employment, Entrepreneurship and Innovation', mr: 'कौशल्य, रोजगार, उद्योजकता व नवोपक्रम विभाग' },
  'header.msol': { en: 'MSOL', mr: 'एमएसओएल' },
  'header.tagline': { en: 'Maharashtra Skilling Outcomes Ledger', mr: 'महाराष्ट्र कौशल्य परिणाम खातेवही' },
  'header.demo': { en: 'Demo data — not live MIS', mr: 'डेमो डेटा — लाइव्ह MIS नाही' },

  // Roles
  'role.state_admin': { en: 'State Admin (DTE / MSINS)', mr: 'राज्य प्रशासक (DTE / MSINS)' },
  'role.district_officer': { en: 'District Skill Officer', mr: 'जिल्हा कौशल्य अधिकारी' },
  'role.training_provider': { en: 'College / Institute (TPO)', mr: 'महाविद्यालय / संस्था (TPO)' },
  'role.employer': { en: 'Employer (HR)', mr: 'नियोक्ता (HR)' },
  'role.counsellor': { en: 'Career Counsellor / TPO', mr: 'कारकीर्द समुपदेशक / TPO' },
  'role.trainee': { en: 'Student / Graduate', mr: 'विद्यार्थी / पदवीधर' },

  // KPI labels
  'kpi.certified': { en: 'Graduated / Certified', mr: 'पदवीधर / प्रमाणित' },
  'kpi.paperPlacement': { en: 'TPO Campus Placement %', mr: 'TPO कॅम्पस नियोजन %' },
  'kpi.verifiedPlacement': { en: 'Verified Placement %', mr: 'सत्यापित नियोजन %' },
  'kpi.retention90d': { en: '90-Day Retention', mr: '९०-दिवस टिकाव' },
  'kpi.medianWage': { en: 'Median Wage Band', mr: 'मध्यम वेतन श्रेणी' },
  'kpi.unreachable': { en: 'Unreachable %', mr: 'अनुपलब्ध %' },
  'kpi.selfEmployment': { en: 'Self-Employment %', mr: 'स्वयंरोजगार %' },

  // Status
  'status.verified': { en: 'Verified', mr: 'सत्यापित' },
  'status.employer_confirmed': { en: 'Employer Confirmed', mr: 'नियोक्ता पुष्टी' },
  'status.self_reported': { en: 'Self-Reported', mr: 'स्वयं-अहवाल' },
  'status.unreachable': { en: 'Unreachable', mr: 'अनुपलब्ध' },
  'status.at_risk': { en: 'At Risk', mr: 'धोक्यात' },
  'status.document_backed': { en: 'Document Backed', mr: 'दस्तऐवज समर्थित' },

  // Consent
  'consent.title': { en: 'Data Consent', mr: 'डेटा संमती' },
  'consent.purpose': { en: 'We collect your data to track your employment outcomes after training. Your information is protected under DPDP Act.', mr: 'प्रशिक्षणानंतर तुमच्या रोजगार परिणामांचा मागोवा घेण्यासाठी आम्ही तुमचा डेटा गोळा करतो. तुमची माहिती DPDP कायद्याअंतर्गत संरक्षित आहे.' },
  'consent.followup': { en: 'Allow follow-up calls/messages about my employment status', mr: 'माझ्या रोजगार स्थितीबद्दल पाठपुरावा कॉल/संदेशांना परवानगी द्या' },
  'consent.employer_verify': { en: 'Allow my employer to verify my employment', mr: 'माझ्या नियोक्त्याला माझा रोजगार सत्यापित करण्याची परवानगी द्या' },
  'consent.analytics': { en: 'Allow anonymised data for analytics', mr: 'विश्लेषणासाठी निनावी डेटा वापरण्याची परवानगी द्या' },
  'consent.revoke': { en: 'Revoke Consent', mr: 'संमती रद्द करा' },
  'consent.granted': { en: 'Consent Granted', mr: 'संमती दिली' },

  // Follow-up
  'followup.due': { en: 'Due', mr: 'देय' },
  'followup.overdue': { en: 'Overdue', mr: 'विलंबित' },
  'followup.completed': { en: 'Completed', mr: 'पूर्ण' },
  'followup.pending': { en: 'Pending', mr: 'प्रलंबित' },

  // Actions
  'action.search': { en: 'Search', mr: 'शोधा' },
  'action.filter': { en: 'Filter', mr: 'फिल्टर' },
  'action.export': { en: 'Export', mr: 'निर्यात' },
  'action.confirm': { en: 'Confirm', mr: 'पुष्टी करा' },
  'action.dispute': { en: 'Dispute', mr: 'विवाद' },
  'action.save': { en: 'Save', mr: 'जतन करा' },
  'action.reset_demo': { en: 'Reset Demo Data', mr: 'डेमो डेटा रीसेट करा' },
  'action.launch_demo': { en: 'Launch Live Demo', mr: 'लाइव्ह डेमो सुरू करा' },

  // Empty states
  'empty.no_data': { en: 'No data available', mr: 'डेटा उपलब्ध नाही' },
  'empty.no_trainees': { en: 'No students found matching your criteria', mr: 'तुमच्या निकषांशी जुळणारे विद्यार्थी सापडले नाहीत' },
  'empty.no_followups': { en: 'No follow-ups in queue', mr: 'रांगेत पाठपुरावा नाही' },
};

export function t(key: string, lang: LangKey = 'en'): string {
  return labels[key]?.[lang] || labels[key]?.en || key;
}

export function getAllLabels(): typeof labels {
  return labels;
}
