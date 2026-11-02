import React, { useState, useEffect, useRef } from 'react';
import { AppScreen } from '../types/robot';
import L from 'leaflet';
import {
  ArrowLeft,
  MapPin,
  Building,
  ExternalLink,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  HeartPulse,
  Utensils,
  Home,
  Trophy,
  TreePine,
  Search,
  Sparkles,
  Layers,
  LocateFixed
} from 'lucide-react';

interface MapInfoScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
}

export interface RealLandmark {
  id: string;
  name: string;
  category: 'academic' | 'dining' | 'admin' | 'healthcare' | 'hostels' | 'sports' | 'landmark' | 'spiritual';
  lat: number;
  lng: number;
  coordinatesStr: string;
  description: string;
  speechGuidance: string;
  highlights: string[];
  icon: any;
  markerColor: string;
  verificationStatus: 'verified' | 'pending';
}

const SSU_CENTER: [number, number] = [20.451382, 85.798232];

export const REAL_LANDMARKS: RealLandmark[] = [
  {
    id: 'shruti-complex',
    name: 'Shruti Academic Complex & Central Library',
    category: 'academic',
    lat: 20.45185,
    lng: 85.79812,
    coordinatesStr: '20.45185° N, 85.79812° E',
    description: 'The principal academic hub housing multidisciplinary lecture theatres, faculty secretariats, and the Central Library with over 50,000 volumes, e-journals, and research carrels.',
    speechGuidance: 'This is the Shruti Academic Complex. It is our central academic hub housing smart lecture halls and the University Central Library.',
    highlights: ['Central University Library', 'President Secretariat', 'Smart AV Lecture Theatres', 'Wheelchair Accessible Ramp'],
    icon: BookOpen,
    markerColor: '#00f3ff',
    verificationStatus: 'verified'
  },
  {
    id: 'kaivalya-dining',
    name: 'Kaivalya Central Dining Hall',
    category: 'dining',
    lat: 20.45240,
    lng: 85.79755,
    coordinatesStr: '20.45240° N, 85.79755° E',
    description: '100% vegetarian Sattvic campus dining hall catering fresh, nutritious meals cooked with organic farm produce and A2 milk from the campus Gaushala.',
    speechGuidance: 'This is Kaivalya Dining Hall, serving nutritious one hundred percent pure vegetarian Sattvic meals prepared with organic ingredients.',
    highlights: ['Sattvic Vegetarian Cuisine', 'Large Seating Capacity', 'Clean Filtered Water Stations', 'Eco Composting'],
    icon: Utensils,
    markerColor: '#f59e0b',
    verificationStatus: 'verified'
  },
  {
    id: 'admin-block',
    name: 'Administrative Block (VC Secretariat)',
    category: 'admin',
    lat: 20.45095,
    lng: 85.79860,
    coordinatesStr: '20.45095° N, 85.79860° E',
    description: 'Central administrative headquarters housing the Vice-Chancellor Secretariat, Executive Registrar, Admissions Helpdesk, Finance, and Examination Divisions.',
    speechGuidance: 'Here is the Administrative Block. You will find the Vice-Chancellor office, Registrar secretariat, and student admissions helpdesk here.',
    highlights: ['Admissions Office', 'Vice-Chancellor Chamber', 'Student Affairs Desk', 'Visitors Waiting Lounge'],
    icon: Building,
    markerColor: '#C8A451',
    verificationStatus: 'verified'
  },
  {
    id: 'ayurveda-hospital',
    name: 'Sri Sri Ayurveda Hospital (100+ Beds)',
    category: 'healthcare',
    lat: 20.44980,
    lng: 85.79920,
    coordinatesStr: '20.44980° N, 85.79920° E',
    description: 'State-of-the-art 100+ bed Ayurvedic teaching and multispecialty healthcare hospital providing 24/7 emergency medical care, authentic Panchakarma therapies, and pathology labs.',
    speechGuidance: 'This is Sri Sri Ayurveda Hospital with over one hundred inpatient beds, offering twenty-four seven medical care, Panchakarma therapies, and pharmacy.',
    highlights: ['100+ Inpatient Beds', '24/7 Casualty & Doctor On-Call', 'Panchakarma Treatment Suites', 'Pharmacy'],
    icon: HeartPulse,
    markerColor: '#10b981',
    verificationStatus: 'verified'
  },
  {
    id: 'robotics-club-lab',
    name: 'SSU Robotics Club Maker Lab',
    category: 'academic',
    lat: 20.45145,
    lng: 85.79895,
    coordinatesStr: '20.45145° N, 85.79895° E',
    description: 'The creative robotics innovation workshop where student engineers of the Sri Sri University Robotics Club designed, assembled, and programmed this Kiosk robot.',
    speechGuidance: 'Welcome to the Sri Sri University Robotics Club Maker Lab, where passionate student engineers designed and brought me to life!',
    highlights: ['Robotics Club Headquarters', 'Autonomous Rover Prototyping', '3D Printing & Electronics Workbench', 'ROS 2 & AI Testbed'],
    icon: Sparkles,
    markerColor: '#C8A451',
    verificationStatus: 'verified'
  },
  {
    id: 'hostels-complex',
    name: 'Halls of Residence (Student Hostels)',
    category: 'hostels',
    lat: 20.45320,
    lng: 85.79680,
    coordinatesStr: '20.45320° N, 85.79680° E',
    description: 'Modern, secure on-campus student residences including Ambar, Kadambari, Aravali, HB 4, and Shivaji Bhavan with Wi-Fi, study halls, and laundry.',
    speechGuidance: 'These are the Halls of Residence, providing safe, vibrant on-campus student accommodation with round-the-clock security and Wi-Fi.',
    highlights: ['24/7 Security & CCTV', 'Wi-Fi & Common Study Rooms', 'Recreation Halls', 'Separate Boys & Girls Wings'],
    icon: Home,
    markerColor: '#3b82f6',
    verificationStatus: 'verified'
  },
  {
    id: 'sports-arena',
    name: 'Sports Complex & Gymnasium',
    category: 'sports',
    lat: 20.45380,
    lng: 85.79940,
    coordinatesStr: '20.45380° N, 85.79940° E',
    description: 'Expansive sports facilities including a cricket oval, football pitch, standard basketball & tennis courts, indoor badminton courts, and modern fitness center.',
    speechGuidance: 'This is the University Sports Arena, featuring our cricket ground, basketball courts, badminton courts, and fitness gymnasium.',
    highlights: ['Full-size Cricket Ground', 'Floodlit Basketball & Tennis', 'Indoor Badminton Courts', 'Fitness Gym'],
    icon: Trophy,
    markerColor: '#ef4444',
    verificationStatus: 'verified'
  },
  {
    id: 'oat-amphitheatre',
    name: 'Open-Air Theatre (OAT)',
    category: 'academic',
    lat: 20.45285,
    lng: 85.79830,
    coordinatesStr: '20.45285° N, 85.79830° E',
    description: 'Terraced open amphitheatre overlooking the hilltop valley, hosting cultural evenings, annual Orion festivals, satsangs, and youth convocations.',
    speechGuidance: 'Here is the Open-Air Theatre, our scenic hilltop amphitheatre where university cultural festivals like Orion and musical events take place.',
    highlights: ['Terraced Hillside Seating', 'Acoustic Sound Shell', 'Host of Orion Fest', 'Panoramic Sunset View'],
    icon: Sparkles,
    markerColor: '#ec4899',
    verificationStatus: 'verified'
  },
  {
    id: 'campus-gaushala',
    name: 'Campus Gaushala & Organic Farm',
    category: 'spiritual',
    lat: 20.45420,
    lng: 85.79580,
    coordinatesStr: '20.45420° N, 85.79580° E',
    description: 'Spiritual and ecological sanctuary preserving indigenous Gir, Sahiwal, and Desi cows providing fresh A2 dairy products for the campus dining halls.',
    speechGuidance: 'This is the Campus Gaushala, an indigenous cow sanctuary providing fresh organic dairy for our university community.',
    highlights: ['Indigenous Cow Preservation', 'Organic Manure Composting', 'Ethical Dairy Operations', 'Veterinary Care'],
    icon: TreePine,
    markerColor: '#84cc16',
    verificationStatus: 'verified'
  },
  {
    id: 'iconic-tower',
    name: 'Iconic Tower (Flagship Project)',
    category: 'landmark',
    lat: 20.45110,
    lng: 85.79720,
    coordinatesStr: 'Location verification required',
    description: 'Upcoming 300,000 sq ft signature academic skyscraper planned to house next-generation artificial intelligence labs, design studios, and smart lecture theatres.',
    speechGuidance: 'This is the upcoming three hundred thousand square foot Iconic Tower. It is a flagship academic project currently under development.',
    highlights: ['300,000 sq ft Built-Up Area', 'Emerging Tech Research Labs', 'Architectural Landmark', 'Surveyor Mapping In-Progress'],
    icon: Building,
    markerColor: '#f97316',
    verificationStatus: 'pending'
  }
];

