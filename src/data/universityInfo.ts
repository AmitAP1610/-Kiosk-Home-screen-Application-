/**
 * Official Sri Sri University (SSU) Knowledge Base
 * Sourced directly from official university records (https://srisriuniversity.edu.in)
 * Editable by campus administrators.
 */

export interface UniversityContact {
  department: string;
  phone?: string;
  email: string;
  location?: string;
}

export interface AcademicFaculty {
  id: string;
  name: string;
  description: string;
  degrees: string[];
  featuredPrograms: string[];
}

export interface CampusFacility {
  id: string;
  name: string;
  category: 'academic' | 'residential' | 'healthcare' | 'sports' | 'lifestyle' | 'innovation';
  location: string;
  description: string;
  highlights: string[];
}

export interface UniversityInfoData {
  name: string;
  shortName: string;
  tagline: string;
  motto: string;
  mottoMeaning: string;
  establishedYear: number;
  founder: string;
  legislativeAct: string;
  campusSize: string;
  address: {
    campus: string;
    ward: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullFormatted: string;
  };
  vision: string;
  mission: string;
  coreValues: string[];
  campusHighlights: string[];
  faculties: AcademicFaculty[];
  facilities: CampusFacility[];
  contacts: UniversityContact[];
  officialLinks: {
    website: string;
    admissions: string;
    visionMission: string;
    facilities: string;
    contactUs: string;
  };
}

