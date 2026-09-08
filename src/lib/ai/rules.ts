// ============================================================
// Phase 2: Deterministic AI Rules Engine
// Rule-based decision support (explainable, no black-box ML)
// ============================================================

import type { SkillPassport, CourseCatalogItem, Opportunity, SkillAssessment, Trainee } from '../types';

export function matchCourses(missingSkills: string[], catalog: CourseCatalogItem[], district?: string): { course: CourseCatalogItem, score: number, reasons: string[] }[] {
  if (!missingSkills || missingSkills.length === 0) return [];

  const matches = catalog.map(course => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Skill overlap (Most important)
    const overlap = course.skillTags.filter(tag => missingSkills.includes(tag));
    if (overlap.length > 0) {
      score += overlap.length * 30;
      reasons.push(`Covers missing skills: ${overlap.join(', ')}`);
    }

    // 2. Location match for non-online courses
    if (course.mode !== 'ONLINE') {
      if (course.district === district) {
        score += 20;
        reasons.push(`Available locally in ${district}`);
      } else {
        score -= 10;
        reasons.push(`Requires travel to ${course.district}`);
      }
    } else {
      score += 15;
      reasons.push('Online mode allows flexible access');
    }

    return { course, score, reasons };
  });

  return matches.filter(m => m.score > 0).sort((a, b) => b.score - a.score);
}

export function matchOpportunities(
  passport: SkillPassport, 
  trainee: Trainee,
  opportunities: Opportunity[], 
  latestAssessment?: SkillAssessment
): { opportunity: Opportunity, score: number, reasons: string[] }[] {
  
  // If matching is disabled by consent, return empty
  if (trainee.consent.matchingShare === false) return [];

  const mySkills = passport.skills.map(s => s.tag);
  const myGoal = passport.careerGoal;

  const matches = opportunities.filter(o => o.status === 'OPEN').map(opp => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Skills overlap (40%)
    const requiredOverlap = opp.skillTagsRequired.filter(t => mySkills.includes(t));
    const niceOverlap = opp.skillTagsNice.filter(t => mySkills.includes(t));
    
    if (opp.skillTagsRequired.length > 0) {
      const skillScore = (requiredOverlap.length / opp.skillTagsRequired.length) * 40;
      score += skillScore;
      if (skillScore >= 20) reasons.push(`Core skills match (${requiredOverlap.length}/${opp.skillTagsRequired.length} requirements met)`);
    } else {
      score += 40; // No hard requirements
    }
    
    if (niceOverlap.length > 0) {
      score += Math.min(10, niceOverlap.length * 5); // bonus points
    }

    // 2. Career Goal (20%)
    if (myGoal) {
      if (opp.careerGoalTags.includes(myGoal.targetOccupation) || opp.occupation === myGoal.targetOccupation) {
        score += 20;
        reasons.push('Matches target career goal');
      }
    }

    // 3. Location (20%)
    if (opp.district === trainee.district || opp.district === trainee.currentLocation) {
      score += 20;
      reasons.push(`Location matches (${opp.district})`);
    } else if (myGoal?.willingToMigrate) {
      score += 10;
      reasons.push(`Different district, but willing to migrate`);
    } else {
      score -= 10; // Penalty for unwilling to migrate and wrong location
    }

    // 4. Assessment (10%)
    if (latestAssessment) {
      const avgScore = Object.values(latestAssessment.scores).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(latestAssessment.scores).length);
      if (avgScore > 75) {
        score += 10;
        reasons.push('Strong assessment performance');
      } else if (avgScore > 50) {
        score += 5;
      }
    }

    return { opportunity: opp, score: Math.min(100, Math.max(0, Math.round(score))), reasons };
  });

  return matches.filter(m => m.score >= 40).sort((a, b) => b.score - a.score);
}
