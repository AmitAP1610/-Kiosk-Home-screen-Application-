/**
 * Sri Sri University Robot Information Data (KAIRO)
 * Details for "How Made, Who Made, Mention Members" (Notebook Wireframe Section 5)
 */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  contributions: string[];
  avatarInitial: string;
  badge?: string;
}

export interface HardwareTier {
  tierNumber: number;
  name: string;
  hardware: string;
  responsibilities: string[];
  status: 'ONLINE' | 'ACTIVE' | 'SAFE' | 'STANDBY';
  specs: string;
}

export interface RobotSpecification {
  category: string;
  label: string;
  value: string;
  detail: string;
}

export const ROBOT_INFO = {
  name: 'KIOSK',
  fullName: 'Sri Sri University Autonomous AI Campus Assistant Robot (KIOSK)',
  version: '2.4.0 (Tablet OS)',
  motto: 'Learn, Lead, Serve',
  networkIp: '172.17.0.1', // Drawn on wireframe
  status: 'OPERATIONAL',
  chassisModel: 'Beveled Polygon Head with Cyan LED Illumination',
  batteryLevel: 94,
  uptimeHours: 6.8,

  summary: 'Kiosk is an intelligent autonomous service robot engineered from the ground up by the passionate students and mentors of the Sri Sri University Robotics Club. Powered by a 3-tier architecture combining an Android tablet interface, NVIDIA Jetson edge robotics computer, and Arduino safety watchdog.',

  audioStory: 'Hello! I am Kiosk, designed and engineered by the passionate innovators of the Sri Sri University Robotics Club! My brain is divided into three tiers: this Realme tablet handles my eyes, face, voice, and interactive screen. An NVIDIA Jetson processor behind me calculates LiDAR mapping and obstacle avoidance using ROS 2. And an Arduino microcontroller safely drives my high-torque planetary motors with a three hundred millisecond watchdog. I am proud to be made by the Sri Sri Robotics Club right here at Sri Sri University!',

  // How Made: 3-Tier Architecture
  architectureTiers: [
    {
      tierNumber: 1,
      name: 'Layer 1: Realme Android Tablet',
      hardware: 'Realme Pad 10.4" 2K IPS Display (ARM Octa-Core)',
      responsibilities: [
        'Pure-black SVG robot face with procedural cyan glowing eyes, smile, and natural blink cycles',
        'Web Speech API: Low-latency speech recognition (STT) and voice synthesis (TTS) with viseme lip-sync',
        'Tablet Touch UI: Interactive Campus Map, University Directory, Sessions & Agenda, and Diagnostics',
        'Front camera visual gaze tracking and attentive face orientation'
      ],
      status: 'ACTIVE',
      specs: '10.4-inch 2K Display, Android 13, 7100mAh Internal Battery, Touchscreen'
    },
    {
      tierNumber: 2,
      name: 'Layer 2: NVIDIA Jetson Edge Computer',
      hardware: 'NVIDIA Jetson Embedded AI Computer (GPU Accelerated)',
      responsibilities: [
        'ROS 2 (Robot Operating System) Nav2 autonomous navigation stack',
        '2D 360-degree LiDAR SLAM (Simultaneous Localization and Mapping) with real-time occupancy grid',
        'Dynamic obstacle detection, local costmaps, and kinematic trajectory planning',
        'WebSocket & REST bidirectional telemetry bridge to tablet layer'
      ],
      status: 'ONLINE',
      specs: 'NVIDIA Maxwell/Orin GPU, Quad-Core ARM CPU, 2D 12m LiDAR, USB 3.0 Bridge'
    },
    {
      tierNumber: 3,
      name: 'Layer 3: Arduino Motor Controller',
      hardware: 'Arduino Mega 2560 (8-bit AVR RISC @ 16MHz)',
      responsibilities: [
        'Dual high-torque geared planetary DC motor control with PWM speed profiling',
        'Optical quadrature encoder odometry feedback at 500 pulses per revolution',
        'Strict 300ms communication watchdog timer (auto-halts motors on packet drop)',
        'Physical emergency stop (E-Stop) relay safety circuit cutout'
      ],
      status: 'SAFE',
      specs: 'Dual 24V 150W Geared Motors, 20A MOSFET H-Bridge, Hardware Relay Cutout'
    }
  ] as HardwareTier[],

  // Hardware Specifications
  specifications: [
    { category: 'Compute', label: 'Primary UI Unit', value: 'Realme Android Tablet', detail: 'Runs React/TypeScript/Vite Touch OS' },
    { category: 'Compute', label: 'Robotics Brain', value: 'NVIDIA Jetson AI Node', detail: 'Runs ROS 2 Nav2 & SLAM' },
    { category: 'Compute', label: 'Microcontroller', value: 'Arduino Mega 2560', detail: '300ms Watchdog & Motor PWM' },
    { category: 'Network', label: 'Internal Static IP', value: '172.17.0.1', detail: 'High-speed local robot subnet' },
    { category: 'Power', label: 'Battery Chemistry', value: '24V 20Ah LiFePO4', detail: 'Over 8 hours continuous autonomous run' },
    { category: 'Mobility', label: 'Drive Mechanism', value: 'Differential Drive', detail: 'Two active drive wheels + dual casters' },
    { category: 'Mobility', label: 'Maximum Speed', value: '0.8 m/s (2.88 km/h)', detail: 'Safety limited for indoor pedestrian spaces' },
    { category: 'Sensors', label: 'LiDAR Sensor', value: '360° 2D Laser Scanner', detail: '12-meter detection radius @ 10Hz' },
    { category: 'Chassis', label: 'Dimensions', value: '110 × 42 × 42 cm', detail: 'Beveled polygon head & tapered body' },
    { category: 'Chassis', label: 'Total Weight', value: '18.5 kg', detail: 'Balanced low center of gravity' }
  ] as RobotSpecification[],

  // Who Made: Team Members ("Mention Members" from notebook wireframe)
  teamMembers: [
    {
      id: 'member-1',
      name: 'Amit Kumar',
      role: 'Project Lead & Robotics System Architect',
      department: 'Faculty of Emerging Technologies & AI',
      contributions: [
        'Conceptualized, architected, and built Kiosk from hardware to software',
        'Engineered the 3-tier tablet + Jetson + Arduino inter-process communication',
        'Designed the responsive tablet UI, voice assistant integration, and ROS 2 mapping pipeline',
        'Led mechanical assembly, wiring schematics, and overall university deployment'
      ],
      avatarInitial: 'AK',
      badge: 'Project Lead'
    },
    {
      id: 'member-2',
      name: 'Hardware & Embedded Team',
      role: 'Embedded Firmware & Power Electronics',
      department: 'Department of Electrical & Computer Engineering',
      contributions: [
        'Programmed Arduino Mega motor PWM controllers with optical encoder odometry',
        'Implemented the 300ms communication watchdog failsafe and hardware E-Stop relay',
        'Assembled the 24V LiFePO4 battery distribution board and voltage regulation stages'
      ],
      avatarInitial: 'ET',
      badge: 'Embedded'
    },
    {
      id: 'member-3',
      name: 'AI & Speech Systems Team',
      role: 'Voice Assistant & Natural Language',
      department: 'Department of AI, Machine Learning & Data Science',
      contributions: [
        'Developed the browser Web Speech API STT and TTS engine with viseme sync',
        'Compiled the Sri Sri University official knowledge base and FAQ fuzzy matcher',
        'Tuned voice parameters for crystal-clear natural speech on tablet speakers'
      ],
      avatarInitial: 'AI',
      badge: 'AI & Speech'
    },
    {
      id: 'member-4',
      name: 'Mechanical & Fabrication Team',
      role: 'CAD Modeling & Physical Assembly',
      department: 'Robotics Club & Maker Space, SSU',
      contributions: [
        'Modeled the iconic beveled polygon head enclosure and tablet bezel frame',
        'Precision 3D printed components and CNC laser-cut internal chassis brackets',
        'Integrated sleek cyan LED diffuse edge-glow strips and anti-vibration dampers'
      ],
      avatarInitial: 'MT',
      badge: 'Mechanical'
    }
  ] as TeamMember[],

  // Mentorship & Robotics Club Support
  institutionalSupport: {
    university: 'Sri Sri University (SSU), Cuttack, Odisha',
    faculty: 'Faculty of Emerging Technologies & AI',
    club: 'Robotics Club • Sri Sri University',
    logoUrl: '/robotics-club-logo.jpg',
    clubStory: 'The Sri Sri University Robotics Club is an active student-driven technology community uniting passionate roboticists, embedded engineers, and AI developers. From autonomous rovers and robotic arms to mobile service assistants like Kiosk, the club empowers students to turn theoretical algorithms into real physical robots.',
    motto: 'Learn, Lead, Serve',
    advisors: [
      'Prof. Rajendra Kumar Sharma — Faculty Mentor & Advisor',
      'Sri Sri University Robotics Club Student Council',
      'Faculty of Emerging Technologies & Computing'
    ]
  }
};

