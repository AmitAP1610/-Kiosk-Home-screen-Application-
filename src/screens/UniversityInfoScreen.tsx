import React, { useState } from 'react';
import { UNIVERSITY_INFO, AcademicFaculty } from '../data/universityInfo';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface UniversityInfoScreenProps {
  onNavigate?: (screen: any) => void;
  onSpeakText?: (text: string) => void;
}

export const UniversityInfoScreen: React.FC<UniversityInfoScreenProps> = ({
  onNavigate,
  onSpeakText
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'faculties' | 'vision' | 'contact'>('overview');
  const [selectedFaculty, setSelectedFaculty] = useState<AcademicFaculty>(UNIVERSITY_INFO.faculties[0]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#0d0705] to-[#04080c] text-white flex flex-col p-4 sm:p-6 md:p-8 font-sans select-none overflow-y-auto">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b-2 border-[#C8A451]/50 bg-black/80 p-3 rounded-2xl mb-6 gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Returning to robot hub.");
                onNavigate('hub');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#702815] border-2 border-[#C8A451]/70 text-slate-100 hover:text-white transition-all shadow-lg active:scale-95 text-xs sm:text-sm font-black"
              title="Return to Robot Hub"
            >
              <ArrowLeft className="w-5 h-5 text-[#C8A451]" />
              <span>Back to Hub</span>
            </button>
          )}

          <div className="p-2.5 rounded-xl bg-[#702815] border border-[#C8A451]/50 text-[#C8A451]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              UNIVERSITY INFORMATION
            </h1>
            <p className="text-xs text-[#C8A451] font-mono font-bold">
              Sri Sri University • Established under Odisha Act 15 of 2009
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ssu-surface border border-ssu-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-ssu-gold text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('faculties')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'faculties' ? 'bg-ssu-gold text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            11 Faculties
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'vision' ? 'bg-ssu-gold text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vision & Mission
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'contact' ? 'bg-ssu-gold text-black font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Admissions
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-ssu-card to-ssu-surface border border-ssu-border shadow-xl">
            <h2 className="text-lg font-bold text-ssu-gold flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <span>About Sri Sri University</span>
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {UNIVERSITY_INFO.name} ({UNIVERSITY_INFO.shortName}) was established in 2009 under the {UNIVERSITY_INFO.legislativeAct} by founder {UNIVERSITY_INFO.founder}. Nestled on a {UNIVERSITY_INFO.campusSize}, the university is pioneering a transformative model of higher education that synthesizes cutting-edge modern technology with timeless human values and mindful self-discovery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/50 border border-ssu-border">
                <span className="text-xs text-slate-400 block mb-1">Motto</span>
                <span className="text-base font-bold text-ssu-gold">{UNIVERSITY_INFO.motto}</span>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-ssu-border">
                <span className="text-xs text-slate-400 block mb-1">Campus Location</span>
                <span className="text-base font-bold text-white">Cuttack, Odisha</span>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-ssu-border">
                <span className="text-xs text-slate-400 block mb-1">Lifestyle & Philosophy</span>
                <span className="text-base font-bold text-emerald-400">100% Vegetarian & Green</span>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="p-6 rounded-2xl bg-ssu-card border border-ssu-border">
            <h3 className="text-base font-bold text-white mb-3">Pillars of Holistic Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UNIVERSITY_INFO.coreValues.map((val, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-ssu-surface border border-ssu-border flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-ssu-maroon/50 border border-ssu-gold/40 text-ssu-gold flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-slate-300 leading-relaxed">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Faculties & Programmes */}
      {activeTab === 'faculties' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Faculty List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {UNIVERSITY_INFO.faculties.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFaculty(fac)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFaculty.id === fac.id
                    ? 'bg-ssu-maroon border-ssu-gold text-white shadow-lg'
                    : 'bg-ssu-card border-ssu-border text-slate-300 hover:border-ssu-gold/40'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold leading-snug">{fac.name}</h4>
                  <div className="flex gap-1.5 mt-1">
                    {fac.degrees.map((d, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-ssu-gold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ssu-gold flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>

          {/* Right: Selected Faculty Details */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-ssu-card border border-ssu-gold/40 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-mono text-ssu-gold uppercase tracking-wider block mb-1">
                Academic Division
              </span>
              <h3 className="text-xl font-bold text-white">{selectedFaculty.name}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {selectedFaculty.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-ssu-gold uppercase tracking-wider mb-2">
                Available Degrees
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedFaculty.degrees.map((deg, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-ssu-maroon/60 border border-ssu-gold/50 text-white font-mono text-xs font-semibold"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-ssu-gold uppercase tracking-wider mb-2">
                Flagship Programmes
              </h4>
              <div className="space-y-2">
                {selectedFaculty.featuredPrograms.map((prog, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-ssu-surface border border-ssu-border text-xs text-slate-200 flex items-center gap-2.5"
                  >
                    <BookOpen className="w-4 h-4 text-ssu-gold flex-shrink-0" />
                    <span>{prog}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ssu-gold hover:bg-ssu-goldLight text-black text-xs font-bold transition-all"
              >
                <span>Apply for this Faculty</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vision & Mission */}
      {activeTab === 'vision' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-ssu-card border border-ssu-gold/40">
            <div className="inline-block px-3 py-1 rounded-full bg-ssu-gold/20 border border-ssu-gold/40 text-ssu-gold text-xs font-bold uppercase tracking-wider mb-3">
              Institutional Vision
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.vision}"
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ssu-card border border-ssu-gold/40">
            <div className="inline-block px-3 py-1 rounded-full bg-ssu-gold/20 border border-ssu-gold/40 text-ssu-gold text-xs font-bold uppercase tracking-wider mb-3">
              Institutional Mission
            </div>
            <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.mission}"
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-ssu-surface border border-ssu-border">
            <h3 className="text-sm font-bold text-ssu-gold uppercase tracking-wider mb-2">
              The Meaning of "Learn, Lead, Serve"
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {UNIVERSITY_INFO.mottoMeaning}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Admissions & Official Contacts */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-ssu-maroon to-[#2d0f07] border border-ssu-gold/40">
            <h3 className="text-lg font-bold text-white mb-2">Admissions Office & Enquiry</h3>
            <p className="text-xs text-slate-300 mb-4 max-w-xl">
              Applications for undergraduate, postgraduate, and doctoral degrees are open online. Contact our dedicated counselors or visit our campus.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-ssu-gold hover:bg-ssu-goldLight text-black font-bold text-xs flex items-center gap-2"
              >
                <span>Official Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="tel:+917894424562"
                className="px-5 py-2.5 rounded-xl bg-black/60 border border-ssu-gold/50 text-white font-bold text-xs flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-ssu-gold" />
                <span>+91-7894424562</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {UNIVERSITY_INFO.contacts.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-ssu-card border border-ssu-border space-y-2">
                <span className="text-xs font-bold text-ssu-gold block">{c.department}</span>
                {c.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.email}</span>
                </div>
                {c.location && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-ssu-surface border border-ssu-border flex items-center justify-between text-xs text-slate-400">
            <span>Official Campus Address: {UNIVERSITY_INFO.address.fullFormatted}</span>
            <a
              href={UNIVERSITY_INFO.officialLinks.contactUs}
              target="_blank"
              rel="noreferrer"
              className="text-ssu-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
