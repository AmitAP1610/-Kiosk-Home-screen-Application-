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
  Navigation
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
        `Session: ${session.title}. Hosted by ${session.speaker}, at ${session.time} in ${session.venue}. ${session.description}`
      );
    }
  };

  const handleSpeakAllAgenda = () => {
    if (onSpeakText) {
      const todaySessions = CAMPUS_SESSIONS.filter(s => s.dateCategory === 'today');
      const titles = todaySessions.map(s => `${s.title} at ${s.time} in ${s.venue}`).join('. ');
      onSpeakText(`Today's university agenda includes: ${titles}.`);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#0d0914] to-[#04060c] text-white flex flex-col p-4 sm:p-6 md:p-8 font-sans select-none overflow-hidden">
      {/* HEADER: Back Button to Hub + Title + Voice Summary (Crisp & Sharp, No Blur) */}
      <header className="flex items-center justify-between border-b-2 border-[#C8A451]/60 pb-4 mb-4 bg-black/90 p-3 rounded-2xl shadow-xl">
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to hub menu.");
            onNavigate('hub');
          }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black hover:bg-[#702815] border-2 border-[#C8A451]/70 text-slate-100 hover:text-white transition-all shadow-xl active:scale-95 text-base sm:text-lg font-black"
        >
          <ArrowLeft className="w-6 h-6 text-[#C8A451]" />
          <span>Back to Hub</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span className="text-xl sm:text-3xl font-black text-white tracking-wide">
              SESSIONS & CAMPUS AGENDA
            </span>
            <span className="text-xs sm:text-sm font-mono px-3.5 py-1 rounded-full bg-indigo-900 border-2 border-indigo-400 text-indigo-200 font-black">
              SCHEDULE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#C8A451] font-mono font-bold hidden sm:block mt-1">
            Sri Sri University Academic Symposia, Robotics Demos, Meditation & Workshops
          </p>
        </div>

        <button
          onClick={handleSpeakAllAgenda}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 transition-all text-sm sm:text-base font-black shadow-xl ${
            isSpeaking
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 animate-pulse'
              : 'bg-black border-[#C8A451]/70 text-[#C8A451] hover:text-white'
          }`}
          title="Read Today's Agenda Aloud"
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">Read Agenda Aloud</span>
        </button>
      </header>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 bg-black/90 p-4 rounded-3xl border-2 border-slate-800 shadow-xl">
        {/* Date Selector Pills */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['today', 'tomorrow', 'upcoming', 'all'] as const).map((date) => (
            <button
              key={date}
              onClick={() => {
                if (onSpeakText) onSpeakText(`Showing ${date} agenda schedule.`);
                setSelectedDate(date);
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-black uppercase font-mono transition-all ${
                selectedDate === date
                  ? 'bg-[#C8A451] text-black shadow-lg scale-105 border-2 border-white'
                  : 'bg-black/80 text-slate-300 hover:text-white border-2 border-slate-800'
              }`}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => {
                if (onSpeakText) onSpeakText(track === 'all' ? "Showing all session tracks." : `Filtered by ${track} sessions.`);
                setSelectedTrack(track);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all ${
                selectedTrack === track
                  ? 'bg-indigo-600 text-white shadow-lg border-2 border-white'
                  : 'bg-black/60 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {track === 'all' ? 'All Tracks' : track}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-black/90 border-2 border-slate-700 text-sm sm:text-base w-full sm:w-72 shadow-inner">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search session or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white outline-none w-full placeholder:text-slate-400 font-sans font-medium"
          />
        </div>
      </div>

      {/* SESSIONS LIST GRID */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredSessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Calendar className="w-16 h-16 text-slate-600 mb-3" />
            <h3 className="text-xl font-black text-white mb-1">No sessions match your filter</h3>
            <p className="text-base text-slate-400">Try selecting a different date or clearing the search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {filteredSessions.map((session) => {
              const isLive = session.status === 'LIVE NOW';

              return (
                <div
                  key={session.id}
                  className={`p-7 rounded-3xl border-2 transition-all flex flex-col justify-between shadow-2xl ${
                    isLive
                      ? 'bg-gradient-to-br from-emerald-950/60 via-black to-black border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-950/95 border-slate-800 hover:border-indigo-400'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Track & Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-mono px-3.5 py-1.5 rounded-full bg-indigo-950 text-indigo-300 border-2 border-indigo-500/60 font-black uppercase tracking-wider">
                        {session.track}
                      </span>

                      <span
                        className={`text-xs sm:text-sm font-mono px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider flex items-center gap-2 ${
                          isLive
                            ? 'bg-emerald-950 text-emerald-300 border-2 border-emerald-500 animate-pulse'
                            : 'bg-black text-slate-300 border-2 border-slate-800'
                        }`}
                      >
                        {isLive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />}
                        <span>{session.status}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      {session.title}
                    </h3>

                    {/* Speaker */}
                    <div className="flex items-center gap-3.5 text-base text-slate-200">
                      <div className="w-10 h-10 rounded-full bg-[#702815] text-[#C8A451] flex items-center justify-center font-black text-sm border-2 border-[#C8A451]">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-black text-white block text-base sm:text-lg">{session.speaker}</span>
                        <span className="text-xs sm:text-sm text-[#C8A451] font-mono font-bold">{session.speakerRole}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium bg-black/70 p-4 rounded-2xl border border-slate-800">
                      {session.description}
                    </p>

                    {/* Time & Venue Info Box */}
                    <div className="grid grid-cols-2 gap-3 text-sm font-mono font-bold">
                      <div className="p-3.5 rounded-2xl bg-black/80 border-2 border-slate-800 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        <span className="text-white truncate">{session.time}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/80 border-2 border-slate-800 flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#C8A451] flex-shrink-0" />
                        <span className="text-white truncate">{session.venue.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center gap-3 pt-5 border-t-2 border-slate-800 mt-5">
                    <button
                      onClick={() => handleSpeakSession(session)}
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-black hover:bg-[#702815] border-2 border-[#C8A451]/60 text-sm sm:text-base font-black text-[#C8A451] hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>Speak Summary</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onSpeakText) onSpeakText(`Locating ${session.venue} on campus map.`);
                        onNavigate('map-info');
                      }}
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-[#C8A451] hover:bg-[#d6b464] text-black text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                    >
                      <Navigation className="w-5 h-5" />
                      <span>View on Map</span>
                    </button>
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
