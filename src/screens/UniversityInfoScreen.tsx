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
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide">
              UNIVERSITY INFORMATION
            </h1>
            <p className="text-[11px] text-[#B0B4B8] font-mono">
              Sri Sri University • Established under Odisha Act 15 of 2009
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#202124] border border-[#B0B4B8]/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('faculties')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'faculties' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
            }`}
          >
            11 Faculties
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'vision' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
            }`}
          >
            Vision & Mission
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'contact' ? 'bg-[#174D3A] text-white font-bold' : 'text-[#B0B4B8] hover:text-white'
            }`}
          >
            Admissions
          </button>
        </div>
      </header>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-[#30343B] flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-[#174D3A]" />
              <span>About Sri Sri University</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5F666D] leading-relaxed mb-4">
              {UNIVERSITY_INFO.name} ({UNIVERSITY_INFO.shortName}) was established in 2009 under the {UNIVERSITY_INFO.legislativeAct} by founder {UNIVERSITY_INFO.founder}. Nestled on a {UNIVERSITY_INFO.campusSize}, the university is pioneering a transformative model of higher education that synthesizes cutting-edge modern technology with timeless human values and mindful self-discovery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] block mb-0.5">Motto</span>
                <span className="text-xs sm:text-sm font-bold text-[#174D3A]">{UNIVERSITY_INFO.motto}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] block mb-0.5">Campus Location</span>
                <span className="text-xs sm:text-sm font-bold text-[#30343B]">Cuttack, Odisha</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40">
                <span className="text-[10px] font-mono text-[#5F666D] block mb-0.5">Campus Lifestyle</span>
                <span className="text-xs sm:text-sm font-bold text-[#30343B]">100% Vegetarian & Green</span>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-[#30343B] mb-2.5">Pillars of Holistic Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {UNIVERSITY_INFO.coreValues.map((val, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded bg-[#30343B] text-[#DCE8E1] flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-[#5F666D] leading-relaxed font-medium">{val}</span>
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
                    ? 'bg-[#30343B] text-white border-[#30343B]'
                    : 'bg-[#FFFFFF] border-[#B0B4B8]/60 text-[#30343B] hover:border-[#174D3A]'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold leading-snug">{fac.name}</h4>
                  <div className="flex gap-1 mt-1">
                    {fac.degrees.map((d, i) => (
                      <span key={i} className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${selectedFaculty.id === fac.id ? 'bg-[#202124] text-white' : 'bg-[#DCE8E1]/40 text-[#174D3A]'}`}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-1.5 ${selectedFaculty.id === fac.id ? 'text-[#DCE8E1]' : 'text-[#5F666D]'}`} />
              </div>
            ))}
          </div>

          {/* Right: Selected Faculty Details */}
          <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm space-y-3.5">
            <div>
              <span className="text-[10px] font-mono text-[#174D3A] uppercase tracking-wider block mb-0.5 font-bold">
                Academic Division
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#30343B]">{selectedFaculty.name}</h3>
              <p className="text-xs text-[#5F666D] mt-1.5 leading-relaxed">
                {selectedFaculty.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#30343B] uppercase tracking-wider mb-1.5">
                Available Degrees
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFaculty.degrees.map((deg, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded bg-[#DCE8E1]/40 border border-[#B0B4B8]/40 text-[#174D3A] font-mono text-xs font-semibold"
                  >
                    {deg}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#30343B] uppercase tracking-wider mb-1.5">
                Flagship Programmes
              </h4>
              <div className="space-y-1.5">
                {selectedFaculty.featuredPrograms.map((prog, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/40 text-xs text-[#5F666D] flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0" />
                    <span className="text-[#30343B] font-medium">{prog}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white text-xs font-bold transition-all shadow-sm border border-[#174D3A]"
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
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <div className="inline-block px-2.5 py-0.5 rounded bg-[#174D3A] text-white text-xs font-bold uppercase tracking-wider mb-2.5">
              Institutional Vision
            </div>
            <p className="text-xs sm:text-sm text-[#5F666D] font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.vision}"
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <div className="inline-block px-2.5 py-0.5 rounded bg-[#174D3A] text-white text-xs font-bold uppercase tracking-wider mb-2.5">
              Institutional Mission
            </div>
            <p className="text-xs sm:text-sm text-[#5F666D] font-serif italic leading-relaxed">
              "{UNIVERSITY_INFO.mission}"
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <h3 className="text-xs font-bold text-[#30343B] uppercase tracking-wider mb-1.5">
              The Meaning of "Learn, Lead, Serve"
            </h3>
            <p className="text-xs text-[#5F666D] leading-relaxed">
              {UNIVERSITY_INFO.mottoMeaning}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Admissions & Official Contacts */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 shadow-sm">
            <h3 className="text-base font-bold text-[#30343B] mb-1.5">Admissions Office & Enquiry</h3>
            <p className="text-xs text-[#5F666D] mb-3 max-w-xl">
              Applications for undergraduate, postgraduate, and doctoral degrees are open online. Contact our dedicated counselors or visit our campus.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={UNIVERSITY_INFO.officialLinks.admissions}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <span>Official Admissions Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href="tel:+917894424562"
                className="px-4 py-2 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-[#B0B4B8]/40 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#DCE8E1]" />
                <span>+91-7894424562</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UNIVERSITY_INFO.contacts.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FFFFFF] text-[#30343B] border border-[#B0B4B8]/60 space-y-1.5 shadow-sm">
                <span className="text-xs font-bold text-[#30343B] block">{c.department}</span>
                {c.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-[#5F666D]">
                    <Phone className="w-3 h-3 text-[#174D3A]" />
                    <span>{c.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#5F666D]">
                  <Mail className="w-3 h-3 text-[#174D3A]" />
                  <span>{c.email}</span>
                </div>
                {c.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#5F666D]">
                    <MapPin className="w-3 h-3 text-[#174D3A]" />
                    <span>{c.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#FFFFFF] text-[#5F666D] border border-[#B0B4B8]/60 flex items-center justify-between text-xs shadow-sm">
            <span>Official Campus Address: {UNIVERSITY_INFO.address.fullFormatted}</span>
            <a
              href={UNIVERSITY_INFO.officialLinks.contactUs}
              target="_blank"
              rel="noreferrer"
              className="text-[#30343B] hover:text-[#174D3A] flex items-center gap-1 font-semibold"
            >
              <span>View Map</span>
              <ExternalLink className="w-3 h-3 text-[#174D3A]" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
