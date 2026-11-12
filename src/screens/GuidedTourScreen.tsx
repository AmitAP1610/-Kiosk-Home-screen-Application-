import React, { useState, useEffect } from 'react';
import { AppScreen } from '../types/robot';
import {
  guidedTourService,
  CampusWaypoint,
  TourServiceState,
  PRESET_TOUR_SEQUENCES,
  TourSequencePlan
} from '../services/guidedTourService';
import {
  ArrowLeft,
  Navigation,
  Play,
  StopCircle,
  CheckCircle2,
  Volume2,
  VolumeX,
  History,
  RotateCcw,
  Building2,
  ArrowRight,
  Sparkles,
  Bot,
  Compass,
  Layers,
  X
} from 'lucide-react';

interface GuidedTourScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSpeakText?: (text: string, onEnd?: () => void) => void;
  isSpeaking?: boolean;
}

export const GuidedTourScreen: React.FC<GuidedTourScreenProps> = ({
  onNavigate,
  onSpeakText,
  isSpeaking = false
}) => {
  const [tourState, setTourState] = useState<TourServiceState>(guidedTourService.getState());
  const [selectedOrigin, setSelectedOrigin] = useState<CampusWaypoint>(guidedTourService.getWaypoints()[0]);
  const [selectedDest, setSelectedDest] = useState<CampusWaypoint>(guidedTourService.getWaypoints()[1]);
  const [activeTab, setActiveTab] = useState<'single' | 'sequence' | 'history'>('single');
  const [selectedSequencePlan, setSelectedSequencePlan] = useState<TourSequencePlan>(PRESET_TOUR_SEQUENCES[0]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = guidedTourService.subscribe((state) => {
      setTourState(state);
    });
    return () => unsubscribe();
  }, []);

  const waypoints = guidedTourService.getWaypoints();

  const handleStartDirectMission = () => {
    guidedTourService.startMission(selectedOrigin, selectedDest, onSpeakText);
  };

  const handleStartSequenceTour = (plan: TourSequencePlan) => {
    guidedTourService.startSequencePlan(plan, onSpeakText);
  };

  const handleConfirmArrival = () => {
    guidedTourService.reachDestination(onSpeakText);
  };

  const handleProceedNext = () => {
    guidedTourService.proceedToNextStop(onSpeakText);
  };

  const handleCancelMission = () => {
    guidedTourService.cancelMission();
  };

  const handleReplayBriefing = () => {
    if (onSpeakText && tourState.destination.arrivalAnnouncement) {
      onSpeakText(tourState.destination.arrivalAnnouncement);
    }
  };

  const isMultiStop = tourState.sequence.length > 2;
  const isLastStop = tourState.sequenceIndex >= tourState.sequence.length - 1;

  return (
    <div className="w-full h-full bg-[#E9EDF2] text-[#30343B] flex flex-col p-3 sm:p-4 md:p-5 font-sans select-none overflow-hidden">
      {/* ======================================================== */}
      {/* 1. TOP APP BAR: Navy Blue (#263746)                      */}
      {/* ======================================================== */}
      <header className="relative z-10 flex items-center justify-between bg-[#263746] text-white px-3 sm:px-5 py-2.5 rounded-xl border border-white/10 shadow-sm shrink-0 mb-3">
        {/* Left: Back to Hub */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (tourState.stage === 'EN_ROUTE' || tourState.stage === 'INTRODUCING') {
                if (window.confirm('Active escort mission in progress. Cancel and return to hub?')) {
                  handleCancelMission();
                  onNavigate('hub');
                }
              } else {
                onNavigate('hub');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[40px] rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white transition-all shadow-xs active:scale-98 text-xs font-semibold"
            title="Return to Robot Hub"
          >
            <ArrowLeft className="w-4 h-4 text-[#C49A45]" />
            <span>Hub</span>
          </button>

          <div className="p-1.5 rounded-md bg-[#30343B] border border-white/10 text-[#C49A45] hidden sm:block">
            <Compass className="w-4 h-4 text-[#C49A45]" />
          </div>
          <div>
            <h1 className="text-[15px] sm:text-[17px] font-bold text-white tracking-tight leading-tight flex items-center gap-2">
              <span>Autonomous Guest Escort</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-[#C49A45] text-white font-bold uppercase tracking-wider hidden md:inline">
                Point A → Point B
              </span>
            </h1>
            <p className="text-[11px] text-[#E9EDF2]/80 font-mono">
              Sri Sri University Robotics Club • Sequential Campus Guide
            </p>
          </div>
        </div>

        {/* Right Action Tools: Stage Badge, Audio Mute, History */}
        <div className="flex items-center gap-2">
          {/* Active Mission Stage Badge */}
          <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${
            tourState.stage === 'INTRODUCING'
              ? 'bg-[#C49A45] text-white animate-pulse'
              : tourState.stage === 'EN_ROUTE'
              ? 'bg-sky-600 text-white animate-pulse'
              : tourState.stage === 'ARRIVED'
              ? 'bg-emerald-600 text-white'
              : tourState.stage === 'COMPLETED'
              ? 'bg-purple-600 text-white'
              : 'bg-[#30343B] text-[#E9EDF2]'
          }`}>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{tourState.stage.replace('_', ' ')}</span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => guidedTourService.toggleMute()}
            className={`p-2 rounded-lg border transition-all active:scale-95 ${
              tourState.isAudioMuted
                ? 'bg-red-900/60 border-red-500 text-white'
                : 'bg-[#30343B] hover:bg-[#202124] border-white/10 text-white'
            }`}
            title={tourState.isAudioMuted ? 'Unmute Robot Voice' : 'Mute Robot Voice'}
          >
            {tourState.isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#C49A45]" />
            )}
          </button>

          {/* Mission History Button */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#30343B] hover:bg-[#202124] border border-white/10 text-white text-xs font-mono transition-all shadow-xs"
            title="View Stored Sequential Mission History"
          >
            <History className="w-3.5 h-3.5 text-[#C49A45]" />
            <span className="hidden sm:inline">Stored ({tourState.completedMissions.length})</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE / STATE MACHINE DISPATCHER             */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {/* STAGE A: IDLE - Plan & Configure Escort Mission */}
        {tourState.stage === 'IDLE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
            {/* Left: Origin & Destination Selector (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#D8DFE8] p-4 flex flex-col justify-between shadow-xs">
              <div>
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-2 p-1 bg-[#E9EDF2] rounded-lg mb-4">
                  <button
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'single'
                        ? 'bg-[#263746] text-white shadow-xs'
                        : 'text-[#606B76] hover:text-[#30343B]'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Point A → Point B (Direct)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('sequence')}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'sequence'
                        ? 'bg-[#263746] text-white shadow-xs'
                        : 'text-[#606B76] hover:text-[#30343B]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Sequential Multi-Stop Tour</span>
                  </button>
                </div>

                {activeTab === 'single' ? (
                  <div className="space-y-4">
                    {/* Origin Selection (Point A) */}
                    <div>
                      <label className="text-[11px] font-mono font-bold text-[#606B76] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#263746] text-white text-[10px] font-mono font-bold flex items-center justify-center">A</span>
                          <span>Start Origin (Current Location)</span>
                        </span>
                        <span className="text-emerald-700 font-normal">Active Pickup</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {waypoints.map((wp) => {
                          const isSelected = selectedOrigin.id === wp.id;
                          return (
                            <button
                              key={wp.id}
                              onClick={() => setSelectedOrigin(wp)}
                              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#263746] bg-[#263746] text-white shadow-xs'
                                  : 'border-[#E9EDF2] hover:border-[#D8DFE8] bg-white text-[#30343B]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold truncate">
                                <span>Point {wp.code}: {wp.name.split('&')[0]}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E9EDF2] text-[#606B76]'}`}>
                                  {wp.category}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Destination Selection (Point B) */}
                    <div>
                      <label className="text-[11px] font-mono font-bold text-[#606B76] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#C49A45] text-white text-[10px] font-mono font-bold flex items-center justify-center">B</span>
                          <span>Destination Goal (End Point)</span>
                        </span>
                        <span className="text-[#C49A45] font-normal">Arrival Briefing Stored</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto pr-1">
                        {waypoints.map((wp) => {
                          const isSelected = selectedDest.id === wp.id;
                          return (
                            <button
                              key={wp.id}
                              onClick={() => setSelectedDest(wp)}
                              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#C49A45] bg-[#C49A45] text-white shadow-xs'
                                  : 'border-[#E9EDF2] hover:border-[#D8DFE8] bg-white text-[#30343B]'
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs font-bold truncate">
                                <span>Point {wp.code}: {wp.name.split('&')[0]}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E9EDF2] text-[#606B76]'}`}>
                                  {wp.category}
                                </span>
                              </div>
                              <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-white/90' : 'text-[#606B76]'}`}>
                                {wp.briefing.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Multi-Stop Sequence Plans */
                  <div className="space-y-3">
                    <span className="text-xs text-[#606B76] block mb-2">
                      Select a curated multi-stop sequential tour. The robot will guide guests stop by stop, announce arrivals, and provide stored building briefings in order:
                    </span>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                      {PRESET_TOUR_SEQUENCES.map((plan) => {
                        const isSelected = selectedSequencePlan.id === plan.id;
                        return (
                          <button
                            key={plan.id}
                            onClick={() => setSelectedSequencePlan(plan)}
                            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#263746] bg-[#263746] text-white shadow-xs'
                                : 'border-[#E9EDF2] hover:border-[#D8DFE8] bg-white text-[#30343B]'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-xs mb-1">
                              <span className="flex items-center gap-1.5">
                                <Sparkles className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C49A45]' : 'text-[#263746]'}`} />
                                {plan.name}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E9EDF2] text-[#606B76]'}`}>
                                {plan.stops.length} Stops in Sequence
                              </span>
                            </div>
                            <p className={`text-[11px] mb-2 ${isSelected ? 'text-white/80' : 'text-[#606B76]'}`}>
                              {plan.description}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] font-mono">
                              {plan.stops.map((stop, i) => (
                                <React.Fragment key={stop.id}>
                                  <span className={`px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/25 text-white' : 'bg-[#E9EDF2] text-[#30343B]'}`}>
                                    {stop.code}
                                  </span>
                                  {i < plan.stops.length - 1 && <span className={isSelected ? 'text-white/50' : 'text-gray-400'}>→</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Start Mission Button */}
              <div className="pt-3 mt-3 border-t border-[#E9EDF2]">
                {activeTab === 'single' ? (
                  <button
                    onClick={handleStartDirectMission}
                    className="w-full min-h-[46px] py-3 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current text-[#C49A45]" />
                    <span>START GUIDED ESCORT (POINT {selectedOrigin.code} → POINT {selectedDest.code})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartSequenceTour(selectedSequencePlan)}
                    className="w-full min-h-[46px] py-3 rounded-xl bg-[#C49A45] hover:bg-[#B38734] text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>LAUNCH SEQUENTIAL TOUR ({selectedSequencePlan.stops.length} STOPS)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Route Telemetry & Briefing Preview (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#D8DFE8] p-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-2">
                  <span className="font-bold text-[#263746] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-[#C49A45]" />
                    <span>Mission Route & Voice Script</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Nav2 Ready
                  </span>
                </div>

                {/* Route Overview Path */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606B76]">Est. Straight Distance:</span>
                    <span className="font-bold text-[#263746]">
                      {Math.hypot(
                        selectedDest.coordinates.x - selectedOrigin.coordinates.x,
                        selectedDest.coordinates.y - selectedOrigin.coordinates.y
                      ).toFixed(1)} meters
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606B76]">Est. Transit Duration:</span>
                    <span className="font-bold text-[#263746]">~25 - 40 seconds</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#606B76]">Navigation Controller:</span>
                    <span className="font-bold text-[#263746]">Jetson ROS 2 Nav2</span>
                  </div>
                </div>

                {/* Spoken Intro Script Preview */}
                <div className="p-3 rounded-xl bg-[#E9EDF2]/40 border border-[#D8DFE8] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#263746] uppercase tracking-wider block flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#C49A45]" />
                    <span>Spoken Introduction Script (Stage 1)</span>
                  </span>
                  <p className="text-xs text-[#30343B] italic leading-relaxed">
                    "{selectedDest.introText}"
                  </p>
                </div>

                {/* Stored Arrival Briefing Preview */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Stored Arrival Briefing (Stage 3 End Point)</span>
                  </span>
                  <p className="text-xs text-[#30343B] italic leading-relaxed">
                    "{selectedDest.arrivalAnnouncement}"
                  </p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="text-[11px] text-[#606B76] font-mono text-center pt-2">
                All landmark coordinates and audio briefings stored permanently on tablet.
              </div>
            </div>
          </div>
        )}

        {/* STAGE B: INTRODUCING - Speaking Welcome & Mission Start */}
        {tourState.stage === 'INTRODUCING' && (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-[#D8DFE8] shadow-xs text-center space-y-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#263746] border-4 border-[#C49A45] flex items-center justify-center shadow-lg animate-pulse">
                <Bot className="w-12 h-12 text-[#C49A45]" />
              </div>
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                1
              </span>
            </div>

            <div className="max-w-xl space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#C49A45]/20 text-[#263746] font-mono font-bold text-xs uppercase tracking-wider">
                Stage 1 • Spoken Introduction
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#263746]">
                Introducing Mission: Point {tourState.origin.code} → Point {tourState.destination.code}
              </h2>
              <p className="text-xs text-[#606B76] font-mono">
                Calibrated Baritone Voice Audio Output Active
              </p>
            </div>

            {/* Live Spoken Transcript Card */}
            <div className={`max-w-2xl w-full p-4 rounded-xl bg-[#F8FAFC] border ${isSpeaking ? 'border-[#C49A45] ring-2 ring-[#C49A45]/30' : 'border-[#E2E8F0]'} shadow-xs transition-all`}>
              <div className="flex items-center justify-center gap-2 mb-2 text-[#C49A45]">
                <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-[#C49A45]' : 'text-[#263746]'}`} />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#263746]">
                  Robot Spoken Speech {isSpeaking ? '(Voice Active)' : ''}
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#30343B] font-medium italic leading-relaxed">
                "{tourState.activeSpeechText}"
              </p>
            </div>

            {/* Skip to En Route button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => guidedTourService.transitionToEnRoute()}
                className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Skip Speech & Start Moving</span>
                <ArrowRight className="w-4 h-4 text-[#C49A45]" />
              </button>

              <button
                onClick={handleCancelMission}
                className="px-4 py-2.5 rounded-xl bg-[#B42318] hover:bg-red-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE C: EN_ROUTE - Active Escort Navigation In-Transit */}
        {tourState.stage === 'EN_ROUTE' && (
          <div className="h-full flex flex-col justify-between p-4 bg-white rounded-xl border border-[#D8DFE8] shadow-xs space-y-4">
            {/* Top Sequence Progress Header */}
            <div className="flex items-center justify-between border-b border-[#E9EDF2] pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#263746]">
                  <span className="w-6 h-6 rounded-full bg-[#263746] text-white text-xs font-mono flex items-center justify-center">
                    {tourState.origin.code}
                  </span>
                  <span>{tourState.origin.name.split('&')[0]}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C49A45]" />
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#C49A45]">
                  <span className="w-6 h-6 rounded-full bg-[#C49A45] text-white text-xs font-mono flex items-center justify-center">
                    {tourState.destination.code}
                  </span>
                  <span>{tourState.destination.name.split('&')[0]}</span>
                </div>
              </div>

              {isMultiStop && (
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#263746] text-white font-bold">
                  Stop {tourState.sequenceIndex} of {tourState.sequence.length - 1}
                </span>
              )}
            </div>

            {/* In-Transit Radar & Telemetry Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center flex-1">
              {/* Telemetry Left */}
              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#606B76] block mb-0.5">Remaining Distance:</span>
                  <span className="text-2xl font-bold text-[#263746]">
                    {tourState.distanceRemainingMeters} <span className="text-sm font-normal">meters</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] text-[#606B76] block mb-0.5">Elapsed Escort Time:</span>
                  <span className="text-xl font-bold text-[#263746]">
                    {tourState.durationSeconds} <span className="text-sm font-normal">seconds</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
                  <span className="text-[11px] font-bold block mb-0.5">Nav2 Controller Status:</span>
                  <span className="text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    Tracking Trajectory (0.35 m/s)
                  </span>
                </div>
              </div>

              {/* Animated Radar Center */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-sky-400 bg-radial from-sky-900/10 via-[#263746]/5 to-transparent flex items-center justify-center">
                  {/* Concentric distance rings */}
                  <div className="absolute inset-4 rounded-full border border-sky-300/40" />
                  <div className="absolute inset-12 rounded-full border border-sky-300/50" />
                  <div className="absolute inset-20 rounded-full border border-sky-300/60" />

                  {/* Pulsing robot center */}
                  <div className="w-10 h-10 rounded-full bg-[#C49A45] border-2 border-white flex items-center justify-center text-white shadow-md z-10 animate-pulse">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>

                  {/* Target Pin at Edge */}
                  <div className="absolute top-4 right-8 w-8 h-8 rounded-full bg-[#263746] text-white flex items-center justify-center text-xs font-bold font-mono border-2 border-white shadow-md">
                    {tourState.destination.code}
                  </div>
                </div>
                <span className="text-xs font-mono text-[#606B76] mt-2">
                  Obstacle Avoidance Active • Speed Locked
                </span>
              </div>

              {/* Spoken Guidance Prompt Right */}
              <div className="p-4 rounded-xl bg-[#E9EDF2]/50 border border-[#D8DFE8] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#263746] uppercase tracking-wider block flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#C49A45]" />
                  <span>In-Transit Voice Guidance</span>
                </span>
                <p className="text-xs text-[#30343B] italic leading-relaxed">
                  "{tourState.destination.inTransitText}"
                </p>
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-[#606B76] mb-1 flex justify-between">
                    <span>Route Completion:</span>
                    <span className="font-bold text-[#263746]">{tourState.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#D8DFE8] overflow-hidden">
                    <div
                      className="h-full bg-[#263746] transition-all duration-300 rounded-full"
                      style={{ width: `${tourState.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Manual Arrival & Cancel */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E9EDF2]">
              <button
                onClick={handleCancelMission}
                className="px-4 py-2.5 rounded-xl bg-[#B42318] hover:bg-red-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <StopCircle className="w-4 h-4" />
                <span>Cancel Mission</span>
              </button>

              <button
                onClick={handleConfirmArrival}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                title="Trigger Destination Arrival and Deliver Stored Briefing"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM ARRIVAL AT POINT {tourState.destination.code}</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE D: ARRIVED - Destination Reached & Rich Briefing Delivered */}
        {tourState.stage === 'ARRIVED' && (
          <div className="h-full flex flex-col justify-between p-4 bg-white rounded-xl border border-emerald-300 shadow-sm space-y-4">
            {/* Top Celebration Banner */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold leading-tight">
                    Destination Reached: Point {tourState.destination.code} ({tourState.destination.name})
                  </h2>
                  <p className="text-xs text-emerald-800 font-mono">
                    Autonomous Escort Completed • On-Site Facility Briefing Active
                  </p>
                </div>
              </div>

              <button
                onClick={handleReplayBriefing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                title="Replay Spoken Arrival Briefing"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay Voice</span>
              </button>
            </div>

            {/* Robot Spoken Announcement Quote Box */}
            <div className={`p-3.5 rounded-xl bg-[#263746] text-white border ${isSpeaking ? 'border-[#C49A45] ring-2 ring-[#C49A45]/30' : 'border-[#30343B]'} space-y-1 shadow-xs transition-all`}>
              <div className="flex items-center gap-1.5 text-[#C49A45] font-mono text-xs font-bold uppercase tracking-wider">
                <Bot className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-[#C49A45]' : 'text-[#C49A45]'}`} />
                <span>Robot Arrival Speech (Baritone Engine) {isSpeaking ? '• Speaking Now' : ''}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E9EDF2] italic leading-relaxed">
                "{tourState.activeSpeechText}"
              </p>
            </div>

            {/* Rich Destination Briefing Sheet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-y-auto">
              {/* Column 1: Overview */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#263746] uppercase tracking-wider block">
                  Building & Facility Overview
                </span>
                <p className="text-xs text-[#30343B] leading-relaxed">
                  {tourState.destination.briefing.description}
                </p>
                <div className="pt-2 border-t border-[#E2E8F0] text-xs font-mono text-[#606B76] space-y-1">
                  <div><strong>Hours:</strong> {tourState.destination.briefing.hours}</div>
                  {tourState.destination.briefing.contactDesk && (
                    <div><strong>Contact:</strong> {tourState.destination.briefing.contactDesk}</div>
                  )}
                </div>
              </div>

              {/* Column 2: Faculties & Departments Inside */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#263746] uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Faculties & Departments Inside</span>
                </span>
                <ul className="space-y-1.5 text-xs text-[#30343B]">
                  {tourState.destination.briefing.facultiesInside.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] mt-1 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Key Features & Amenities */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <span className="text-[11px] font-mono font-bold text-[#263746] uppercase tracking-wider block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Key Landmarks & Amenities</span>
                </span>
                <ul className="space-y-1.5 text-xs text-[#30343B]">
                  {tourState.destination.briefing.keyHighlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E9EDF2]">
              <button
                onClick={() => guidedTourService.completeTour()}
                className="px-4 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Finish & Return to Hub</span>
              </button>

              {isMultiStop && !isLastStop ? (
                <button
                  onClick={handleProceedNext}
                  className="px-6 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#B38734] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <span>PROCEED TO NEXT STOP: POINT {tourState.sequence[tourState.sequenceIndex + 1].code}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('hub')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMPLETE TOUR & ENTER HUB</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* STAGE E: COMPLETED - Mission Finished Summary */}
        {tourState.stage === 'COMPLETED' && (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-[#D8DFE8] shadow-xs text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#263746]">
                Campus Guided Escort Mission Completed
              </h2>
              <p className="text-xs text-[#606B76] font-mono">
                All sequential waypoints were safely navigated and verified on tablet.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('hub')}
                className="px-6 py-2.5 rounded-xl bg-[#263746] hover:bg-[#1D2B37] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Return to Campus Hub</span>
              </button>

              <button
                onClick={() => guidedTourService.cancelMission()}
                className="px-5 py-2.5 rounded-xl bg-[#E9EDF2] hover:bg-[#D8DFE8] text-[#30343B] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start New Mission</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. STORED MISSION HISTORY MODAL                          */}
      {/* ======================================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white text-[#30343B] rounded-2xl border border-[#D8DFE8] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-[#263746] text-white border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#C49A45]" />
                <h3 className="font-bold text-sm">Stored Escort Missions & Sequential Logs</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {tourState.completedMissions.length === 0 ? (
                <div className="text-center py-8 text-[#606B76] text-xs font-mono space-y-1">
                  <p>No escort missions recorded yet.</p>
                  <p className="text-[11px] text-gray-400">Completed missions will be saved here automatically in sequence.</p>
                </div>
              ) : (
                tourState.completedMissions.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-[#E9EDF2] bg-[#F8FAFC] flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-[#263746]">
                        <span className="w-5 h-5 rounded-full bg-[#263746] text-white text-[10px] font-mono flex items-center justify-center">
                          {m.origin.code}
                        </span>
                        <span>{m.origin.name.split('&')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C49A45]" />
                        <span className="w-5 h-5 rounded-full bg-[#C49A45] text-white text-[10px] font-mono flex items-center justify-center">
                          {m.destination.code}
                        </span>
                        <span>{m.destination.name.split('&')[0]}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#606B76] flex items-center gap-3">
                        <span>{new Date(m.timestamp).toLocaleTimeString()} • {new Date(m.timestamp).toLocaleDateString()}</span>
                        <span>Distance: {m.distanceTraveledMeters}m</span>
                        <span>Duration: {m.durationSeconds}s</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800">
                      {m.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              {tourState.completedMissions.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Clear all stored mission history?')) {
                      guidedTourService.clearHistory();
                    }
                  }}
                  className="text-xs text-red-600 hover:underline font-mono"
                >
                  Clear History
                </button>
              )}
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 rounded-lg bg-[#263746] text-white text-xs font-bold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
