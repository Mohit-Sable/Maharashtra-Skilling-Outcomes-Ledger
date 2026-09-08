'use client';

import React, { useState } from 'react';
import { useMSOLStore, providers } from '@/lib/store';
import { Video, Upload, Plus, Eye, Clock, Tag, BookOpen, Trash2, CheckCircle2, Play, Filter } from 'lucide-react';
import type { LearningResource, ResourceType, ResourceLevel } from '@/lib/types';

const levelColors: Record<ResourceLevel, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-800',
  INTERMEDIATE: 'bg-amber-100 text-amber-800',
  ADVANCED: 'bg-red-100 text-red-800',
};

const skillOptions = [
  'Data Structures & Algorithms', 'SQL', 'Java/Python', 'React', 'Git',
  'Spoken English', 'Aptitude', 'SolidWorks', 'GD&T', 'PLC',
  'AutoCAD Civil', 'Embedded C', 'MATLAB', 'Site Quantity Surveying',
  'Industrial Safety', 'Machine Learning', 'Cloud Computing',
];

const branchOptions = [
  '', 'Computer Engineering', 'IT Engineering', 'Mechanical Engineering',
  'ENTC Engineering', 'Electrical Engineering', 'Civil Engineering',
  'AI & Data Science', 'Diploma Mechanical', 'Diploma Computer', 'Diploma Civil',
];

const emptyForm = {
  title: '',
  description: '',
  url: '',
  skillTags: [] as string[],
  branch: '',
  type: 'VIDEO' as ResourceType,
  level: 'BEGINNER' as ResourceLevel,
  durationMins: '',
};

