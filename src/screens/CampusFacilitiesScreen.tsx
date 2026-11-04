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

  return (
    <div className="w-full h-full bg-[#FFFFFF] text-[#30343B] flex flex-col p-3 sm:p-5 md:p-6 font-sans select-none overflow-y-auto">
      {/* Top Header: Industrial Primary Bar */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-3 rounded-xl border border-[#B0B4B8]/30 shadow-sm mb-4 gap-3">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Returning to robot hub.");
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98 text-xs font-bold"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-4 h-4 text-[#DCE8E1]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-1.5 rounded-md bg-[#202124] border border-[#B0B4B8]/30 text-[#DCE8E1]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
              CAMPUS FACILITIES & GUIDANCE
            </h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">
              Explore Academic, Healthcare, Hostels, and Dining Spaces
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-md transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#174D3A] text-white font-bold'
                  : 'text-[#B0B4B8] hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left List: Crisp White Cards */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((fac) => {
            const Icon = getCategoryIcon(fac.category);
            const isSelected = activeFacility.id === fac.id;
            return (
              <div
                key={fac.id}
                onClick={() => setActiveFacility(fac)}
                className={`p-3 rounded-xl border transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-[#30343B] text-white border-[#30343B]'
                    : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-md ${
                      isSelected ? 'bg-[#202124] text-[#DCE8E1]' : 'bg-[#DCE8E1]/40 text-[#174D3A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xs font-bold truncate leading-snug ${isSelected ? 'text-white' : 'text-[#30343B]'}`}>
                      {fac.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                      <MapPin className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#DCE8E1]' : 'text-[#174D3A]'}`} />
                      <span className={`truncate ${isSelected ? 'text-[#B0B4B8]' : 'text-[#5F666D]'}`}>{fac.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane: Crisp White Card */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-bold uppercase tracking-wider inline-block mb-1.5">
                {activeFacility.category.toUpperCase()} INFRASTRUCTURE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#30343B]">{activeFacility.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-[#5F666D] font-mono mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#174D3A]" />
                <span>{activeFacility.location}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5F666D] leading-relaxed bg-[#FFFFFF] p-3 rounded-lg border border-[#B0B4B8]/40">
            {activeFacility.description}
          </p>

          <div>
            <h3 className="text-xs font-bold text-[#30343B] uppercase tracking-wider mb-2">
              Facility Highlights & Student Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeFacility.highlights.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40 text-xs text-[#5F666D] flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug text-[#30343B] font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Guidance Notice */}
          <div className="p-3 rounded-lg bg-[#DCE8E1]/20 border border-[#B0B4B8]/40 text-xs text-[#5F666D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#174D3A] flex-shrink-0" />
              <span>Ask the AI Voice Assistant for real-time guidance to this facility.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
