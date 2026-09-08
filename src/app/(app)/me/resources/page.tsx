'use client';

import React, { useState } from 'react';
import { useMSOLStore, providers } from '@/lib/store';
import { Video, Play, Eye, Clock, Tag, BookOpen, Search, Filter, Star, CheckCircle2, Lock } from 'lucide-react';
import type { ResourceLevel } from '@/lib/types';

const levelColors: Record<ResourceLevel, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-800',
  INTERMEDIATE: 'bg-amber-100 text-amber-800',
  ADVANCED: 'bg-red-100 text-red-800',
};

const levelOrder: ResourceLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function StudentResourcesPage() {
  const { currentUser, learningResources, assessments, incrementResourceViews } = useMSOLStore();
  const traineeId = currentUser?.traineeId || 'MSOL-MH-0001';

  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<ResourceLevel | ''>('');
  const [filterSkill, setFilterSkill] = useState('');
  const [watchingId, setWatchingId] = useState<string | null>(null);
  const [watched, setWatched] = useState<Set<string>>(new Set());

  // Get the trainee's skill gaps from latest assessment
  const myAssessment = [...assessments]
    .filter(a => a.traineeId === traineeId)
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt))[0];
  const myGaps = myAssessment?.weaknesses || [];

  // Recommended = resources matching skill gaps
  const recommended = learningResources.filter(r =>
    r.skillTags.some(t => myGaps.includes(t))
  );

  // Filter all resources
  const allFiltered = learningResources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.skillTags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchLevel = !filterLevel || r.level === filterLevel;
    const matchSkill = !filterSkill || r.skillTags.some(t => t.toLowerCase().includes(filterSkill.toLowerCase()));
    return matchSearch && matchLevel && matchSkill;
  });

  const allSkills = [...new Set(learningResources.flatMap(r => r.skillTags))].sort();

  const handleWatch = (id: string) => {
    setWatchingId(id);
    if (!watched.has(id)) {
      incrementResourceViews(id);
      setWatched(prev => new Set(prev).add(id));
    }
  };

  const watchingResource = watchingId ? learningResources.find(r => r.id === watchingId) : null;
  const watchingProvider = watchingResource ? providers.find(p => p.id === watchingResource.providerId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-saffron-400" />
              <h1 className="text-xl font-bold">Learning Resources</h1>
            </div>
            <p className="text-navy-200 text-sm">
              Skill videos and study materials curated by your institute's TPO to help close your career gaps.
            </p>
            <div className="flex items-center gap-3 mt-3 text-xs text-navy-300">
              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {learningResources.length} videos</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {watched.size} watched</span>
              {myGaps.length > 0 && (
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-saffron-400" /> {recommended.length} recommended for you</span>
              )}
            </div>
          </div>
          {myGaps.length > 0 && (
            <div className="bg-white/10 rounded-xl p-4 shrink-0 min-w-[180px]">
              <div className="text-xs font-semibold text-saffron-300 mb-2 uppercase tracking-wider">Your Gap Areas</div>
              <div className="flex flex-col gap-1">
                {myGaps.map(gap => (
                  <span key={gap} className="text-xs bg-red-500/20 text-red-200 px-2 py-0.5 rounded">{gap}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended for You */}
      {recommended.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-saffron-500" />
            <h2 className="text-base font-bold text-navy-900">Recommended for You</h2>
            <span className="text-xs text-gray-400">Based on your assessment gaps</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                provider={providers.find(p => p.id === resource.providerId)}
                watched={watched.has(resource.id)}
                recommended
                onWatch={() => handleWatch(resource.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or skill..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-navy-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-navy-500"
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value as ResourceLevel | '')}
          >
            <option value="">All Levels</option>
            {levelOrder.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-navy-500"
            value={filterSkill}
            onChange={e => setFilterSkill(e.target.value)}
          >
            <option value="">All Skills</option>
            {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="text-xs text-gray-400 mt-2">{allFiltered.length} of {learningResources.length} resources</div>
      </div>

      {/* All Resources Grid */}
      <div>
        <h2 className="text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-600" /> All Resources
        </h2>
        {allFiltered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No resources match your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFiltered.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                provider={providers.find(p => p.id === resource.providerId)}
                watched={watched.has(resource.id)}
                recommended={false}
                onWatch={() => handleWatch(resource.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {watchingResource && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4"
          onClick={() => setWatchingId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-4 border-b border-gray-100">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-navy-900 leading-tight">{watchingResource.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${levelColors[watchingResource.level]}`}>
                    {watchingResource.level}
                  </span>
                  {watchingResource.durationMins && (
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {watchingResource.durationMins} min</span>
                  )}
                  {watchingProvider && (
                    <span className="text-xs text-navy-600 font-medium">{watchingProvider.name}</span>
                  )}
                </div>
                {watchingResource.skillTags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {watchingResource.skillTags.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-navy-50 text-navy-700 rounded font-medium">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setWatchingId(null)} className="text-gray-400 hover:text-gray-700 font-bold text-xl shrink-0">✕</button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={watchingResource.url + '?autoplay=1'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={watchingResource.title}
              />
            </div>
            {watchingResource.description && (
              <div className="p-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                {watchingResource.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ResourceCard sub-component ---
function ResourceCard({
  resource, provider, watched, recommended, onWatch
}: {
  resource: import('@/lib/types').LearningResource;
  provider?: import('@/lib/types').Provider;
  watched: boolean;
  recommended: boolean;
  onWatch: () => void;
}) {
  return (
    <div className={`group border rounded-xl overflow-hidden hover:shadow-md transition-all bg-white ${recommended ? 'border-saffron-300 ring-1 ring-saffron-200' : 'border-gray-200'}`}>
      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-navy-950 cursor-pointer overflow-hidden"
        onClick={onWatch}
      >
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video className="w-10 h-10 text-navy-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-navy-900 ml-0.5" />
          </div>
        </div>
        {/* Badges */}
        {recommended && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-saffron-400 text-navy-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5" /> Recommended
          </div>
        )}
        {watched && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" /> Watched
          </div>
        )}
        {resource.durationMins && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono">
            {Math.floor(resource.durationMins / 60)}:{String(resource.durationMins % 60).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-navy-900 leading-tight line-clamp-2 flex-1">{resource.title}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${levelColors[resource.level]}`}>
            {resource.level}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.skillTags.slice(0, 3).map(tag => (
            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${recommended && resource.skillTags.includes(tag) ? 'bg-saffron-100 text-saffron-800' : 'bg-navy-50 text-navy-700'}`}>
              {tag}
            </span>
          ))}
          {resource.skillTags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">+{resource.skillTags.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {resource.views}</span>
            {provider && <span className="truncate max-w-[100px]">{provider.name.split(' ').slice(0, 2).join(' ')}</span>}
          </div>
          <button
            onClick={onWatch}
            className="text-xs font-semibold text-navy-700 hover:text-navy-900 flex items-center gap-1 hover:underline"
          >
            <Play className="w-3 h-3" /> Watch
          </button>
        </div>
      </div>
    </div>
  );
}
