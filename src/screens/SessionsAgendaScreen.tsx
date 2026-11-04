import React, { useState } from 'react';
import { AppScreen } from '../types/robot';
import { CAMPUS_SESSIONS, CampusSession } from '../data/sessionsData';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Volume2,
  Search,
  Sparkles,
  CheckCircle2,
  Ticket,
  Users,
  Compass
} from 'lucide-react';

interface SessionsAgendaScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
}

export const SessionsAgendaScreen: React.FC<SessionsAgendaScreenProps> = ({
  onNavigate,
  onSpeakText,
  isSpeaking = false
}) => {
  const [selectedDate, setSelectedDate] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('today');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = ['all', 'Robotics & AI', 'Academic', 'Wellness', 'Cultural', 'Orientation'];

  const filteredSessions = CAMPUS_SESSIONS.filter((session) => {
    const matchesDate = selectedDate === 'all' || session.dateCategory === selectedDate;
    const matchesTrack = selectedTrack === 'all' || session.track === selectedTrack;
    const matchesSearch =
      searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesTrack && matchesSearch;
  });

  const handleSpeakSession = (session: CampusSession) => {
    if (onSpeakText) {
      onSpeakText(
        `Session: ${session.title}. Hosted by ${session.speaker}, at ${session.time} in ${session.venue}. Highlights include: ${session.highlights.join('. ')}. ${session.description}`
      );
    }
  };

  const handleSpeakAllAgenda = () => {
    if (onSpeakText) {
      const todaySessions = CAMPUS_SESSIONS.filter(s => s.dateCategory === 'today');
      const titles = todaySessions.map(s => `${s.title} at ${s.time} in ${sessionVenueBasename(s.venue)}`).join('. ');
      onSpeakText(`Today's university agenda features: ${titles}.`);
    }
  };

  const sessionVenueBasename = (venue: string) => venue.split(',')[0];

  return (
    <div className="w-full h-full bg-[#FFFFFF] text-[#30343B] flex flex-col p-3 sm:p-5 md:p-6 font-sans select-none overflow-hidden relative">
      {/* HEADER: Industrial Primary Bar */}
      <header className="relative z-10 flex items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-3 rounded-xl border border-[#B0B4B8]/30 shadow-sm mb-3">
        {/* Back Button */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#DCE8E1]" />
          <span>Back to Hub</span>
        </button>

        {/* Center Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-lg md:text-xl font-extrabold text-white tracking-wide">
              CAMPUS SESSIONS & TIMETABLE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#174D3A] text-white font-bold uppercase tracking-wider">
              LIVE AGENDA
            </span>
          </div>
          <p className="text-[11px] text-[#B0B4B8] font-mono mt-0.5 hidden sm:block">
            Sri Sri University • Robotics Demos, Symposia, Meditation & Workshops
          </p>
        </div>

        {/* Right Voice Button */}
        <button
          onClick={handleSpeakAllAgenda}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all text-xs sm:text-sm font-bold shadow-sm ${
            isSpeaking
              ? 'bg-[#174D3A] border-[#174D3A] text-white'
              : 'bg-[#202124] border-[#B0B4B8]/40 text-white hover:bg-[#17191C]'
          }`}
          title="Read Today's Agenda Aloud"
        >
          <Volume2 className="w-4 h-4 text-[#DCE8E1]" />
          <span className="hidden sm:inline">Read Agenda Aloud</span>
        </button>
      </header>

      {/* FILTER & SEARCH BAR: Clean White Card */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-2.5 mb-3 bg-[#FFFFFF] p-2.5 rounded-xl border border-[#B0B4B8]/60 shadow-sm">
        {/* Date Selector Pills (Forest Green active) */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['today', 'tomorrow', 'upcoming', 'all'] as const).map((date) => (
            <button
              key={date}
              onClick={() => {
                if (onSpeakText) onSpeakText(`Showing ${date} agenda schedule.`);
                setSelectedDate(date);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono transition-all ${
                selectedDate === date
                  ? 'bg-[#174D3A] text-white shadow-sm'
                  : 'bg-[#FFFFFF] text-[#30343B] hover:bg-[#DCE8E1]/30 border border-[#B0B4B8]/50'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => {
                if (onSpeakText) onSpeakText(track === 'all' ? "Showing all session tracks." : `Filtered by ${track} sessions.`);
                setSelectedTrack(track);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedTrack === track
                  ? 'bg-[#174D3A] text-white shadow-sm'
                  : 'bg-[#FFFFFF] text-[#5F666D] hover:text-[#30343B] hover:bg-[#DCE8E1]/30 border border-[#B0B4B8]/50'
              }`}
            >
              {track === 'all' ? 'All Tracks' : track}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#B0B4B8]/60 text-xs w-full md:w-60 shadow-sm">
          <Search className="w-3.5 h-3.5 text-[#174D3A]" />
          <input
            type="text"
            placeholder="Search session or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[#30343B] outline-none w-full placeholder:text-[#5F666D] font-sans font-medium text-xs"
          />
        </div>
      </div>

      {/* SESSIONS LIST GRID */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredSessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#5F666D]">
            <Calendar className="w-12 h-12 text-[#174D3A] mb-2" />
            <h3 className="text-base font-bold text-[#30343B] mb-1">No sessions match your filter</h3>
            <p className="text-xs text-[#5F666D]">Try selecting a different date or clearing the search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
            {filteredSessions.map((session) => {
              const isLive = session.status === 'LIVE NOW';

              return (
                <div
                  key={session.id}
                  className="rounded-xl border border-[#B0B4B8]/60 hover:border-[#174D3A] bg-[#FFFFFF] text-[#30343B] overflow-hidden transition-all flex flex-col justify-between shadow-card"
                >
                  {/* Top Photo Banner */}
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden">
                    <img
                      src={session.image}
                      alt={session.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202124]/80 via-transparent to-black/20" />

                    {/* Track Badge & Live Status */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#30343B] text-white font-bold uppercase tracking-wider shadow-sm">
                        {session.track}
                      </span>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                          isLive
                            ? 'bg-[#174D3A] text-white'
                            : 'bg-[#202124]/90 text-[#B0B4B8] border border-[#B0B4B8]/30'
                        }`}
                      >
                        {isLive && <span className="w-2 h-2 rounded-full bg-[#DCE8E1] animate-pulse" />}
                        <span>{session.status}</span>
                      </span>
                    </div>

                    {/* Duration / Seats Overlay */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#202124]/90 border border-[#B0B4B8]/30">
                        <Clock className="w-3 h-3 text-[#DCE8E1]" />
                        <span className="font-semibold text-white">{session.duration}</span>
                      </div>
                      {session.seatsAvailable && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#202124]/90 border border-[#B0B4B8]/30 text-white">
                          <Users className="w-3 h-3 text-[#B0B4B8]" />
                          <span className="font-semibold">{session.seatsAvailable} Seats Left</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[#30343B] leading-snug">
                        {session.title}
                      </h3>

                      {/* Speaker */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#DCE8E1] text-[#174D3A] flex items-center justify-center font-bold text-xs border border-[#174D3A]/20">
                          <User className="w-4 h-4 text-[#174D3A]" />
                        </div>
                        <div>
                          <span className="font-bold text-[#30343B] block text-xs sm:text-sm">{session.speaker}</span>
                          <span className="text-[11px] text-[#5F666D] font-mono">{session.speakerRole}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#5F666D] leading-relaxed bg-[#DCE8E1]/20 p-2.5 rounded-lg border border-[#B0B4B8]/40">
                        {session.description}
                      </p>

                      {/* Key Highlights */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#5F666D] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#174D3A]" />
                          <span>Session Highlights:</span>
                        </span>
                        <div className="space-y-0.5">
                          {session.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-[#5F666D]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Time & Venue */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-semibold pt-0.5">
                        <div className="p-2 rounded-lg bg-[#DCE8E1]/20 border border-[#B0B4B8]/40 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0" />
                          <span className="text-[#30343B] truncate">{session.time}</span>
                        </div>

                        <div className="p-2 rounded-lg bg-[#DCE8E1]/20 border border-[#B0B4B8]/40 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0" />
                          <span className="text-[#30343B] truncate">{sessionVenueBasename(session.venue)}</span>
                        </div>
                      </div>

                      {/* Entry Requirement Badge */}
                      <div className="p-2 rounded-lg bg-[#DCE8E1]/20 border border-[#B0B4B8]/40 flex items-center gap-1.5 text-[11px] font-mono text-[#5F666D]">
                        <Ticket className="w-3.5 h-3.5 text-[#174D3A] flex-shrink-0" />
                        <span className="font-semibold text-[#30343B]">{session.entryRequirement}</span>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#B0B4B8]/30 mt-2">
                      <button
                        onClick={() => handleSpeakSession(session)}
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-[#B0B4B8]/40 text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#DCE8E1]" />
                        <span>Speak Overview</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onSpeakText) onSpeakText(`Viewing facility guide for ${session.venue}.`);
                          onNavigate('map-info');
                        }}
                        className="flex-1 py-2.5 px-3 rounded-lg bg-[#174D3A] hover:bg-[#134232] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm"
                      >
                        <Compass className="w-3.5 h-3.5 text-white" />
                        <span>Explore Venue</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
