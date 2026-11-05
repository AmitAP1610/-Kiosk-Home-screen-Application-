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
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-4 sm:p-5 md:p-6 font-sans select-none overflow-hidden relative">
      {/* HEADER: Navy Blue Structural Bar (#263746) */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-white/10 shadow-sm mb-3">
        {/* Back Button */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[44px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
          <span>Back to Hub</span>
        </button>

        {/* Center Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
              Campus Sessions & Timetable
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C49A45] text-white font-semibold uppercase tracking-wider">
              LIVE AGENDA
            </span>
          </div>
          <p className="text-[12px] text-[#E9EDF2]/80 mt-0.5 hidden sm:block">
            Sri Sri University • Robotics Demos, Symposia, Meditation & Workshops
          </p>
        </div>

        {/* Right Voice Button */}
        <button
          onClick={handleSpeakAllAgenda}
          className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-lg border transition-all text-xs sm:text-sm font-semibold shadow-sm ${
            isSpeaking
              ? 'bg-[#C49A45] border-[#C49A45] text-white'
              : 'bg-[#30343B] border-white/10 text-white hover:bg-[#202124]'
          }`}
          title="Read Today's Agenda Aloud"
        >
          <Volume2 className="w-4 h-4 text-[#E9EDF2]" />
          <span className="hidden sm:inline">Read Agenda Aloud</span>
        </button>
      </header>

      {/* FILTER & SEARCH BAR: Clean White Card */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-2.5 mb-3 bg-white p-2.5 rounded-xl border border-[#E9EDF2] shadow-sm">
        {/* Date Selector Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['today', 'tomorrow', 'upcoming', 'all'] as const).map((date) => (
            <button
              key={date}
              onClick={() => {
                if (onSpeakText) onSpeakText(`Showing ${date} agenda schedule.`);
                setSelectedDate(date);
              }}
              className={`px-3 py-1.5 min-h-[40px] rounded-lg text-xs font-semibold uppercase font-mono transition-all ${
                selectedDate === date
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'bg-[#E9EDF2] text-[#30343B] hover:bg-[#D8DFE8]'
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
              className={`px-2.5 py-1 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTrack === track
                  ? 'bg-[#263746] text-white shadow-sm'
                  : 'bg-[#E9EDF2] text-[#606B76] hover:text-[#30343B] hover:bg-[#D8DFE8]'
              }`}
            >
              {track === 'all' ? 'All Tracks' : track}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E9EDF2] border border-[#D8DFE8] text-xs w-full md:w-64">
          <Search className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search session or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[#30343B] outline-none w-full placeholder:text-[#606B76] font-sans font-medium text-xs"
          />
        </div>
      </div>

      {/* SESSIONS LIST GRID */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredSessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#606B76]">
            <Calendar className="w-12 h-12 text-[#263746] mb-2" strokeWidth={1.5} />
            <h3 className="text-[18px] font-semibold text-[#30343B] mb-1">No sessions match your filter</h3>
            <p className="text-[14px] text-[#606B76]">Try selecting a different date or clearing the search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {filteredSessions.map((session) => {
              const isLive = session.status === 'LIVE NOW';

              return (
                <div
                  key={session.id}
                  className="rounded-xl border border-[#E9EDF2] hover:border-[#263746] bg-white text-[#30343B] overflow-hidden transition-all flex flex-col justify-between shadow-sm"
                >
                  {/* Top Photo Banner */}
                  <div className="relative h-40 sm:h-44 w-full overflow-hidden">
                    <img
                      src={session.image}
                      alt={session.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Track Badge & Live Status */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-[#263746] text-white font-semibold uppercase tracking-wider shadow-sm">
                        {session.track}
                      </span>

                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                          isLive
                            ? 'bg-[#C49A45] text-white'
                            : 'bg-[#30343B]/90 text-white'
                        }`}
                      >
                        {isLive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                        <span>{session.status}</span>
                      </span>
                    </div>

                    {/* Duration / Seats Overlay */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#30343B]/90">
                        <Clock className="w-3 h-3 text-[#C49A45]" strokeWidth={2} />
                        <span className="font-medium text-white">{session.duration}</span>
                      </div>
                      {session.seatsAvailable && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#30343B]/90">
                          <Users className="w-3 h-3 text-[#C49A45]" strokeWidth={2} />
                          <span>{session.seatsAvailable} seats</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-[18px] font-semibold text-[#30343B] leading-snug">
                        {session.title}
                      </h3>

                      {/* Time, Venue & Speaker Pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8]">
                          <Clock className="w-4 h-4 text-[#263746] flex-shrink-0" strokeWidth={1.75} />
                          <span className="font-medium text-[#30343B]">{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8]">
                          <MapPin className="w-4 h-4 text-[#C49A45] flex-shrink-0" strokeWidth={1.75} />
                          <span className="truncate text-[#606B76]">{session.venue}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-[#E9EDF2]/50 border border-[#D8DFE8] text-[13px]">
                        <User className="w-4 h-4 text-[#263746] flex-shrink-0" strokeWidth={1.75} />
                        <span className="text-[#30343B] font-medium">{session.speaker}</span>
                        {session.speakerRole && <span className="text-[#606B76] text-xs">({session.speakerRole})</span>}
                      </div>

                      <p className="text-[14px] text-[#606B76] leading-relaxed">
                        {session.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[12px] text-[#30343B] font-semibold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C49A45]" />
                          <span>Session Highlights:</span>
                        </span>
                        <div className="space-y-0.5">
                          {session.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[14px] text-[#606B76]">
                              <CheckCircle2 className="w-4 h-4 text-[#263746] flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Navy Blue #263746 */}
                    <div className="pt-3 border-t border-[#E9EDF2] flex items-center gap-2.5">
                      <button
                        onClick={() => handleSpeakSession(session)}
                        className="flex-1 min-h-[44px] py-2 px-3 rounded-lg bg-[#263746] hover:bg-[#1D2B37] text-white text-[15px] font-medium flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
                      >
                        <Volume2 className="w-4 h-4 text-[#C49A45]" />
                        <span>Hear Details</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onSpeakText) onSpeakText(`Opening campus facilities to explore venue: ${sessionVenueBasename(session.venue)}`);
                          onNavigate('map-info');
                        }}
                        className="px-3.5 min-h-[44px] py-2 rounded-lg bg-white border border-[#E9EDF2] hover:border-[#263746] text-[#263746] font-medium text-[14px] flex items-center gap-1.5 transition-all shadow-sm active:scale-98"
                        title="Explore Venue on Campus Highlights"
                      >
                        <Compass className="w-4 h-4 text-[#263746]" strokeWidth={1.75} />
                        <span className="hidden sm:inline">Venue</span>
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