export default function ProviderVideosPage() {
  const { currentUser, learningResources, uploadLearningResource } = useMSOLStore();
  const providerId = currentUser?.providerId || 'PRV-001';
  const provider = providers.find(p => p.id === providerId);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [filterSkill, setFilterSkill] = useState('');
  const [watchingId, setWatchingId] = useState<string | null>(null);

  // Resources uploaded by this provider
  const myResources = learningResources.filter(r => r.providerId === providerId);
  const filtered = filterSkill
    ? myResources.filter(r => r.skillTags.some(t => t.toLowerCase().includes(filterSkill.toLowerCase())))
    : myResources;

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skillTags: prev.skillTags.includes(skill)
        ? prev.skillTags.filter(s => s !== skill)
        : [...prev.skillTags, skill],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url || form.skillTags.length === 0) return;

    // Convert YouTube watch URL to embed URL
    let embedUrl = form.url;
    const ytMatch = form.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const resource: LearningResource = {
      id: `RES-${Date.now()}`,
      providerId,
      title: form.title,
      description: form.description,
      skillTags: form.skillTags,
      branch: form.branch || undefined,
      type: form.type,
      level: form.level,
      url: embedUrl,
      thumbnailUrl: ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg` : undefined,
      durationMins: form.durationMins ? parseInt(form.durationMins) : undefined,
      uploadedAt: new Date().toISOString().slice(0, 10),
      views: 0,
    };

    uploadLearningResource(resource);
    setForm(emptyForm);
    setShowForm(false);
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3000);
  };

  const watchingResource = watchingId ? learningResources.find(r => r.id === watchingId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-5 h-5 text-navy-700" />
            <h1 className="text-2xl font-bold text-navy-900">Skill Learning Videos</h1>
          </div>
          <p className="text-sm text-gray-500">
            Upload and manage skill videos for <span className="font-semibold text-navy-700">{provider?.name || 'your institute'}</span> students. Videos are visible to all enrolled students under your institute.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setUploaded(false); }}
          className="btn-primary shrink-0 flex items-center gap-2"
          id="upload-video-btn"
        >
          <Plus className="w-4 h-4" /> Upload New Video
        </button>
      </div>

      {/* Success toast */}
      {uploaded && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Video uploaded successfully! Students can now access it in their Learning Resources section.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Videos', value: myResources.length, icon: <Video className="w-4 h-4" /> },
          { label: 'Total Views', value: myResources.reduce((s, r) => s + r.views, 0).toLocaleString(), icon: <Eye className="w-4 h-4" /> },
          { label: 'Skills Covered', value: [...new Set(myResources.flatMap(r => r.skillTags))].length, icon: <Tag className="w-4 h-4" /> },
          { label: 'Total Hours', value: `${Math.round(myResources.reduce((s, r) => s + (r.durationMins || 0), 0) / 60)}h`, icon: <Clock className="w-4 h-4" /> },
        ].map(stat => (
          <div key={stat.label} className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
              {stat.icon}
            </div>
            <div>
              <div className="text-xl font-bold text-navy-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="card p-6 border-2 border-navy-200 bg-navy-50/30">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-navy-700" />
              <h2 className="text-lg font-bold text-navy-900">Upload Skill Video</h2>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-lg font-bold px-1">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Title <span className="text-red-500">*</span></label>
                <input
                  id="video-title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 focus:border-navy-500 text-sm"
                  placeholder="e.g. Data Structures — Arrays & Linked Lists (NPTEL)"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              {/* URL */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL <span className="text-red-500">*</span></label>
                <input
                  id="video-url"
                  type="url"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 focus:border-navy-500 text-sm"
                  placeholder="https://youtube.com/watch?v=... or https://youtube.com/embed/..."
                  value={form.url}
                  onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">YouTube watch links are auto-converted to embeds. Direct video URLs also supported.</p>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 focus:border-navy-500 text-sm resize-none"
                  placeholder="What will students learn? Who is this video for?"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 text-sm bg-white"
                  value={form.type}
                  onChange={e => setForm(p => ({ ...p, type: e.target.value as ResourceType }))}
                >
                  <option value="VIDEO">🎥 Video</option>
                  <option value="PDF">📄 PDF / Document</option>
                  <option value="LINK">🔗 External Link</option>
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 text-sm bg-white"
                  value={form.level}
                  onChange={e => setForm(p => ({ ...p, level: e.target.value as ResourceLevel }))}
                >
                  <option value="BEGINNER">🟢 Beginner</option>
                  <option value="INTERMEDIATE">🟡 Intermediate</option>
                  <option value="ADVANCED">🔴 Advanced</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Branch</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 text-sm bg-white"
                  value={form.branch}
                  onChange={e => setForm(p => ({ ...p, branch: e.target.value }))}
                >
                  <option value="">All Branches</option>
                  {branchOptions.filter(Boolean).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min={1} max={480}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy-500 text-sm"
                  placeholder="e.g. 45"
                  value={form.durationMins}
                  onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))}
                />
              </div>
            </div>

            {/* Skill Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Tags <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(select all that apply)</span></label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[3rem]">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.skillTags.includes(skill)
                        ? 'bg-navy-700 text-white border-navy-700'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-navy-400'
                    }`}
                  >
                    {form.skillTags.includes(skill) && '✓ '}{skill}
                  </button>
                ))}
              </div>
              {form.skillTags.length > 0 && (
                <p className="text-xs text-navy-600 mt-1 font-medium">Selected: {form.skillTags.join(', ')}</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={!form.title || !form.url || form.skillTags.length === 0}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" /> Publish to Students
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video Player Modal */}
      {watchingResource && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 flex items-center justify-center p-4" onClick={() => setWatchingId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-navy-900 text-sm leading-tight">{watchingResource.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${levelColors[watchingResource.level]}`}>{watchingResource.level}</span>
                  {watchingResource.durationMins && <span className="text-xs text-gray-400">{watchingResource.durationMins} min</span>}
                </div>
              </div>
              <button onClick={() => setWatchingId(null)} className="text-gray-400 hover:text-gray-700 font-bold text-xl px-2">✕</button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={watchingResource.url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={watchingResource.title}
              />
            </div>
            {watchingResource.description && (
              <div className="p-4 text-sm text-gray-600 border-t border-gray-100">{watchingResource.description}</div>
            )}
          </div>
        </div>
      )}

      {/* Filter + Video Grid */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-navy-600" /> Your Published Videos ({myResources.length})
          </h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by skill..."
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-navy-500 w-44"
              value={filterSkill}
              onChange={e => setFilterSkill(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No videos yet.</p>
            <p className="text-sm mt-1">Click "Upload New Video" to add your first skill resource.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(resource => (
              <div key={resource.id} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                {/* Thumbnail */}
                <div
                  className="relative aspect-video bg-navy-950 cursor-pointer overflow-hidden"
                  onClick={() => setWatchingId(resource.id)}
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
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-navy-50 text-navy-700 rounded font-medium">{tag}</span>
                    ))}
                    {resource.skillTags.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">+{resource.skillTags.length - 3}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {resource.views}</span>
                      <span>{resource.uploadedAt}</span>
                    </div>
                    {resource.branch && (
                      <span className="text-[10px] text-blue-600 font-medium truncate max-w-[90px]">{resource.branch.replace(' Engineering', '')}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
