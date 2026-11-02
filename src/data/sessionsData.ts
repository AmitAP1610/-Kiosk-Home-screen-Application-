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
    tags: ['Robotics', 'Jetson', 'Nav2', 'Edge AI']
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
    tags: ['Meditation', 'Pranayama', 'Wellness', 'Sattvic']
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
    tags: ['Ayurveda', 'Healthcare', 'Medicine', 'Wellness']
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
    speaker: 'Amit Kumar & SSU Robotics Club Members',
    speakerRole: 'Robotics Club Lead & Student Innovators',
    description: 'Live interactive demonstrations by the Sri Sri University Robotics Club showcasing autonomous rover navigation, ROS 2 LiDAR mapping, and the Kiosk robot architecture.',
    status: 'UPCOMING',
    seatsAvailable: 30,
    tags: ['Robotics Club', 'Autonomous AI', 'ROS 2', 'Demo']
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
    tags: ['Hands-on', 'Arduino', 'Sensors', 'Workshop']
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
    tags: ['Yoga', 'Sunrise', 'Wellness', 'Pranayama']
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
    tags: ['Campus Tour', 'Eco-friendly', 'Biodiversity']
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
    tags: ['Smart Agriculture', 'Drones', 'IoT', 'Organic']
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
    tags: ['AI Future', 'Autonomous Driving', 'Neural Networks']
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
    tags: ['Orion', 'Culture', 'Music', 'Odissi Dance']
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
    tags: ['Championship', 'National Event', 'Robotics Club']
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
    tags: ['Iconic Tower', 'Infrastructure', 'Flagship']
  }
];
