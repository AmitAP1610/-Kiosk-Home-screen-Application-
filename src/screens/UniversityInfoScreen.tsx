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
            <GraduationCap className="w-5 h-5 text-[#C49A45]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
              University Information
            </h1>
            <p className="text-[12px] text-[#E9EDF2]/80 font-mono">
              Sri Sri University • Established under Odisha Act 15 of 2009
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#30343B] border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-[#263746] text-white font-semibold shadow-sm' : 'text-[#E9EDF2]/70 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('faculties')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'faculties' ? 'bg-[#263746] text-white font-semibold shadow-sm' : 'text-[#E9EDF2]/70 hover:text-white'
            }`}
          >
            11 Faculties
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'vision' ? 'bg-[#263746] text-white font-semibold shadow-sm' : 'text-[#E9EDF2]/70 hover:text-white'
            }`}
          >
            Vision & Mission
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'contact' ? 'bg-[#263746] text-white font-semibold shadow-sm' : 'text-[#E9EDF2]/70 hover:text-white'
            }`}
          >
            Admissions
          </button>
        </div>
      </header>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Authentic Campus Overview Banner */}
          <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border border-[#D8DFE8] shadow-sm">
            <img
              src="/images/gallery/academic-architecture.jpg"
              alt="Sri Sri University Campus Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4 sm:p-5">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-bold uppercase tracking-wider inline-block mb-1">
                  188-Acre Hilltop Campus
                </span>
                <h3 className="text-white text-base sm:text-lg font-bold">
                  Sri Sri University • Cuttack, Odisha
                </h3>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <h2 className="text-[20px] font-semibold text-[#30343B] flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#C49A45]" />
              <span>About Sri Sri University</span>
            </h2>
            <p className="text-[15px] text-[#606B76] leading-relaxed mb-4">
              {UNIVERSITY_INFO.name} ({UNIVERSITY_INFO.shortName}) was established in 2009 under the {UNIVERSITY_INFO.legislativeAct} by founder {UNIVERSITY_INFO.founder}. Nestled on a {UNIVERSITY_INFO.campusSize}, the university is pioneering a transformative model of higher education that synthesizes cutting-edge modern technology with timeless human values and mindful self-discovery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] block mb-0.5 font-semibold">Motto</span>
                <span className="text-[15px] font-medium text-[#263746]">{UNIVERSITY_INFO.motto}</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] block mb-0.5 font-semibold">Campus Location</span>
                <span className="text-[15px] font-medium text-[#30343B]">Cuttack, Odisha</span>
              </div>
              <div className="p-3.5 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8]">
                <span className="text-[12px] text-[#606B76] block mb-0.5 font-semibold">Campus Lifestyle</span>
                <span className="text-[15px] font-medium text-[#30343B]">100% Vegetarian & Green</span>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <h3 className="text-[18px] font-semibold text-[#30343B] mb-2.5">Pillars of Holistic Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {UNIVERSITY_INFO.coreValues.map((val, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8] flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-[#263746] text-white flex items-center justify-center flex-shrink-0 text-[11px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-[14px] text-[#606B76] leading-relaxed font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Faculties & Programmes */}
      {activeTab === 'faculties' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Faculty List */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {UNIVERSITY_INFO.faculties.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setSelectedFaculty(fac)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                  selectedFaculty.id === fac.id
                    ? 'bg-[#263746] text-white border-[#263746]'
                    : 'bg-white border-[#E9EDF2] text-[#30343B] hover:border-[#263746]'
                }`}
              >
                <div>
                  <h4 className="text-[14px] font-semibold leading-snug">{fac.name}</h4>
                  <div className="flex gap-1 mt-1">
                    {fac.degrees.map((d, i) => (
                      <span key={i} className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${selectedFaculty.id === fac.id ? 'bg-[#30343B] text-white' : 'bg-[#E9EDF2] text-[#263746]'}`}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-1.5 ${selectedFaculty.id === fac.id ? 'text-[#C49A45]' : 'text-[#606B76]'}`} />
              </div>
            ))}
          </div>

          {/* Right: Selected Faculty Details */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm space-y-3.5">
            <div>
              <span className="text-[12px] font-mono text-[#C49A45] uppercase tracking-wider block mb-0.5 font-semibold">
                Academic Division
              </span>
              <h3 className="text-[20px] font-semibold text-[#30343B]">{selectedFaculty.name}</h3>
              <p className="text-[14px] text-[#606B76] mt-1.5 leading-relaxed">
                {selectedFaculty.description}
              </p>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-[#30343B] uppercase tracking-wider mb-1.5">
                Available Degrees
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFaculty.degrees.map((deg, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded bg-[#E9EDF2] border border-[#D8DFE8] text-[#263746] font-mono text-xs font-semibold"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-[#30343B] uppercase tracking-wider mb-1.5">
                Flagship Programmes
              </h4>
              <div className="space-y-1.5">
                {selectedFaculty.featuredPrograms.map((prog, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8] text-xs text-[#606B76] flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#263746] flex-shrink-0" strokeWidth={1.75} />
                    <span className="text-[#30343B] font-medium text-[14px]">{prog}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white text-[14px] font-medium transition-all shadow-sm border border-[#263746]"
              >
                <span>Apply for this Faculty</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vision & Mission */}
      {activeTab === 'vision' && (
        <div className="space-y-4">
          {/* Authentic Campus Greenery Banner */}
          <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-[#D8DFE8] shadow-sm">
            <img
              src="/images/gallery/campus-greenery-lawns.jpg"
              alt="Sri Sri University Green Lawns"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-bold uppercase tracking-wider inline-block mb-1">
                  Guiding Philosophy
                </span>
                <h3 className="text-white text-base sm:text-lg font-bold">
                  Holistic Higher Education & Value-Based Leadership
                </h3>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <div className="inline-block px-2.5 py-0.5 rounded bg-[#263746] text-white text-xs font-semibold uppercase tracking-wider mb-2.5">
              Institutional Vision
            </div>
            <p className="text-[15px] text-[#606B76] font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.vision}"
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <div className="inline-block px-2.5 py-0.5 rounded bg-[#263746] text-white text-xs font-semibold uppercase tracking-wider mb-2.5">
              Institutional Mission
            </div>
            <p className="text-[15px] text-[#606B76] font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.mission}"
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <h3 className="text-[16px] font-semibold text-[#30343B] uppercase tracking-wider mb-1.5">
              The Meaning of "Learn, Lead, Serve"
            </h3>
            <p className="text-[14px] text-[#606B76] leading-relaxed">
              {UNIVERSITY_INFO.mottoMeaning}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Admissions & Official Contacts */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] shadow-sm">
            <h3 className="text-[18px] font-semibold text-[#30343B] mb-1.5">Admissions Office & Enquiry</h3>
            <p className="text-[14px] text-[#606B76] mb-3 max-w-xl leading-relaxed">
              Applications for undergraduate, postgraduate, and doctoral degrees are open online. Contact our dedicated counselors or visit our campus.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 min-h-[44px] rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
              >
                <span>Official Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="tel:+917894424562"
                className="px-4 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>+91-7894424562</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UNIVERSITY_INFO.contacts.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white text-[#30343B] border border-[#E9EDF2] space-y-1.5 shadow-sm">
                <span className="text-[14px] font-semibold text-[#30343B] block">{c.department}</span>
                {c.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-[#606B76]">
                    <Phone className="w-3.5 h-3.5 text-[#263746]" />
                    <span>{c.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#606B76]">
                  <Mail className="w-3.5 h-3.5 text-[#263746]" />
                  <span>{c.email}</span>
                </div>
                {c.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#606B76]">
                    <MapPin className="w-3.5 h-3.5 text-[#C49A45]" />
                    <span>{c.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-white text-[#606B76] border border-[#E9EDF2] flex items-center justify-between text-xs shadow-sm">
            <span>Official Campus Address: {UNIVERSITY_INFO.address.fullFormatted}</span>
            <a
              href={UNIVERSITY_INFO.officialLinks.contactUs}
              target="_blank"
              rel="noreferrer"
              className="text-[#263746] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3 text-[#263746]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
