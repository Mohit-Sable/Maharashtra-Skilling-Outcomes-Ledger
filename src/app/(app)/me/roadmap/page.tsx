'use client';

import React, { useMemo } from 'react';
import { useMSOLStore } from '@/lib/store';
import { matchCourses } from '@/lib/ai/rules';
import { Map as MapIcon, CheckCircle2, PlayCircle, ExternalLink } from 'lucide-react';

export default function RoadmapPage() {
  const { currentUser, skillPassports, assessments, catalog, roadmaps, markRoadmapComplete } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';
  
  const passport = skillPassports.find(p => p.traineeId === traineeId);
  const assessment = assessments.find(a => a.traineeId === traineeId);
  const roadmap = roadmaps.find(r => r.traineeId === traineeId);

  // If no roadmap exists, we dynamically generate one using the AI rules engine
  const dynamicRoadmap = useMemo(() => {
    if (roadmap) return roadmap.items.map(i => ({
      ...i, 
      course: catalog.find(c => c.id === i.courseId)!
    }));

    if (!assessment) return [];
    const missing = assessment.missingForTarget;
    const district = passport?.careerGoal?.preferredDistricts[0] || 'Pune';
    
    const matches = matchCourses(missing, catalog, district);
    return matches.slice(0, 3).map((m, idx) => ({
      courseId: m.course.id,
      course: m.course,
      reason: m.reasons[0],
      priority: idx === 0 ? 'HIGH' : 'MED' as any,
      status: 'RECOMMENDED' as const
    }));
  }, [roadmap, assessment, catalog, passport]);

  if (!passport) return <div className="p-6">Passport not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card p-6 bg-navy-900 text-white">
        <div className="flex items-center gap-4 mb-2">
          <MapIcon className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        </div>
        <p className="text-navy-100">AI-recommended courses to bridge your skill gaps and reach your target career.</p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:w-0.5 before:bg-gray-200">
        {dynamicRoadmap.length === 0 && <p className="text-gray-500 pl-6">No recommendations at this time. Take an assessment to discover gaps.</p>}
        {dynamicRoadmap.map((item, i) => (
          <div key={i} className="relative pl-14">
            <div className={`absolute left-0 top-6 w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center -ml-6 z-10 ${item.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-white text-navy-500'}`}>
              {item.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
            </div>
            <div className="card p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-navy-900">{item.course.title}</h3>
                  <p className="text-sm text-gray-500">{item.course.providerName} • {item.course.mode} {item.course.district ? `(${item.course.district})` : ''}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${item.course.cost === 'FREE' ? 'bg-emerald-100 text-emerald-700' : 'bg-saffron-100 text-saffron-700'}`}>
                    {item.course.cost} {item.course.priceInr ? `(₹${item.course.priceInr})` : ''}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-navy-600 bg-navy-50 p-3 rounded-lg mb-4">
                <strong>Why this course?</strong> {item.reason}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {item.course.skillTags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
                {item.status !== 'COMPLETED' ? (
                  <div className="flex gap-2">
                    <a href={item.course.urlPlaceholder} className="btn-secondary text-sm">View Details <ExternalLink className="w-3 h-3 ml-1" /></a>
                    {roadmap && (
                      <button onClick={() => markRoadmapComplete(roadmap.id, item.courseId)} className="btn-primary text-sm">
                        Mark Complete
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