export const UNIVERSITY_INFO: UniversityInfoData = {
  name: "Sri Sri University",
  shortName: "SSU",
  tagline: "Silicon Valley of the East",
  motto: "Learn, Lead, Serve",
  mottoMeaning:
    "The motto 'Learn, Lead, Serve' encapsulates the university's holistic philosophy: to acquire knowledge and wisdom (Learn), to cultivate compassionate and ethical leadership (Lead), and to dedicate one's skills and life to the betterment of society and the world (Serve).",
  establishedYear: 2009,
  founder: "Poojya Gurudev Sri Sri Ravi Shankar",
  legislativeAct: "Sri Sri University Act, 2009 (Odisha Act 15 of 2009)",
  campusSize: "188 acres of sprawling, lush green hilltop campus overlooking the Mahanadi River basin",
  address: {
    campus: "Sri Sri Vihar",
    ward: "Ward No - 3",
    locality: "Godi Sahi (Bidyadharpur Arilo)",
    city: "Cuttack",
    state: "Odisha",
    pincode: "754006",
    country: "India",
    fullFormatted: "Sri Sri Vihar, Ward No - 3, Godi Sahi, Cuttack - 754006, Odisha, India"
  },
  vision:
    "To impart holistic and value-integrated education in order to develop visionary thinkers with social consciousness to lead and precipitate inevitable changes, with a summative call for 'Learn – Lead – Serve'.",
  mission:
    "To create centres of excellence in knowledge and research across the fields of study in order to equip students to achieve the highest levels of professional ability in a learning atmosphere that fosters human values to serve the needs of local, national, and global economies.",
  coreValues: [
    "Holistic Education blending the best of the East (ancient wisdom & values) and the best of the West (modern science & innovation)",
    "Human Values, Ethics, and Social Consciousness",
    "Self-Discovery, Mindfulness, and Meditation",
    "Environmental Sustainability and Green Campus Living",
    "Interdisciplinary Research, Innovation, and Entrepreneurship"
  ],
  campusHighlights: [
    "188-acre eco-friendly, non-smoking, alcohol-free, 100% vegetarian holistic campus",
    "On-campus 100+ Bed Ayurvedic Hospital & Research Centre",
    "Modern Central Library housed inside the iconic Shruti Academic Complex",
    "Kaushalya Incubation & Entrepreneurship Centre",
    "Active student clubs, cultural fests (Orion), sports complexes, and meditation halls"
  ],
  faculties: [
    {
      id: "management",
      name: "Faculty of Management Studies",
      description: "Pioneering business education blending strategic corporate acumen with ethics and human values.",
      degrees: ["BBA", "MBA", "Ph.D."],
      featuredPrograms: [
        "MBA in General Management (Marketing, Finance, HR)",
        "MBA in Agribusiness Management",
        "MBA in Entrepreneurship",
        "Bachelor of Business Administration (BBA)"
      ]
    },
    {
      id: "engineering",
      name: "Faculty of Engineering & Technology",
      description: "Cutting-edge engineering and computer applications with industry-aligned specializations.",
      degrees: ["B.Tech", "BCA", "MCA", "Ph.D."],
      featuredPrograms: [
        "B.Tech in Computer Science and Engineering",
        "B.Tech with specialization in Artificial Intelligence & Machine Learning",
        "B.Tech with specialization in Cyber Security & Data Science",
        "Master of Computer Applications (MCA)",
        "Bachelor of Computer Applications (BCA)"
      ]
    },
    {
      id: "agriculture",
      name: "Faculty of Agriculture",
      description: "Sustainable farming, organic techniques, soil science, and high-tech agrarian research.",
      degrees: ["B.Sc. (Hons.)", "M.Sc.", "Ph.D."],
      featuredPrograms: [
        "B.Sc. (Hons.) Agriculture (ICAR aligned)",
        "M.Sc. in Agronomy",
        "M.Sc. in Horticulture",
        "M.Sc. in Agricultural Economics"
      ]
    },
    {
      id: "ayurveda",
      name: "Faculty of Ayurveda (Sri Sri College of Ayurvedic Science & Research Hospital)",
      description: "Traditional Ayurvedic medicine combined with clinical training in an on-campus multi-specialty hospital.",
      degrees: ["BAMS", "MD/MS Ayurveda"],
      featuredPrograms: [
        "Bachelor of Ayurvedic Medicine & Surgery (BAMS)",
        "Clinical Panchakarma Training",
        "Ayurvedic Pharmacology & Herbal Medicine"
      ]
    },
    {
      id: "sciences",
      name: "Faculty of Sciences",
      description: "Rigorous scientific inquiry across fundamental and applied science disciplines.",
      degrees: ["B.Sc. (Hons.)", "M.Sc.", "Ph.D."],
      featuredPrograms: [
        "B.Sc. / M.Sc. in Physics",
        "B.Sc. / M.Sc. in Chemistry",
        "B.Sc. / M.Sc. in Mathematics",
        "M.Sc. in Environmental Science",
        "M.Sc. in Data Science"
      ]
    },
    {
      id: "arts-indic",
      name: "Faculty of Arts, Communication & Indic Studies",
      description: "Preserving cultural heritage while mastering contemporary communication and languages.",
      degrees: ["BA (Hons.)", "MA", "Ph.D."],
      featuredPrograms: [
        "BA in Journalism & Mass Communication",
        "BA (Hons.) in English",
        "Bachelor of Performing Arts (Odissi Dance / Hindustani Vocal)",
        "MA in Yogic Science"
      ]
    },
    {
      id: "psychology",
      name: "Faculty of Contemplative & Behavioural Sciences",
      description: "Exploring the human mind, positive psychology, cognitive neuroscience, and emotional wellness.",
      degrees: ["B.Sc. (Hons.)", "M.Sc.", "Ph.D."],
      featuredPrograms: [
        "B.Sc. (Hons.) in Psychology",
        "M.Sc. in Clinical Psychology",
        "Contemplative and Behavioural Science Research"
      ]
    },
    {
      id: "architecture",
      name: "Faculty of Architecture & Design",
      description: "Eco-architecture, sustainable urban planning, and spatial aesthetics.",
      degrees: ["B.Arch", "B.Des"],
      featuredPrograms: [
        "Bachelor of Architecture (B.Arch - COA Approved)",
        "Bachelor of Interior Design (B.Des)"
      ]
    },
    {
      id: "nursing",
      name: "Sri Sri College of Nursing",
      description: "Healthcare training emphasizing compassion, professional excellence, and patient-centered care.",
      degrees: ["B.Sc. Nursing"],
      featuredPrograms: [
        "Bachelor of Science in Nursing (B.Sc. Nursing)"
      ]
    },
    {
      id: "wellness",
      name: "Faculty of Health & Wellness",
      description: "Holistic preventive health, yoga therapy, naturopathy, and lifestyle medicine.",
      degrees: ["B.Sc.", "M.Sc."],
      featuredPrograms: [
        "B.Sc. in Yogic Science",
        "M.Sc. in Yoga & Holistic Health"
      ]
    },
    {
      id: "eastern-knowledge",
      name: "Faculty of Eastern Knowledge Systems",
      description: "Ancient Vedic texts, Sanskrit studies, Indian philosophy, and traditional intellectual traditions.",
      degrees: ["Certificate", "Diploma", "MA"],
      featuredPrograms: [
        "Indian Knowledge Systems (IKS)",
        "Vedic Heritage and Applied Philosophy"
      ]
    }
  ],
  facilities: [
    {
      id: "library",
      name: "Central Library",
      category: "academic",
      location: "Shruti Academic Complex",
      description: "Ultra-modern, fully air-conditioned, eco-friendly digital and physical learning resource centre with an extensive collection of textbooks, research journals, e-books, and multimedia stations.",
      highlights: [
        "Spacious, silent reading halls",
        "KOHA open-source library management system & RFID automation",
        "Subscription to premier online research repositories (DELNET, INFLIBNET, IEEE, EBSCO)",
        "Dedicated quiet study zones and collaborative academic cubicles"
      ]
    },
    {
      id: "hospital",
      name: "Sri Sri Ayurveda Hospital & Medical Centre",
      category: "healthcare",
      location: "On-campus Healthcare Wing",
      description: "100+ Bed multi-specialty Ayurvedic and allopathic hospital providing 24/7 healthcare, emergency medical response, Panchakarma therapies, and regular health check-ups for students, staff, and the community.",
      highlights: [
        "24/7 Emergency medical staff, resident doctors, and nursing team",
        "Fully equipped on-campus ambulance service",
        "Specialized Panchakarma and Ayurvedic wellness therapies",
        "In-house licensed pharmacy providing standard and Ayurvedic medicines"
      ]
    },
    {
      id: "hostels",
      name: "Student Halls of Residence (Hostels)",
      category: "residential",
      location: "Residential Zones (Boys & Girls Blocks)",
      description: "Comfortable, safe, fully furnished residential halls with Wi-Fi, study rooms, 24/7 security, wardens, and scenic hill views.",
      highlights: [
        "Separate hostel complexes for boys and girls (Ambar, Kadambari, Aravali, HB 4, Chhatrapati Shivaji Bhavan)",
        "24/7 Security surveillance, biometric access, and dedicated wardens",
        "High-speed Wi-Fi, power backup, and continuous water filtration",
        "Common rooms with television, indoor games, and student recreation spaces"
      ]
    },
    {
      id: "kaushalya",
      name: "Kaushalya Incubation & Entrepreneurship Centre",
      category: "innovation",
      location: "Academic Innovation Hub",
      description: "Dedicated campus incubator providing mentoring, seed funding guidance, co-working spaces, and industry linkages to nurture student startups and social enterprises.",
      highlights: [
        "Modern co-working spaces and high-speed prototyping lab",
        "Mentorship by Art of Living corporate leaders and seasoned entrepreneurs",
        "Assistance in patent filing, prototyping, and Angel/VC pitch events"
      ]
    },
    {
      id: "dining",
      name: "Annapurna Dining Hall & Food Courts",
      category: "lifestyle",
      location: "Central Dining Zone",
      description: "Large, hygienic dining complex serving freshly prepared, 100% pure vegetarian, nutritious, and wholesome Sattvic meals curated to promote student health and vitality.",
      highlights: [
        "100% Pure vegetarian, hygienic, and wholesome culinary preparation",
        "Balanced nutritional menu with seasonal fresh produce",
        "On-campus cafes and organic snack kiosks for refreshments"
      ]
    },
    {
      id: "sports",
      name: "Sports Complex, Gymnasium & Yoga Halls",
      category: "sports",
      location: "Campus Sports Grounds & Shruti Wellness Wing",
      description: "Comprehensive physical fitness and sports facilities catering to a wide range of outdoor sports, indoor games, daily yoga, and fitness regimes.",
      highlights: [
        "Full-sized cricket ground and football field",
        "Standard outdoor basketball, volleyball, and tennis courts",
        "Modern indoor gymnasium with cardio and strength equipment",
        "Dedicated serene meditation and yoga halls for daily practice"
      ]
    }
  ],
  contacts: [
    {
      department: "Admissions Office",
      phone: "+91-7894424562",
      email: "admissions@srisriuniversity.edu.in",
      location: "Administrative Block, Ground Floor"
    },
    {
      department: "General Help Desk & Enquiries",
      phone: "+91-7894424562",
      email: "info@srisriuniversity.edu.in",
      location: "Main Reception, Sri Sri Vihar"
    },
    {
      department: "Executive Registrar's Office",
      phone: "0671-713-2692",
      email: "eroffice@srisriuniversity.edu.in",
      location: "Administrative Block, 1st Floor"
    },
    {
      department: "Dean of Students Welfare (DSW)",
      phone: "0671-7123823 / 0671-7132820",
      email: "dsw@srisriuniversity.edu.in",
      location: "Student Activity Center"
    },
    {
      department: "Finance & Accounts",
      phone: "+91-7996123440",
      email: "finance@srisriuniversity.edu.in",
      location: "Administrative Block"
    },
    {
      department: "Campus Medical Emergency",
      phone: "0671-713-2600",
      email: "hospital@srisriuniversity.edu.in",
      location: "Sri Sri Ayurveda Hospital Wing"
    }
  ],
  officialLinks: {
    website: "https://srisriuniversity.edu.in/",
    admissions: "https://srisriuniversity.edu.in/admissions/",
    visionMission: "https://srisriuniversity.edu.in/vision-and-mission/",
    facilities: "https://srisriuniversity.edu.in/campus-facilities/",
    contactUs: "https://srisriuniversity.edu.in/contact-us/"
  }
};

