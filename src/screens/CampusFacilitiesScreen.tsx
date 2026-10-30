import React, { useState } from 'react';
import { UNIVERSITY_INFO, CampusFacility } from '../data/universityInfo';
import {
  Building2,
  BookOpen,
  HeartPulse,
  Home,
  Utensils,
  Trophy,
  Lightbulb,
  MapPin,
  CheckCircle2,
  Compass
} from 'lucide-react';

export const CampusFacilitiesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFacility, setActiveFacility] = useState<CampusFacility>(UNIVERSITY_INFO.facilities[0]);

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'academic', label: 'Academic' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'residential', label: 'Hostels' },
    { id: 'innovation', label: 'Incubation' },
    { id: 'lifestyle', label: 'Dining & Living' },
    { id: 'sports', label: 'Sports & Yoga' }
  ];

  const filtered = selectedCategory === 'all'
    ? UNIVERSITY_INFO.facilities
    : UNIVERSITY_INFO.facilities.filter(f => f.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'academic': return BookOpen;
      case 'healthcare': return HeartPulse;
      case 'residential': return Home;
      case 'lifestyle': return Utensils;
      case 'sports': return Trophy;
      case 'innovation': return Lightbulb;
      default: return Building2;
    }
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col pt-14 pb-4 px-4 sm:px-8 md:px-12 font-sans select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-ssu-border mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ssu-maroon/50 border border-ssu-gold/40 text-ssu-gold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              CAMPUS FACILITIES & GUIDANCE
            </h1>
            <p className="text-xs text-ssu-gold font-mono">
              Sri Sri University 188-Acre Integrated Holistic Campus
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-ssu-surface border border-ssu-border text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === c.id
                  ? 'bg-ssu-gold text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((fac) => {
            const Icon = getCategoryIcon(fac.category);
            const isSelected = activeFacility.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setActiveFacility(fac)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ssu-maroon border-ssu-gold text-white shadow-xl'
                    : 'bg-ssu-card border-ssu-border text-slate-300 hover:border-ssu-gold/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-ssu-gold text-black' : 'bg-black/50 text-ssu-gold border border-ssu-border'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold truncate leading-snug">{fac.name}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                      <MapPin className="w-3 h-3 text-ssu-gold flex-shrink-0" />
                      <span className="truncate">{fac.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-ssu-card border border-ssu-gold/40 shadow-2xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-ssu-maroon/60 border border-ssu-gold/40 text-ssu-gold font-bold uppercase tracking-wider inline-block mb-2">
                {activeFacility.category.toUpperCase()} INFRASTRUCTURE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{activeFacility.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono mt-1">
                <MapPin className="w-4 h-4 text-ssu-gold" />
                <span>{activeFacility.location}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-ssu-border">
            {activeFacility.description}
          </p>

          <div>
            <h3 className="text-xs font-bold text-ssu-gold uppercase tracking-wider mb-3">
              Facility Highlights & Student Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeFacility.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-ssu-surface border border-ssu-border text-xs text-slate-200 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-ssu-gold flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Guidance Notice */}
          <div className="p-4 rounded-xl bg-ssu-maroon/30 border border-ssu-gold/30 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-ssu-gold flex-shrink-0" />
              <span>Ask the AI Voice Assistant for real-time guidance to this facility.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
