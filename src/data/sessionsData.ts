/**
 * Sri Sri University Sessions & Agenda Data
 * Official schedule for academic sessions, workshops, conferences, and student events
 */

export interface CampusSession {
  id: string;
  title: string;
  track: 'Robotics & AI' | 'Academic' | 'Wellness' | 'Cultural' | 'Orientation';
  time: string;
  duration: string;
  dateCategory: 'today' | 'tomorrow' | 'upcoming';
  venue: string;
  venueBuildingId: string;
  speaker: string;
  speakerRole: string;
  description: string;
  status: 'LIVE NOW' | 'UPCOMING' | 'COMPLETED';
  seatsAvailable?: number;
  tags: string[];
  image: string;
  highlights: string[];
  entryRequirement: string;
  targetAudience: string;
}

export const CAMPUS_SESSIONS: CampusSession[] = [
  // ================= TODAY'S SESSIONS =================
  {
    id: 'sess-01',
    title: 'Autonomous Mobile Robotics & Edge AI Keynote',
    track: 'Robotics & AI',
    time: '10:00 AM - 11:30 AM',
    duration: '90 mins',
    dateCategory: 'today',
    venue: 'Shruti Seminar Hall 1, Academic Complex',
    venueBuildingId: 'shruti-complex',
    speaker: 'Prof. Ananya Sharma',
    speakerRole: 'Dean, Faculty of Emerging Technologies',
    description: 'Explore the live engineering behind Kiosk, our autonomous campus robot. Demonstrating 2D LiDAR SLAM, ROS 2 Nav2, and low-latency voice synthesis running on NVIDIA Jetson and Android tablet hardware.',
    status: 'LIVE NOW',
    seatsAvailable: 15,
    tags: ['Robotics', 'Jetson', 'Nav2', 'Edge AI'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Live 2D LiDAR SLAM & obstacle avoidance demo',
      'Architecture breakdown of the Kiosk robot',
      'Edge AI acceleration on NVIDIA Jetson'
    ],
    entryRequirement: 'Open Entry • Free for all Students & Visitors',
    targetAudience: 'Engineering, AI Students & Campus Visitors'
  },
  {
    id: 'sess-02',
    title: 'Mindfulness & Meditation for Focus (Art of Living)',
    track: 'Wellness',
    time: '12:00 PM - 01:00 PM',
    duration: '60 mins',
    dateCategory: 'today',
    venue: 'Open-Air Theatre (OAT) & Meditation Pavilions',
    venueBuildingId: 'oat-amphitheatre',
    speaker: 'Swami Divyatej',
    speakerRole: 'Senior Art of Living Faculty & Mentor',
    description: 'Guided breathwork, Pranayama, and effortless Sahaj meditation session designed for cognitive clarity, stress release, and peak academic performance on our hilltop green campus.',
    status: 'UPCOMING',
    seatsAvailable: 80,
    tags: ['Meditation', 'Pranayama', 'Wellness', 'Sattvic'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Pranayama rhythmic breathing techniques',
      'Effortless 20-minute guided Sahaj meditation',
      'Mental calmness & cognitive boost for exams'
    ],
    entryRequirement: 'Open to All • No Prior Experience Required',
    targetAudience: 'All University Students, Faculty & Guests'
  },
  {
    id: 'sess-03',
    title: 'Ayurveda & Integrative Modern Healthcare Symposium',
    track: 'Academic',
    time: '02:30 PM - 04:00 PM',
    duration: '90 mins',
    dateCategory: 'today',
    venue: 'Auditorium, 100+ Bed Sri Sri Ayurveda Hospital',
    venueBuildingId: 'ayurveda-hospital',
    speaker: 'Dr. Ramesh Chandra Mohanty',
    speakerRole: 'Medical Superintendent & Panchakarma Specialist',
    description: 'Evidence-based review of holistic Ayurvedic therapeutics, hospital clinical facilities, 24/7 patient care, and traditional Panchakarma protocols integrated with modern diagnostic pathology.',
    status: 'UPCOMING',
    seatsAvailable: 45,
    tags: ['Ayurveda', 'Healthcare', 'Medicine', 'Wellness'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Overview of 100+ bed hospital facilities & 24/7 casualty',
      'Evidence-based Panchakarma case studies',
      'Integration of modern diagnostics with ancient healing'
    ],
    entryRequirement: 'Registration at Hospital Desk or Online Portal',
    targetAudience: 'Medical, Nursing, Pharmacy & Life Science Scholars'
  },
  {
    id: 'sess-04',
    title: 'SSU Robotics Club Live Autonomous Systems Demo',
    track: 'Robotics & AI',
    time: '04:30 PM - 06:00 PM',
    duration: '90 mins',
    dateCategory: 'today',
    venue: 'Sri Sri University Robotics Club Lab',
    venueBuildingId: 'robotics-club-lab',
    speaker: 'SSU Robotics Club Technical Team',
    speakerRole: 'Club Lead & Student Creators',
    description: 'Live interactive demonstrations by the Sri Sri University Robotics Club showcasing autonomous rover navigation, ROS 2 LiDAR mapping, and the Kiosk robot architecture.',
    status: 'UPCOMING',
    seatsAvailable: 30,
    tags: ['Robotics Club', 'Autonomous AI', 'ROS 2', 'Demo'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Interactive control and sensor test of Kiosk',
      'Hands-on showcase of autonomous wheeled rovers',
      'Student recruitment for upcoming national competitions'
    ],
    entryRequirement: 'Open Entry • Sri Sri Robotics Club Lab',
    targetAudience: 'Tech Innovators, Coding & Robotics Enthusiasts'
  },
  {
    id: 'sess-05',
    title: 'Hands-on Workshop: ROS 2 & Sensor Interfacing for Beginners',
    track: 'Robotics & AI',
    time: '06:30 PM - 08:00 PM',
    duration: '90 mins',
    dateCategory: 'today',
    venue: 'Robotics Maker Space (Shruti Lower Level)',
    venueBuildingId: 'shruti-complex',
    speaker: 'SSU Robotics Club Embedded Hardware Team',
    speakerRole: 'Club Technical Mentors',
    description: 'Practical hands-on training for students to connect LiDAR scanners, ultrasonic distance sensors, and Arduino motor controllers with live code examples.',
    status: 'UPCOMING',
    seatsAvailable: 25,
    tags: ['Hands-on', 'Arduino', 'Sensors', 'Workshop'],
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Wiring distance sensors to Arduino microcontrollers',
      'Streaming serial packets to ROS 2 nodes',
      'Free kit provided during the workshop session'
    ],
    entryRequirement: 'Bring Laptop • Prior Sign-up Recommended',
    targetAudience: 'Beginner & Intermediate Robotics Students'
  },

  // ================= TOMORROW'S SESSIONS =================
  {
    id: 'sess-06',
    title: 'Sunrise Hilltop Yoga & Morning Asana Practice',
    track: 'Wellness',
    time: '06:30 AM - 07:45 AM',
    duration: '75 mins',
    dateCategory: 'tomorrow',
    venue: 'Kaivalya Hilltop Lawns (Sunrise Point)',
    venueBuildingId: 'kaivalya-dining',
    speaker: 'Acharya Priya Ranjan',
    speakerRole: 'Faculty of Yogic Sciences & Human Consciousness',
    description: 'Invigorating morning Sun Salutations (Surya Namaskar) and gentle spinal alignment overlooking the scenic Mahanadi river valley.',
    status: 'UPCOMING',
    seatsAvailable: 60,
    tags: ['Yoga', 'Sunrise', 'Wellness', 'Pranayama'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    highlights: [
      '12 cycles of classical Surya Namaskar at dawn',
      'Breathwork overlooking Mahanadi river hills',
      'Herbal detox tea served post-session at Kaivalya'
    ],
    entryRequirement: 'Open to All • Yoga Mats Available at Venue',
    targetAudience: 'Early Risers, Students, Faculty & Campus Guests'
  },
  {
    id: 'sess-07',
    title: 'Campus Tour & Biodiversity Walk',
    track: 'Orientation',
    time: '08:30 AM - 10:00 AM',
    duration: '90 mins',
    dateCategory: 'tomorrow',
    venue: 'Starting from Administrative Block Forecourt',
    venueBuildingId: 'admin-block',
    speaker: 'Campus Eco-Ambassadors',
    speakerRole: 'Department of Agriculture & Sustainability',
    description: 'Guided exploration of the scenic green hilltop campus, indigenous Gaushala cattle sanctuary, organic orchards, rainwater harvesting lakes, and sustainable campus architecture.',
    status: 'UPCOMING',
    seatsAvailable: 50,
    tags: ['Campus Tour', 'Eco-friendly', 'Biodiversity'],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Guided walk across 188-acre green hilltop campus',
      'Visit to organic orchards & native Gaushala',
      'Interactive briefing on green architecture & solar grid'
    ],
    entryRequirement: 'Assembly at Admin Forecourt • Free Participation',
    targetAudience: 'New Students, Parents & First-time Campus Visitors'
  },
  {
    id: 'sess-08',
    title: 'Smart Agriculture: IoT Drone Crop Monitoring Demo',
    track: 'Academic',
    time: '11:00 AM - 12:30 PM',
    duration: '90 mins',
    dateCategory: 'tomorrow',
    venue: 'Campus Organic Farm & Polyhouse',
    venueBuildingId: 'campus-gaushala',
    speaker: 'Dr. Sudhir Panigrahi',
    speakerRole: 'Head of Agricultural Sciences & Drone Research',
    description: 'Field flight demonstration showing automated multispectral drone cameras mapping soil moisture, nutrient health, and crop yield forecasting on organic farmland.',
    status: 'UPCOMING',
    seatsAvailable: 40,
    tags: ['Smart Agriculture', 'Drones', 'IoT', 'Organic'],
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Live autonomous quadcopter flight over organic crops',
      'Real-time NDVI vegetation index heatmaps',
      'Precision agriculture & automated irrigation demo'
    ],
    entryRequirement: 'Open Entry at Organic Farm Field 2',
    targetAudience: 'Agriculture, Tech & Environmental Enthusiasts'
  },
  {
    id: 'sess-09',
    title: 'Guest Lecture: Generative AI & Autonomous Driving Future',
    track: 'Academic',
    time: '02:00 PM - 03:30 PM',
    duration: '90 mins',
    dateCategory: 'tomorrow',
    venue: 'Central Library AV Conference Hall, Shruti Complex',
    venueBuildingId: 'shruti-complex',
    speaker: 'Distinguished Industry Fellow',
    speakerRole: 'Autonomous Systems & Edge AI Researcher',
    description: 'Keynote analysis on multi-modal vision-language-action (VLA) models, edge neural inference on mobile robotics, and safety guarantees in urban deployment.',
    status: 'UPCOMING',
    seatsAvailable: 75,
    tags: ['AI Future', 'Autonomous Driving', 'Neural Networks'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Vision-Language-Action (VLA) foundation models',
      'Zero-shot robotics path planning and obstacle safety',
      'Q&A on research internships and global career paths'
    ],
    entryRequirement: 'Open Entry • Shruti Central Library AV Hall',
    targetAudience: 'Computer Science, AI & Electronics Engineers'
  },
  {
    id: 'sess-10',
    title: 'Orion Cultural Festival Planning & Music Showcase',
    track: 'Cultural',
    time: '05:00 PM - 07:00 PM',
    duration: '120 mins',
    dateCategory: 'tomorrow',
    venue: 'Open-Air Theatre (OAT)',
    venueBuildingId: 'oat-amphitheatre',
    speaker: 'Student Cultural Council & Odissi Artists',
    speakerRole: 'Faculty of Performing Arts',
    description: 'Rehearsals, classical Odissi dance preview, Hindustani vocal performances, and coordination meeting for Sri Sri University’s signature annual youth festival Orion.',
    status: 'UPCOMING',
    seatsAvailable: 200,
    tags: ['Orion', 'Culture', 'Music', 'Odissi Dance'],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Classical Odissi dance showcase under the open sky',
      'Live fusion musical performance by student bands',
      'Announcement of Orion 2026 flagship competitions'
    ],
    entryRequirement: 'Free Entry at OAT Amphitheatre',
    targetAudience: 'All University Students & Art Lovers'
  },

  // ================= UPCOMING SESSIONS =================
  {
    id: 'sess-11',
    title: 'National Autonomous Robotics Championship 2026',
    track: 'Robotics & AI',
    time: '09:00 AM - 05:00 PM',
    duration: 'Full Day',
    dateCategory: 'upcoming',
    venue: 'University Sports Arena & Indoor Complex',
    venueBuildingId: 'sports-arena',
    speaker: 'SSU Robotics Club Organizing Committee',
    speakerRole: 'Robotics Club Student Council',
    description: 'All-India inter-college robotics competition featuring autonomous rover obstacle navigation, line-following challenges, and AI humanoid demonstrations.',
    status: 'UPCOMING',
    seatsAvailable: 300,
    tags: ['Championship', 'National Event', 'Robotics Club'],
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=800&q=80',
    highlights: [
      '50+ national collegiate robotics teams competing',
      'Rover obstacle course & high-speed autonomous races',
      'Cash prizes & technical awards ceremony'
    ],
    entryRequirement: 'Team Registration on Portal • Visitor Passes Free',
    targetAudience: 'National Engineering Colleges & Technology Enthusiasts'
  },
  {
    id: 'sess-12',
    title: 'Iconic Tower Project Briefing: Civil & Tech Infrastructure',
    track: 'Academic',
    time: '11:00 AM - 12:30 PM',
    duration: '90 mins',
    dateCategory: 'upcoming',
    venue: 'Executive Council Room, Administrative Block',
    venueBuildingId: 'admin-block',
    speaker: 'Director of Infrastructure & Planning',
    speakerRole: 'Sri Sri University Secretariat',
    description: 'Technical briefing on the upcoming 300,000 sq ft multidisciplinary Iconic Tower, including advanced computing clusters, design studios, and smart auditorium architecture.',
    status: 'UPCOMING',
    seatsAvailable: 35,
    tags: ['Iconic Tower', 'Infrastructure', 'Flagship'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Architectural 3D fly-through of the Iconic Tower',
      'High-performance computing & VR research lab spaces',
      'Timeline for phase 1 campus expansion'
    ],
    entryRequirement: 'Faculty & Invited Student Delegates',
    targetAudience: 'Architecture, Civil, Computing Faculty & Student Council'
  }
];
