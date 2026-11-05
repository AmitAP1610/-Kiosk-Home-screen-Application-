import React, { useState } from 'react';
import { UNIVERSITY_INFO, CampusFacility } from '../data/universityInfo';
import {
  ArrowLeft,
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

interface CampusFacilitiesScreenProps {
  onNavigate?: (screen: any) => void;
  onSpeakText?: (text: string) => void;
}

export const CampusFacilitiesScreen: React.FC<CampusFacilitiesScreenProps> = ({
  onNavigate,
  onSpeakText
}) => {
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

  const getFacilityImage = (cat: string) => {
    switch (cat) {
      case 'academic': return '/images/gallery/central-library.jpg';
      case 'residential': return '/images/gallery/hostels-residence.jpg';
      case 'lifestyle': return '/images/gallery/cafeteria-vishwa-foods.jpg';
      case 'sports': return '/images/gallery/sports-ground-facilities.jpg';
      case 'healthcare': return '/images/gallery/university-infrastructure-g6.jpg';
      case 'innovation': return '/images/gallery/laboratory-practical-3.jpg';
      default: return '/images/gallery/campus-aerial-overview.jpg';
    }
  };

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-y-auto">
      {/* Top Header: Navy Blue Structural Bar (#263746) */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#263746] text-white px-4 sm:px-6 py-3 rounded-xl border border-white/10 shadow-sm mb-4 gap-3">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Returning to robot hub.");
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-semibold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#30343B] border border-white/10 text-[#C49A45]">
            <Building2 className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              Campus Facilities & Guidance
            </h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">
              Explore Academic, Healthcare, Hostels, and Dining Spaces
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[#30343B] border border-white/10 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-md transition-all font-semibold ${
                selectedCategory === c.id
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'text-[#E9EDF2]/70 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left List: White Cards */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((fac) => {
            const Icon = getCategoryIcon(fac.category);
            const isSelected = activeFacility.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setActiveFacility(fac)}
                className={`p-3 min-h-[44px] rounded-xl border transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-[#263746] text-white border-[#263746]'
                    : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-md ${
                      isSelected ? 'bg-[#30343B] text-[#C49A45]' : 'bg-[#E9EDF2] text-[#263746]'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-[14px] font-semibold truncate leading-snug ${isSelected ? 'text-white' : 'text-[#30343B]'}`}>
                      {fac.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-mono mt-0.5">
                      <MapPin className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#C49A45]' : 'text-[#606B76]'}`} />
                      <span className={`truncate ${isSelected ? 'text-white/80' : 'text-[#606B76]'}`}>{fac.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane: White Card */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm space-y-4">
          {/* Authentic Campus Photograph Banner */}
          <div className="w-full h-36 sm:h-44 rounded-lg overflow-hidden relative border border-[#D8DFE8]">
            <img
              src={getFacilityImage(activeFacility.category)}
              alt={activeFacility.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
              <span className="text-white text-xs font-mono font-semibold bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-white/20">
                SSU Infrastructure • {activeFacility.category.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#263746] text-white font-semibold uppercase tracking-wider inline-block mb-1.5">
                {activeFacility.category.toUpperCase()} INFRASTRUCTURE
              </span>
              <h2 className="text-[20px] font-semibold text-[#30343B]">{activeFacility.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-[#606B76] font-mono mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>{activeFacility.location}</span>
              </div>
            </div>
          </div>

          <p className="text-[14px] text-[#606B76] leading-relaxed bg-[#E9EDF2]/50 p-3 rounded-lg border border-[#D8DFE8]">
            {activeFacility.description}
          </p>

          <div>
            <h3 className="text-[14px] font-semibold text-[#30343B] uppercase tracking-wider mb-2">
              Facility Highlights & Student Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeFacility.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-[#E9EDF2]/40 border border-[#D8DFE8] text-xs text-[#606B76] flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#263746] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <span className="leading-snug text-[#30343B] font-medium text-[13px]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Guidance Notice */}
          <div className="p-3 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8] text-xs text-[#606B76] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#263746] flex-shrink-0" strokeWidth={1.75} />
              <span className="text-[13px]">Ask the AI Voice Assistant for real-time guidance to this facility.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
