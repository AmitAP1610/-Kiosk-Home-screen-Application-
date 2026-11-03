import React, { useState } from 'react';
import { AppScreen } from '../types/robot';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Clock,
  Compass,
  Search,
  CheckCircle2,
  Phone
} from 'lucide-react';

interface MapInfoScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSpeakText?: (text: string) => void;
  isSpeaking?: boolean;
}

export interface CampusLandmark {
  id: string;
  name: string;
  category: 'academic' | 'healthcare' | 'dining' | 'robotics' | 'sports' | 'residential' | 'spiritual';
  categoryLabel: string;
  image: string;
  timing: string;
  location: string;
  description: string;
  speechText: string;
  highlights: string[];
  contactInfo?: string;
}

export const CAMPUS_LANDMARKS: CampusLandmark[] = [
  {
    id: 'shruti-library',
    name: 'Shruti Academic Complex & Central Library',
    category: 'academic',
    categoryLabel: 'Academic & Library',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    timing: '08:00 AM - 10:00 PM (Daily)',
    location: 'Central Campus Hilltop',
    description: 'The principal academic hub housing multidisciplinary lecture theatres, faculty secretariats, and the Central Library with over 50,000 volumes, digital research carrels, and quiet study zones.',
    speechText: 'This is the Shruti Academic Complex and Central Library. It features smart audiovisual lecture theatres, over 50,000 academic volumes, and silent research carrels for students.',
    highlights: [
      '50,000+ print volumes & national e-journal databases',
      'High-speed digital research carrels with Wi-Fi',
      'Air-conditioned smart audiovisual lecture theatres',
      'President Secretariat and Dean offices'
    ],
    contactInfo: 'library@srisriuniversity.edu.in'
  },
  {
    id: 'ayurveda-hospital',
    name: 'Sri Sri Ayurveda Hospital (100+ Beds)',
    category: 'healthcare',
    categoryLabel: 'Healthcare & Hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
    timing: '24/7 Emergency & Casualty Service',
    location: 'North Campus Entrance',
    description: 'State-of-the-art 100+ bed teaching and multispecialty healthcare hospital providing 24/7 emergency medical care, authentic Panchakarma therapies, modern diagnostic pathology, and pharmacy.',
    speechText: 'Sri Sri Ayurveda Hospital is our 100-bed multispecialty hospital. It provides 24/7 casualty emergency care, authentic Panchakarma therapy suites, and modern diagnostic laboratories.',
    highlights: [
      '100+ Inpatient beds with ICU and 24/7 casualty',
      'Authentic Ayurvedic Panchakarma therapeutic center',
      'Full modern diagnostic pathology & imaging labs',
      'On-site 24/7 herbal & modern dispensary'
    ],
    contactInfo: 'Emergency Casualty: Ext 108 / Hospital Reception'
  },
  {
    id: 'kaivalya-dining',
    name: 'Kaivalya Central Dining Hall',
    category: 'dining',
    categoryLabel: 'Dining & Cafeteria',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    timing: 'Breakfast: 7:30 AM • Lunch: 12:30 PM • Dinner: 7:30 PM',
    location: 'Central Dining Court',
    description: '100% vegetarian Sattvic campus dining facility catering fresh, nutritious meals cooked with organic farm produce, seasonal fruits, and fresh milk from the university Gaushala.',
    speechText: 'Kaivalya Dining Hall serves fresh, nutritious, one hundred percent vegetarian Sattvic meals prepared with organic produce harvested directly from our campus farms.',
    highlights: [
      '100% Pure vegetarian Sattvic daily meals',
      'Organic farm-to-table vegetables & fresh A2 dairy',
      'Spacious hygienic dining halls with 2,000+ seating',
      'Eco-composting & zero food waste initiative'
    ],
    contactInfo: 'kaivalya.dining@srisriuniversity.edu.in'
  },
  {
    id: 'robotics-maker-lab',
    name: 'Sri Sri Robotics Club & Maker Space',
    category: 'robotics',
    categoryLabel: 'Robotics & Maker Space',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    timing: '09:00 AM - 09:00 PM (Student Access)',
    location: 'Innovation Wing, Lower Shruti Complex',
    description: 'The birthplace of Kiosk. Equipped with 3D printers, rapid prototyping tools, NVIDIA Jetson edge AI workstations, Arduino benches, and a dedicated indoor autonomous rover test track.',
    speechText: 'Welcome to the Sri Sri Robotics Club and Maker Space. This is where I, Kiosk, was designed and built! Students build rovers, write ROS 2 code, and test AI edge computers here.',
    highlights: [
      'Home base of Kiosk and autonomous student rovers',
      'Industrial 3D printers & PCB prototyping equipment',
      'NVIDIA Jetson & Arduino robotics workstations',
      'Indoor obstacle course for 2D LiDAR navigation testing'
    ],
    contactInfo: 'robotics.club@srisriuniversity.edu.in'
  },
  {
    id: 'oat-amphitheatre',
    name: 'Open-Air Theatre (OAT) & Event Arena',
    category: 'spiritual',
    categoryLabel: 'Amphitheatre & Arts',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=900&q=80',
    timing: '06:00 AM - 10:00 PM',
    location: 'Hilltop Cultural Plaza',
    description: 'Picturesque open-air amphitheatre with terraced stone seating under the stars. Venue for university convocations, Orion cultural festivals, classical Odissi performances, and dawn yoga.',
    speechText: 'The Open-Air Theatre is our scenic hilltop amphitheatre. It hosts our annual Orion cultural festival, classical Odissi dance recitals, and morning meditation overlooking the river.',
    highlights: [
      'Terraced amphitheatre with capacity for 3,500+ attendees',
      'Host venue for Orion Cultural Festival & Convocations',
      'Acoustic stage design with panoramic valley view',
      'Morning Sahaj meditation and Surya Namaskar sessions'
    ],
    contactInfo: 'cultural.council@srisriuniversity.edu.in'
  },
  {
    id: 'sports-arena',
    name: 'Multi-Sport Complex & Athletic Arena',
    category: 'sports',
    categoryLabel: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    timing: '06:00 AM - 09:30 PM',
    location: 'South Campus Sports Field',
    description: 'Comprehensive collegiate athletic facility featuring a floodlit cricket ground, FIFA-sized football field, outdoor basketball courts, tennis courts, and an indoor gymnasium.',
    speechText: 'Our Multi-Sport Complex includes a floodlit cricket stadium, football turf, tennis and basketball courts, plus a fully equipped indoor fitness and gymnasium center.',
    highlights: [
      'Floodlit natural grass cricket ground & football pitch',
      'Synthetic basketball & volleyball courts',
      'Modern air-conditioned gymnasium with fitness trainers',
      'Annual SSU Inter-University Sports Meet host'
    ],
    contactInfo: 'sports@srisriuniversity.edu.in'
  },
  {
    id: 'hostels-residential',
    name: 'Student Residences & Green Hostels',
    category: 'residential',
    categoryLabel: 'Student Hostels',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    timing: '24/7 Resident Access with Biometric Security',
    location: 'East & West Residential Quarters',
    description: 'Eco-conscious student residential blocks with panoramic hilltop views, high-speed Wi-Fi, solar water heating, reading lounges, indoor recreation, and 24/7 security surveillance.',
    speechText: 'Our student residential halls offer safe, comfortable living with 24/7 biometric security, solar heating, high-speed internet, and recreation common rooms.',
    highlights: [
      'Separate residential halls for boys and girls',
      'Biometric access control & 24/7 CCTV surveillance',
      'Solar thermal water heating & rainwater harvesting',
      'Wi-Fi study lounges and table tennis recreation areas'
    ],
    contactInfo: 'Chief Warden Office: Ext 220'
  },
  {
    id: 'vishwashanti-ashram',
    name: 'Vishwashanti Ashram & Meditation Hall',
    category: 'spiritual',
    categoryLabel: 'Spiritual & Meditation',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    timing: '05:30 AM - 08:30 PM (Daily)',
    location: 'Hilltop Summit Point',
    description: 'A serene sanctuary dedicated to silent meditation, mindfulness, and the philosophical teachings of Gurudev Sri Sri Ravi Shankar, overlooking the serene Mahanadi river basin.',
    speechText: 'Vishwashanti Ashram is our hilltop meditation sanctuary, offering quiet reflection, daily breathwork, and beautiful views of the surrounding green valley.',
    highlights: [
      'Tranquil meditation hall with marble acoustic design',
      'Daily morning and evening community meditation & Satsang',
      'Overlooks lush forested hills and Mahanadi river',
      'Silence retreat zones for mindfulness practice'
    ],
    contactInfo: 'ashram.desk@srisriuniversity.edu.in'
  }
];