export const MapInfoScreen: React.FC<MapInfoScreenProps> = ({
  onNavigate,
  onSpeakText,
  isSpeaking = false
}) => {
  const [selectedLandmark, setSelectedLandmark] = useState<RealLandmark>(REAL_LANDMARKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'map' | 'basic-info'>('map');
  const [mapLayer, setMapLayer] = useState<'dark' | 'satellite' | 'street'>('dark');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const filteredLandmarks = REAL_LANDMARKS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize Real Leaflet Map
  useEffect(() => {
    if (activeTab !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: SSU_CENTER,
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layer if updating
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Tile Layer selection
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    if (mapLayer === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 18;
    } else if (mapLayer === 'street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    const tileLayer = L.tileLayer(tileUrl, { maxZoom }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Add Markers for all real landmarks
    REAL_LANDMARKS.forEach((l) => {
      const isSelected = selectedLandmark.id === l.id;
      const isPending = l.verificationStatus === 'pending';

      const customIcon = L.divIcon({
        className: 'ssu-custom-pin',
        html: `
          <div style="
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              border-radius: 50%;
              background: ${isSelected ? '#702815' : isPending ? '#7c2d12' : '#0a1a24'};
              border: 2px solid ${isSelected ? '#C8A451' : l.markerColor};
              box-shadow: 0 0 16px ${isSelected ? '#C8A451' : l.markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${isSelected ? '#C8A451' : l.markerColor};
              font-weight: bold;
              font-size: ${isSelected ? '14px' : '11px'};
              transition: all 0.3s;
            ">
              ★
            </div>
            <div style="
              margin-top: 3px;
              background: rgba(0,0,0,0.85);
              color: ${isSelected ? '#C8A451' : '#ffffff'};
              border: 1px solid ${isSelected ? '#C8A451' : 'rgba(255,255,255,0.2)'};
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 10px;
              font-family: monospace;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            ">
              ${l.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [30, 40],
        iconAnchor: [15, 20]
      });

      const marker = L.marker([l.lat, l.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        handleSelectLandmark(l);
      });

      markersRef.current[l.id] = marker;
    });

    // Invalidate size on mount to ensure full canvas rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

  }, [activeTab, mapLayer]);

  // Handle Landmark Selection with Voice Guidance
  const handleSelectLandmark = (landmark: RealLandmark) => {
    setSelectedLandmark(landmark);

    // Pan map to landmark
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([landmark.lat, landmark.lng], 17, {
        duration: 1.2
      });
    }

    // Voice Audio Guidance (as requested by user)
    if (onSpeakText) {
      onSpeakText(`${landmark.name}. ${landmark.speechGuidance}`);
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(SSU_CENTER, 16, { duration: 1 });
    }
    if (onSpeakText) {
      onSpeakText("Recentering on Sri Sri University campus, Cuttack.");
    }
  };

  const handleSpeakBasicInfo = () => {
    if (onSpeakText) {
      onSpeakText(
        "Sri Sri University is a scenic green hilltop campus located in Godi Sahi, Cuttack, Odisha, founded by Gurudev Sri Sri Ravi Shankar. Its motto is Learn, Lead, Serve. The campus features 11 academic faculties, the Central Library, Kaivalya Sattvic dining hall, a 100-bed Ayurveda hospital, student hostels, and the upcoming 300,000 square foot Iconic Tower."
      );
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-black via-[#140603] to-[#0a0f14] text-white flex flex-col p-4 sm:p-6 font-sans select-none overflow-hidden">
      {/* HEADER: Back Button to Hub + Title + Audio */}
      <header className="flex items-center justify-between border-b border-[#C8A451]/30 pb-3 mb-3">
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/75 hover:bg-[#702815]/80 border border-[#C8A451]/50 text-slate-200 hover:text-white transition-all shadow-lg active:scale-95 text-sm sm:text-base font-bold"
        >
          <ArrowLeft className="w-5 h-5 text-[#C8A451]" />
          <span>Back to Hub</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide">
              REAL SSU CAMPUS MAP & DIRECTORY
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#702815] border border-[#C8A451] text-[#C8A451] font-bold">
              GPS SATELLITE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#C8A451] font-mono font-semibold hidden sm:block mt-0.5">
            Godi Sahi, Cuttack 754006 • 20.451382° N, 85.798232° E
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tab switcher: Map vs Basic Info */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/75 border border-slate-700 text-sm">
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Switching to interactive campus map.");
                setActiveTab('map');
              }}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'map' ? 'bg-[#C8A451] text-black shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Real Map
            </button>
            <button
              onClick={() => {
                if (onSpeakText) onSpeakText("Viewing university basic info.");
                setActiveTab('basic-info');
              }}
              className={`px-4 py-2 rounded-xl transition-all font-bold ${
                activeTab === 'basic-info' ? 'bg-[#C8A451] text-black shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Basic Info
            </button>
          </div>

          <button
            onClick={activeTab === 'map' ? () => handleSelectLandmark(selectedLandmark) : handleSpeakBasicInfo}
            className={`p-3 rounded-2xl border transition-all ${
              isSpeaking
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-black/75 border-[#C8A451]/50 text-[#C8A451] hover:text-white'
            }`}
            title="Listen to Location Audio Guide"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CONTENT: TAB 1: REAL LEAFLET SATELLITE/STREET CAMPUS MAP */}
      {activeTab === 'map' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT: Leaflet Map Container (8 Cols) */}
          <div className="lg:col-span-8 bg-black rounded-3xl border border-slate-800 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Top Map Floating Layer Controls (Sharp Solid Background) */}
            <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-black/95 p-2 rounded-2xl border-2 border-slate-700 shadow-2xl">
              <span className="text-xs font-mono text-[#C8A451] font-black px-2 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Layer:
              </span>
              <button
                onClick={() => {
                  if (onSpeakText) onSpeakText("Dark map mode enabled.");
                  setMapLayer('dark');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                  mapLayer === 'dark' ? 'bg-[#00f3ff] text-black shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                Dark Map
              </button>
              <button
                onClick={() => {
                  if (onSpeakText) onSpeakText("Satellite aerial view enabled.");
                  setMapLayer('satellite');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                  mapLayer === 'satellite' ? 'bg-[#C8A451] text-black shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                Satellite (Aerial)
              </button>
              <button
                onClick={() => {
                  if (onSpeakText) onSpeakText("Street map enabled.");
                  setMapLayer('street');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-mono transition-all ${
                  mapLayer === 'street' ? 'bg-indigo-500 text-white shadow' : 'text-slate-200 hover:text-white'
                }`}
              >
                Street Map
              </button>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-slate-700 text-xs sm:text-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search landmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-xs sm:text-sm w-36 text-white placeholder:text-slate-400 font-sans"
                />
              </div>
            </div>

            {/* Recenter Button */}
            <button
              onClick={handleRecenter}
              className="absolute bottom-20 right-3 z-[1000] p-3 rounded-2xl bg-black/90 hover:bg-[#702815] border border-[#C8A451]/70 text-[#C8A451] hover:text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 text-xs sm:text-sm font-mono font-bold"
              title="Recenter on SSU Campus"
            >
              <LocateFixed className="w-5 h-5 text-[#00f3ff]" />
              <span className="hidden sm:inline">Recenter SSU</span>
            </button>

            {/* The Real Leaflet Map DOM Canvas */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />

            {/* Bottom Quick Landmark Selector Bar (Sharp Solid Background) */}
            <div className="absolute bottom-2 left-2 right-2 z-[1000] flex items-center gap-2.5 overflow-x-auto p-2.5 bg-black/95 rounded-2xl border-2 border-slate-700 no-scrollbar shadow-2xl">
              {filteredLandmarks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSelectLandmark(l)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    selectedLandmark.id === l.id
                      ? 'bg-[#702815] text-[#C8A451] border-2 border-[#C8A451] font-black shadow-lg scale-105'
                      : 'bg-black/70 border border-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#C8A451]" />
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Selected Landmark Details Card (4 Cols) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#1b1513] to-black rounded-3xl border-2 border-[#C8A451]/50 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#702815] text-[#C8A451] font-black tracking-wider">
                    {selectedLandmark.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug">
                    {selectedLandmark.name}
                  </h3>
                </div>

                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full font-black uppercase flex items-center gap-1.5 ${
                    selectedLandmark.verificationStatus === 'verified'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                  }`}
                >
                  {selectedLandmark.verificationStatus === 'verified' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFIED GPS</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>PENDING</span>
                    </>
                  )}
                </span>
              </div>

              {/* Coordinates Pill */}
              <div className="p-3.5 rounded-2xl bg-black/70 border border-slate-700 text-sm font-mono flex items-center justify-between">
                <span className="text-slate-300 font-semibold">GPS Coordinates:</span>
                <span className="text-[#00f3ff] font-black">{selectedLandmark.coordinatesStr}</span>
              </div>

              {/* Voice Guidance Text Box */}
              <div className="p-4 rounded-2xl bg-black/70 border border-[#00f3ff]/40 text-sm space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00f3ff] uppercase font-black">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Kiosk Spoken Guidance</span>
                </div>
                <p className="text-slate-100 italic leading-relaxed text-sm sm:text-base font-medium">
                  "{selectedLandmark.speechGuidance}"
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs sm:text-sm font-mono text-[#C8A451] uppercase tracking-wider font-black">
                  Building Overview
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-black/50 p-4 rounded-2xl border border-slate-800">
                  {selectedLandmark.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-mono text-slate-300 uppercase tracking-wider font-bold">
                  Amenities & Facilities:
                </h4>
                <div className="grid grid-cols-1 gap-2 text-sm font-medium">
                  {selectedLandmark.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/50 border border-slate-800 text-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-[#C8A451] flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Read Aloud Voice Action */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <button
                onClick={() => handleSelectLandmark(selectedLandmark)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#C8A451] hover:bg-[#d6b464] text-black font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                <span>Hear Kiosk Voice Guide This Location</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: TAB 2: BASIC SSU UNIVERSITY INFO */}
      {activeTab === 'basic-info' && (
        <div className="flex-1 min-h-0 bg-slate-950/80 rounded-3xl border border-slate-800 p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Hero Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#702815] to-[#2b0c05] border-2 border-[#C8A451]/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#C8A451] uppercase font-black tracking-widest">
                Official University Information
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                SRI SRI UNIVERSITY, CUTTACK, ODISHA
              </h2>
              <p className="text-sm sm:text-base text-[#C8A451] font-mono italic font-bold">
                "Learn, Lead, Serve" • Founded by Gurudev Sri Sri Ravi Shankar
              </p>
            </div>

            <button
              onClick={handleSpeakBasicInfo}
              className="px-5 py-3 rounded-2xl bg-[#C8A451] hover:bg-[#d6b464] text-black font-black text-sm sm:text-base flex items-center gap-2 shadow-xl transition-all active:scale-95 whitespace-nowrap"
            >
              <Volume2 className="w-5 h-5" />
              <span>Read Info Aloud</span>
            </button>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-black/75 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-black text-[#C8A451]">Hilltop</div>
              <div className="text-sm sm:text-base font-bold text-slate-300 mt-1">Scenic Green Campus</div>
            </div>
            <div className="p-5 rounded-2xl bg-black/75 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-black text-[#00f3ff]">11 Faculties</div>
              <div className="text-sm sm:text-base font-bold text-slate-300 mt-1">Undergrad & Postgrad</div>
            </div>
            <div className="p-5 rounded-2xl bg-black/75 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-black text-emerald-400">100+ Beds</div>
              <div className="text-sm sm:text-base font-bold text-slate-300 mt-1">Ayurvedic Hospital</div>
            </div>
            <div className="p-5 rounded-2xl bg-black/75 border border-slate-800 text-center shadow-lg">
              <div className="text-2xl sm:text-4xl font-black text-amber-400">100% Sattvic</div>
              <div className="text-sm sm:text-base font-bold text-slate-300 mt-1">Pure Vegetarian Campus</div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-black/70 border border-slate-800 space-y-2.5 shadow-lg">
              <h3 className="text-base sm:text-lg font-black text-[#C8A451] uppercase tracking-wider font-mono">
                University Vision
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                To create a world-class holistic institution imparting education combining traditional Eastern wisdom with cutting-edge Western scientific research, fostering global leaders of tomorrow.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/70 border border-slate-800 space-y-2.5 shadow-lg">
              <h3 className="text-base sm:text-lg font-black text-[#C8A451] uppercase tracking-wider font-mono">
                University Mission
              </h3>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                To nurture innovative thinking, ethical consciousness, and social responsibility across engineering, management, health sciences, agriculture, and human values.
              </p>
            </div>
          </div>

          {/* Contact & Address */}
          <div className="p-6 rounded-3xl bg-black/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm sm:text-base font-mono shadow-lg">
            <div>
              <span className="text-slate-400 block mb-1 text-xs sm:text-sm font-bold uppercase">Campus Address:</span>
              <span className="text-white font-bold">
                Sri Sri Vihar, Ward No. 3, Godi Sahi, Cuttack - 754006, Odisha, India
              </span>
            </div>
            <a
              href="https://srisriuniversity.edu.in"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-black/60 border border-[#C8A451]/60 text-[#C8A451] hover:text-white hover:bg-[#702815] transition-all flex items-center gap-2 font-bold"
            >
              <span>srisriuniversity.edu.in</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
