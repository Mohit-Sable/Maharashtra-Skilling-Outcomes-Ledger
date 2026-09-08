// ============================================================
// MSOL — Zustand Store (Auth, Role, Data)
// ============================================================
'use client';

import { create } from 'zustand';
import type { DemoUser, UserRole, OutcomeEvent, FollowUp, Confidence, SkillPassport, SkillAssessment, CourseCatalogItem, LearningRoadmap, Opportunity, Application, EmployerFeedback, SalaryProgression, Consent, LearningResource } from './types';
import type { LangKey } from './i18n';
import {
  demoUsers, trainees as seedTrainees, enrolments as seedEnrolments,
  outcomeEvents as seedOutcomes, followUps as seedFollowUps,
  employers as seedEmployers, providers as seedProviders,
  providerScores as seedProviderScores, nonPlacementReasons as seedNPR,
  courses as seedCourses, districts as seedDistricts, integrityFlags as seedFlags,
  catalog as seedCatalog, opportunities as seedOpportunities, skillPassports as seedPassports,
  assessments as seedAssessments, roadmaps as seedRoadmaps, applications as seedApplications,
  employerFeedback as seedFeedback, salaryLogs as seedSalaryLogs, learningResources as seedResources
} from './seed';

interface MSOLStore {
  // Auth
  currentUser: DemoUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  loginApaar: (apaarId: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;

  // Language
  language: LangKey;
  setLanguage: (lang: LangKey) => void;

  // Data (mutable copies for demo interactions)
  outcomeEvents: OutcomeEvent[];
  followUps: FollowUp[];
  skillPassports: SkillPassport[];
  assessments: SkillAssessment[];
  catalog: CourseCatalogItem[];
  roadmaps: LearningRoadmap[];
  opportunities: Opportunity[];
  applications: Application[];
  employerFeedback: EmployerFeedback[];
  salaryLogs: SalaryProgression[];
  learningResources: LearningResource[];

  addOutcomeEvent: (event: OutcomeEvent) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  upgradeConfidence: (outcomeId: string, confidence: Confidence) => void;
  submitAssessment: (assessment: SkillAssessment) => void;
  markRoadmapComplete: (roadmapId: string, courseId: string) => void;
  applyToOpportunity: (application: Application) => void;
  submitEmployerFeedback: (feedback: EmployerFeedback) => void;
  updateTraineeConsent: (traineeId: string, updates: Partial<Consent>) => void;
  uploadLearningResource: (resource: LearningResource) => void;
  incrementResourceViews: (resourceId: string) => void;

  // Mobile sidebar
  mobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;

  // Demo
  resetDemoData: () => void;

  // Guided demo
  guidedDemoStep: number;
  guidedDemoActive: boolean;
  startGuidedDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  endGuidedDemo: () => void;
}

export const useMSOLStore = create<MSOLStore>((set, get) => ({
  // Mobile sidebar
  mobileSidebarOpen: false,
  toggleMobileSidebar: () => set(state => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  // Consent
  updateTraineeConsent: (traineeId: string, updates: Partial<Consent>) => {
    const t = seedTrainees.find(tr => tr.id === traineeId);
    if (t) {
      t.consent = { ...t.consent, ...updates };
      if (updates.revokedAt !== undefined || updates.followUp === false) {
        if (!updates.revokedAt && updates.followUp === false) {
          t.consent.revokedAt = new Date().toISOString();
        }
      }
    }
    set(state => ({
      skillPassports: [...state.skillPassports],
    }));
  },
  // Auth
  currentUser: null,
  isLoggedIn: false,

  login: (email: string, password: string) => {
    const user = demoUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ currentUser: user, isLoggedIn: true });
      return true;
    }
    return false;
  },

  loginApaar: (apaarId: string) => {
    const trainee = seedTrainees.find(t => t.apaarId === apaarId);
    if (trainee) {
      set({
        currentUser: {
          email: 'trainee@msol.demo',
          password: 'apaar',
          role: 'trainee',
          name: trainee.name,
          traineeId: trainee.id
        },
        isLoggedIn: true
      });
      return true;
    }
    return false;
  },

  loginAsRole: (role: UserRole) => {
    const user = demoUsers.find(u => u.role === role);
    if (user) {
      set({ currentUser: user, isLoggedIn: true });
    }
  },

  logout: () => {
    set({ currentUser: null, isLoggedIn: false });
  },

  // Language
  language: 'en',
  setLanguage: (lang: LangKey) => set({ language: lang }),

  // Data
  outcomeEvents: [...seedOutcomes],
  followUps: [...seedFollowUps],
  skillPassports: [...seedPassports],
  assessments: [...seedAssessments],
  catalog: [...seedCatalog],
  roadmaps: [...seedRoadmaps],
  opportunities: [...seedOpportunities],
  applications: [...seedApplications],
  employerFeedback: [...seedFeedback],
  salaryLogs: [...seedSalaryLogs],
  learningResources: [...seedResources],

  addOutcomeEvent: (event: OutcomeEvent) => {
    set(state => ({
      outcomeEvents: [...state.outcomeEvents, event],
    }));
  },

  updateFollowUp: (id: string, updates: Partial<FollowUp>) => {
    set(state => ({
      followUps: state.followUps.map(f => f.id === id ? { ...f, ...updates } : f),
    }));
  },

  upgradeConfidence: (outcomeId: string, confidence: Confidence) => {
    set(state => ({
      outcomeEvents: state.outcomeEvents.map(o =>
        o.id === outcomeId ? { ...o, confidence } : o
      ),
    }));
  },

  submitAssessment: (assessment) => set(state => ({ assessments: [...state.assessments, assessment] })),

  markRoadmapComplete: (roadmapId, courseId) => set(state => ({
    roadmaps: state.roadmaps.map(r => r.id === roadmapId ? {
      ...r,
      items: r.items.map(i => i.courseId === courseId ? { ...i, status: 'COMPLETED' } : i)
    } : r)
  })),

  applyToOpportunity: (application) => set(state => ({ applications: [...state.applications, application] })),

  submitEmployerFeedback: (feedback) => set(state => {
    const passport = state.skillPassports.find(p => p.traineeId === feedback.traineeId);
    let newPassports = state.skillPassports;
    if (passport && feedback.missingSkillTags.length > 0) {
      const existingTags = passport.skills.map(s => s.tag);
      const newSkills = feedback.missingSkillTags
        .filter(t => !existingTags.includes(t))
        .map(t => ({ tag: t, source: 'EMPLOYER' as const, proficiency: 1, verified: true }));
      
      if (newSkills.length > 0) {
        newPassports = state.skillPassports.map(p => p.id === passport.id ? {
          ...p,
          skills: [...p.skills, ...newSkills]
        } : p);
      }
    }

    return {
      employerFeedback: [...state.employerFeedback, feedback],
      skillPassports: newPassports
    };
  }),

  uploadLearningResource: (resource) => set(state => ({
    learningResources: [...state.learningResources, resource],
  })),

  incrementResourceViews: (resourceId) => set(state => ({
    learningResources: state.learningResources.map(r =>
      r.id === resourceId ? { ...r, views: r.views + 1 } : r
    ),
  })),

  // Demo
  resetDemoData: () => {
    if (typeof window !== 'undefined') {
      try {
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('msol_sahayak_chat_')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch {
        // ignore
      }
    }
    set({
      outcomeEvents: [...seedOutcomes],
      followUps: [...seedFollowUps],
      skillPassports: [...seedPassports],
      assessments: [...seedAssessments],
      roadmaps: [...seedRoadmaps],
      applications: [...seedApplications],
      employerFeedback: [...seedFeedback],
    });
  },

  // Guided demo
  guidedDemoStep: 0,
  guidedDemoActive: false,
  startGuidedDemo: () => set({ guidedDemoActive: true, guidedDemoStep: 0 }),
  nextDemoStep: () => set(state => ({ guidedDemoStep: Math.min(state.guidedDemoStep + 1, 12) })),
  prevDemoStep: () => set(state => ({ guidedDemoStep: Math.max(state.guidedDemoStep - 1, 0) })),
  endGuidedDemo: () => set({ guidedDemoActive: false, guidedDemoStep: 0 }),
}));

// Re-export seed data for read-only access
export {
  seedTrainees as trainees,
  seedEnrolments as enrolments,
  seedEmployers as employers,
  seedProviders as providers,
  seedProviderScores as providerScores,
  seedNPR as nonPlacementReasons,
  seedCourses as courses,
  seedDistricts as districts,
  seedFlags as integrityFlags,
  seedCatalog as catalog,
  seedOpportunities as opportunities,
  seedPassports as skillPassports,
  seedAssessments as assessments,
  seedRoadmaps as roadmaps,
  seedApplications as applications,
  seedFeedback as employerFeedback,
  seedSalaryLogs as salaryLogs,
  seedResources as learningResources,
  demoUsers,
};