export const MapInfoScreen: React.FC<MapInfoScreenProps> = ({
  onNavigate,
  onSpeakText,
  isSpeaking = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Highlights' },
    { id: 'academic', label: 'Academic & Library' },
    { id: 'healthcare', label: 'Ayurveda Hospital' },
    { id: 'dining', label: 'Kaivalya Dining' },
    { id: 'robotics', label: 'Robotics Maker Lab' },
    { id: 'sports', label: 'Sports Arena' },
    { id: 'spiritual', label: 'OAT & Ashram' },
    { id: 'residential', label: 'Hostels' }
  ];

  const filteredLandmarks = CAMPUS_LANDMARKS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSpeakLandmark = (item: CampusLandmark) => {
    if (onSpeakText) {
      onSpeakText(`${item.speechText} Key highlights include: ${item.highlights.join('. ')}. Visiting hours are: ${item.timing}.`);
    }
  };

  const handleSpeakOverview = () => {
    if (onSpeakText) {
      onSpeakText(
        "Welcome to the Sri Sri University Campus Highlights guide. Our 188-acre green hilltop campus includes the Central Library in Shruti Complex, a 100-bed Ayurveda Hospital, Kaivalya organic dining hall, our Robotics Maker Space, sports arenas, and peaceful meditation pavilions. Tap any facility to listen to full details."
      );
    }
  };

  return (
    <div className="w-full h-full bg-[#F2F2EF] text-[#30343B] flex flex-col p-3 sm:p-5 md:p-6 font-sans select-none overflow-hidden relative">
      {/* HEADER: Charcoal Structural Container (30% palette) */}
      <header className="relative z-10 flex items-center justify-between bg-[#30343B] text-white px-4 sm:px-6 py-3 rounded-xl border border-[#B0B4B8]/30 shadow-subtle mb-3">
        {/* Back Button */}
        <button
          onClick={() => {
            if (onSpeakText) onSpeakText("Returning to robot hub.");
            onNavigate('hub');
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#202124] hover:bg-[#17191C] border border-[#B0B4B8]/40 text-white transition-all shadow-sm active:scale-98 text-xs sm:text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-[#D49A36]" />
          <span>Back to Hub</span>
        </button>

        {/* Center Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-lg md:text-xl font-extrabold text-white tracking-wide">
              CAMPUS HIGHLIGHTS & FACILITIES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D49A36] text-[#202124] font-bold uppercase">
              EXPLORE SSU
            </span>
          </div>
          <p className="text-[11px] text-[#B0B4B8] font-mono mt-0.5 hidden sm:block">
            Sri Sri University • 188-Acre Green Hilltop Campus • Cuttack, Odisha
          </p>
        </div>

        {/* Right Voice Button */}
        <button
          onClick={handleSpeakOverview}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all text-xs sm:text-sm font-bold shadow-sm ${
            isSpeaking
              ? 'bg-[#D49A36] border-white text-[#202124]'
              : 'bg-[#202124] border-[#B0B4B8]/40 text-white hover:bg-[#1A1B1D]'
          }`}
          title="Listen to Campus Highlights Audio Tour"
        >
          <Volume2 className="w-4 h-4 text-[#D49A36]" />
          <span className="hidden sm:inline">Audio Tour</span>
        </button>
      </header>

      {/* FILTER & SEARCH BAR: White Card Panel */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-2.5 mb-3 bg-[#FFFFFF] text-[#30343B] p-2.5 rounded-xl border border-[#B0B4B8]/60 shadow-subtle">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (onSpeakText) onSpeakText(`Showing ${cat.label} facilities.`);
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#D49A36] text-[#202124] shadow-sm'
                  : 'bg-[#F2F2EF] text-[#30343B] hover:bg-[#E5E5E0] border border-[#B0B4B8]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/50 text-xs w-full md:w-60">
          <Search className="w-3.5 h-3.5 text-[#D49A36]" />
          <input
            type="text"
            placeholder="Search building or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-[#30343B] outline-none w-full placeholder:text-[#5F666D] font-sans font-medium text-xs"
          />
        </div>
      </div>

      {/* LANDMARKS CARDS GRID */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredLandmarks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#5F666D]">
            <Compass className="w-12 h-12 text-[#D49A36] mb-2" />
            <h3 className="text-base font-bold text-[#30343B] mb-1">No facilities match your search</h3>
            <p className="text-xs text-[#5F666D]">Try choosing a different category or clearing the search box.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-5">
            {filteredLandmarks.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#B0B4B8]/60 hover:border-[#D49A36] bg-[#FFFFFF] text-[#30343B] overflow-hidden transition-all flex flex-col justify-between shadow-card"
              >
                {/* Image Banner */}
                <div className="relative h-40 sm:h-44 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Category Pill */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#D49A36] text-[#202124] font-bold uppercase tracking-wider shadow-sm">
                      {item.categoryLabel}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202124]/90 text-white border border-[#B0B4B8]/30 font-medium flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#D49A36]" />
                      <span>{item.location}</span>
                    </span>
                  </div>

                  {/* Timing Pill */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#202124]/90 border border-[#B0B4B8]/30">
                      <Clock className="w-3 h-3 text-[#D49A36]" />
                      <span className="font-semibold text-white">{item.timing}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#30343B] leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-[#5F666D] leading-relaxed bg-[#F2F2EF] p-2.5 rounded-lg border border-[#B0B4B8]/30">
                      {item.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#30343B] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D49A36]" />
                        <span>Key Facilities & Highlights:</span>
                      </span>
                      <div className="space-y-0.5">
                        {item.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-[#5F666D]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D49A36] flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.contactInfo && (
                      <div className="p-2 rounded-lg bg-[#F2F2EF] border border-[#B0B4B8]/30 flex items-center gap-1.5 text-[11px] font-mono text-[#5F666D]">
                        <Phone className="w-3 h-3 text-[#D49A36] flex-shrink-0" />
                        <span className="truncate">{item.contactInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button: Speak Facility Guide */}
                  <div className="pt-2 border-t border-[#B0B4B8]/30 mt-2">
                    <button
                      onClick={() => handleSpeakLandmark(item)}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#30343B] hover:bg-[#202124] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#D49A36]" />
                      <span>Hear Facility Audio Tour</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
