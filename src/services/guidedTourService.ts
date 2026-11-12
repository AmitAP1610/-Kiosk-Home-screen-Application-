/**
 * Sri Sri University Autonomous Guest Escort & Sequential Waypoint Tour Service
 * 
 * Manages the complete mission lifecycle:
 * Stage 1: Spoken Self-Introduction & Route Briefing (Point A -> Point B)
 * Stage 2: In-Transit Autonomous Escort & Real-time Progress Tracking (Jetson Nav2)
 * Stage 3: Destination Arrival Announcement & Rich On-Site Facility Briefing
 * Stage 4: Sequential Mission Advancement (Point A -> Point B -> Point C ...) & Stored History
 */

import { jetsonBridge } from './jetsonBridge';
import { textToSpeech } from './textToSpeech';

export interface CampusWaypoint {
  id: string;
  code: string;            // 'A', 'B', 'C', 'D', 'E', 'F', 'G'
  name: string;
  category: 'Academic' | 'Healthcare' | 'Innovation' | 'Dining' | 'Administration' | 'Cultural';
  coordinates: { x: number; y: number; yaw: number };
  image: string;
  introText: string;        // Spoken before moving: "I will now guide you from Point A to Point B..."
  inTransitText: string;    // Spoken mid-way: "Navigating along central campus avenue..."
  arrivalAnnouncement: string; // Spoken on arrival: "We have arrived at your destination..."
  briefing: {
    title: string;
    description: string;
    facultiesInside: string[];
    hours: string;
    contactDesk?: string;
    keyHighlights: string[];
  };
}

export type EscortStage =
  | 'IDLE'               // Standby / Selecting route
  | 'INTRODUCING'        // Speaking self-introduction & escort instructions
  | 'EN_ROUTE'           // Navigating along path towards destination
  | 'ARRIVED'            // Reached destination, delivering spoken arrival briefing
  | 'COMPLETED';         // Mission finished, logged to storage

export interface GuidedMission {
  id: string;
  timestamp: number;
  origin: CampusWaypoint;
  destination: CampusWaypoint;
  sequenceIndex: number;
  totalInSequence: number;
  distanceTraveledMeters: number;
  durationSeconds: number;
  status: 'completed' | 'cancelled';
}

export interface TourSequencePlan {
  id: string;
  name: string;
  description: string;
  stops: CampusWaypoint[];
}

export const SSU_DEFAULT_WAYPOINTS: CampusWaypoint[] = [
  {
    id: 'wp-a',
    code: 'A',
    name: 'SSU Main Entrance & Welcome Plaza',
    category: 'Administration',
    coordinates: { x: 0.0, y: 0.0, yaw: 0.0 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'Namaste! Welcome to Sri Sri University. I am Kiosk, your autonomous campus guide created by the Sri Sri University Robotics Club. I will now guide you safely from the Main Entrance to your destination. Please stay close and follow me.',
    inTransitText: 'Departing the Main Welcome Plaza. Proceeding along the central boulevard.',
    arrivalAnnouncement: 'We have arrived at the SSU Main Entrance and Welcome Plaza. Here visitors can register, pick up orientation passes, and find campus transport.',
    briefing: {
      title: 'Main Entrance & Visitor Welcome Plaza',
      description: 'The ceremonial gateway to Sri Sri University. Welcomes visitors, delegates, and students with 24/7 security reception and campus information.',
      facultiesInside: ['Visitor Reception Desk', 'Campus Security Control', 'Orientation Kiosks'],
      hours: '24 Hours Open',
      contactDesk: 'Security Control: Gate 1',
      keyHighlights: ['Automated Visitor Registration', 'Campus EV Shuttle Hub', 'Emergency Call Box']
    }
  },
  {
    id: 'wp-b',
    code: 'B',
    name: 'Shruti Academic Complex & Central Library',
    category: 'Academic',
    coordinates: { x: -8.5, y: 12.0, yaw: 1.57 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'I will now escort you to the Shruti Academic Complex and Central Library. Setting safe autonomous navigation trajectory now. Please follow me.',
    inTransitText: 'Navigating along the central academic avenue. Shruti Complex is located ahead on your left.',
    arrivalAnnouncement: 'We have safely arrived at your destination: Shruti Academic Complex and Central Library! This iconic four-tier complex is the intellectual heart of Sri Sri University. It houses our central library with over 50,000 volumes, research archives, silent study carrels, and the Faculty of Emerging Technologies. Please touch the screen for building details or to proceed to your next stop.',
    briefing: {
      title: 'Shruti Academic Complex & Central Library',
      description: 'Sri Sri University\'s primary academic hub featuring multi-level digital reading rooms, research cubicles, and seminar halls.',
      facultiesInside: ['Faculty of Emerging Technologies (AI & Robotics)', 'Faculty of Management Studies', 'Central University Library'],
      hours: '08:00 AM – 10:00 PM Daily',
      contactDesk: 'Librarian Helpdesk (Level 1)',
      keyHighlights: ['50,000+ Print & E-Books', 'Research Journal Repositories', '24/7 High-Speed Wi-Fi', 'Audio-Visual Presentation Theaters']
    }
  },
  {
    id: 'wp-c',
    code: 'C',
    name: 'Sri Sri Ayurveda Hospital & Wellness Center',
    category: 'Healthcare',
    coordinates: { x: 18.4, y: -6.2, yaw: -1.57 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'Guiding you to the Sri Sri Ayurveda Hospital and Research Center. Following safe hospital zone speed protocol.',
    inTransitText: 'Proceeding towards the wellness quadrangle on the south ridge.',
    arrivalAnnouncement: 'Welcome to your destination: Sri Sri Ayurveda Hospital! This is a 100-bed NABH-accredited integrated healthcare facility combining ancient Ayurvedic medicine with modern diagnostic and casualty care. Specialized facilities include Panchakarma therapy suites, Nadi Pariksha, and holistic rehabilitation.',
    briefing: {
      title: 'Sri Sri Ayurveda Hospital (NABH Accredited)',
      description: 'NABH-accredited hospital providing authentic traditional Ayurvedic therapies integrated with modern allopathic diagnostics and round-the-clock emergency care.',
      facultiesInside: ['Faculty of Ayurveda (BAMS)', 'Panchakarma Treatment Suites', 'Diagnostic Radiology & Pathology'],
      hours: '24 Hours Emergency Casualty, OPD: 09:00 AM – 05:00 PM',
      contactDesk: 'Hospital Reception (Ground Floor)',
      keyHighlights: ['100+ In-patient Beds', '8 Specialized Ayurvedic OPD Chambers', 'Holistic Wellness & Herbal Pharmacy', '24/7 Ambulance & Casualty']
    }
  },
  {
    id: 'wp-d',
    code: 'D',
    name: 'Robotics Club Maker Lab & Tech Hub',
    category: 'Innovation',
    coordinates: { x: 4.2, y: 2.1, yaw: 0.0 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'Taking you to my home: the Sri Sri University Robotics Club Maker Lab! Let us head over to the tech hub.',
    inTransitText: 'Approaching the innovation zone. Student engineers are actively developing robotics projects inside.',
    arrivalAnnouncement: 'We have reached our destination: the Sri Sri University Robotics Club Maker Lab! This is where I was designed, 3D printed, wired, and programmed by student engineers. The lab features high-precision 3D printers, ROS 2 workstations, sensor testbeds, and autonomous mobile robotics development arenas.',
    briefing: {
      title: 'Robotics Club Maker Lab & Research Arena',
      description: 'The student innovation epicenter where autonomous ground vehicles, drone avionics, and AI vision systems are prototyped and tested.',
      facultiesInside: ['Sri Sri University Robotics Club', 'Department of Computer Science & Engineering', 'IoT & Embedded Hardware Lab'],
      hours: '08:00 AM – 09:00 PM',
      contactDesk: 'Student Lead Workstation',
      keyHighlights: ['High-Precision CoreXY 3D Printers', 'Nvidia Jetson AI Development Benches', 'LiDAR & SLAM Indoor Test Arena', 'Multi-Layer PCB Prototyping']
    }
  },
  {
    id: 'wp-e',
    code: 'E',
    name: 'Kaivalya Dining Hall (Pure Sattvic Dining)',
    category: 'Dining',
    coordinates: { x: -14.2, y: -5.5, yaw: 3.14 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'Guiding you to the Kaivalya Dining Hall. Safe transit path calculated.',
    inTransitText: 'Moving along the residential avenue towards Kaivalya Hall.',
    arrivalAnnouncement: 'We have arrived at your destination: Kaivalya Dining Hall! Kaivalya serves 100% pure vegetarian, fresh, hygienic Sattvic meals prepared with love and mindful nutrition for all university students, faculty, and visiting guests.',
    briefing: {
      title: 'Kaivalya Central Dining Complex',
      description: 'A spacious community dining hall serving wholesome Sattvic meals sourced directly from university organic farms.',
      facultiesInside: ['Main Dining Hall (1,200 seats)', 'Faculty Dining Lounge', 'Filtered Water Refill Stations'],
      hours: 'Breakfast: 07:30–09:30 | Lunch: 12:30–14:30 | Dinner: 19:30–21:30',
      contactDesk: 'Hospitality Office',
      keyHighlights: ['100% Sattvic Vegetarian Menu', 'Organic Produce from Campus Farm', 'Eco-Friendly Zero-Waste Composting']
    }
  },
  {
    id: 'wp-f',
    code: 'F',
    name: 'Open-Air Amphitheatre (OAT)',
    category: 'Cultural',
    coordinates: { x: 12.8, y: 14.6, yaw: 0.78 },
    image: '/assets/ssu-iconic-building-Eyr5s_bN.jpg',
    introText: 'Guiding you to the scenic Open-Air Theatre on the campus hillside. Let us proceed.',
    inTransitText: 'Ascending towards the amphitheatre terrace overlooking the valley.',
    arrivalAnnouncement: 'We have arrived at the Open-Air Amphitheatre! Overlooking the Mahanadi river valley, this scenic arena hosts university cultural festivals, annual symposia, yoga conclaves, and musical evenings under the stars.',
    briefing: {
      title: 'Sri Sri University Open-Air Amphitheatre',
      description: 'An open-air amphitheatre set against the picturesque hillside, hosting campus events, convocation evenings, and yoga gatherings.',
      facultiesInside: ['Faculty of Performing Arts', 'Cultural Events Council', 'Open Arena Seating'],
      hours: 'Open for Campus Events & Evening Gatherings',
      contactDesk: 'Cultural Affairs Desk',
      keyHighlights: ['2,500 Spectator Tiered Seating', 'Acoustic Natural Hillside Shell', 'Panoramic Sunset Views']
    }
  }
];

export const PRESET_TOUR_SEQUENCES: TourSequencePlan[] = [
  {
    id: 'tour-vip',
    name: 'Campus VIP & Guest Orientation Tour',
    description: 'Full guided tour: Welcome Plaza → Central Library → Maker Lab → Ayurveda Hospital → Kaivalya Hall',
    stops: [
      SSU_DEFAULT_WAYPOINTS[0], // A: Main Gate
      SSU_DEFAULT_WAYPOINTS[1], // B: Library
      SSU_DEFAULT_WAYPOINTS[3], // D: Maker Lab
      SSU_DEFAULT_WAYPOINTS[2], // C: Hospital
      SSU_DEFAULT_WAYPOINTS[4]  // E: Dining
    ]
  },
  {
    id: 'tour-academic',
    name: 'Academic & Tech Innovation Tour',
    description: 'Welcome Plaza → Shruti Academic Complex & Central Library → Robotics Maker Lab',
    stops: [
      SSU_DEFAULT_WAYPOINTS[0], // A: Main Gate
      SSU_DEFAULT_WAYPOINTS[1], // B: Library
      SSU_DEFAULT_WAYPOINTS[3]  // D: Maker Lab
    ]
  },
  {
    id: 'tour-wellness',
    name: 'Healthcare & Wellness Tour',
    description: 'Welcome Plaza → Sri Sri Ayurveda Hospital & Research Center',
    stops: [
      SSU_DEFAULT_WAYPOINTS[0], // A: Main Gate
      SSU_DEFAULT_WAYPOINTS[2]  // C: Hospital
    ]
  }
];

export interface TourServiceState {
  stage: EscortStage;
  origin: CampusWaypoint;
  destination: CampusWaypoint;
  sequence: CampusWaypoint[];
  sequenceIndex: number;
  distanceRemainingMeters: number;
  progressPercent: number;
  missionStartTime: number | null;
  durationSeconds: number;
  isAudioMuted: boolean;
  activeSpeechText: string | null;
  completedMissions: GuidedMission[];
}

export type TourStateListener = (state: TourServiceState) => void;

class GuidedTourService {
  private waypoints: CampusWaypoint[] = [...SSU_DEFAULT_WAYPOINTS];
  private state: TourServiceState;
  private listeners: Set<TourStateListener> = new Set();
  private progressInterval: any = null;
  private inTransitAnnounced: boolean = false;

  constructor() {
    this.state = {
      stage: 'IDLE',
      origin: SSU_DEFAULT_WAYPOINTS[0],
      destination: SSU_DEFAULT_WAYPOINTS[1],
      sequence: [SSU_DEFAULT_WAYPOINTS[0], SSU_DEFAULT_WAYPOINTS[1]],
      sequenceIndex: 1,
      distanceRemainingMeters: 0,
      progressPercent: 0,
      missionStartTime: null,
      durationSeconds: 0,
      isAudioMuted: false,
      activeSpeechText: null,
      completedMissions: []
    };

    if (typeof window !== 'undefined') {
      this.loadSavedHistory();
      this.loadCustomWaypoints();
    }
  }

  private loadSavedHistory() {
    try {
      const saved = localStorage.getItem('kiosk_mission_history');
      if (saved) {
        this.state.completedMissions = JSON.parse(saved);
      }
    } catch {}
  }

  private loadCustomWaypoints() {
    try {
      const saved = localStorage.getItem('kiosk_custom_waypoints');
      if (saved) {
        const custom: CampusWaypoint[] = JSON.parse(saved);
        if (Array.isArray(custom) && custom.length > 0) {
          this.waypoints = [...SSU_DEFAULT_WAYPOINTS, ...custom];
        }
      }
    } catch {}
  }

  public getWaypoints(): CampusWaypoint[] {
    return [...this.waypoints];
  }

  public getState(): TourServiceState {
    return { ...this.state };
  }

  public subscribe(listener: TourStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => {
      try {
        l(s);
      } catch {}
    });
  }

  public toggleMute(): boolean {
    this.state.isAudioMuted = !this.state.isAudioMuted;
    if (this.state.isAudioMuted) {
      textToSpeech.stop();
    }
    this.notify();
    return this.state.isAudioMuted;
  }

  /**
   * STAGE 1: Starts a guided escort mission from Point A to Point B
   */
  public async startMission(
    origin: CampusWaypoint,
    destination: CampusWaypoint,
    onSpeechCallback?: (text: string, onEnd?: () => void) => void
  ) {
    this.stopProgressTracking();
    this.inTransitAnnounced = false;

    // Calculate initial straight-line distance
    const dist = Math.hypot(
      destination.coordinates.x - origin.coordinates.x,
      destination.coordinates.y - origin.coordinates.y
    );

    this.state.stage = 'INTRODUCING';
    this.state.origin = origin;
    this.state.destination = destination;
    this.state.sequence = [origin, destination];
    this.state.sequenceIndex = 1;
    this.state.distanceRemainingMeters = Math.max(8.0, dist);
    this.state.progressPercent = 0;
    this.state.missionStartTime = Date.now();
    this.state.durationSeconds = 0;

    // Introduction speech
    const introText = destination.introText ||
      `Namaste! Welcome to Sri Sri University. I am Kiosk, your autonomous campus guide created by the Robotics Club. I will now guide you safely from ${origin.name} to ${destination.name}. Please stay close and follow me!`;

    this.state.activeSpeechText = introText;
    this.notify();

    // Speak introduction in baritone voice
    if (!this.state.isAudioMuted) {
      if (onSpeechCallback) {
        onSpeechCallback(introText, () => {
          this.transitionToEnRoute();
        });
      } else {
        try {
          await textToSpeech.speak(introText, { pitch: 0.74, rate: 0.86 });
        } catch {}
        this.transitionToEnRoute();
      }
    } else {
      setTimeout(() => this.transitionToEnRoute(), 2000);
    }
  }

  /**
   * STAGE 1 (Multi-Stop): Starts a sequence of waypoints (e.g. A -> B -> C -> D)
   */
  public async startSequencePlan(
    plan: TourSequencePlan,
    onSpeechCallback?: (text: string, onEnd?: () => void) => void
  ) {
    if (!plan.stops || plan.stops.length < 2) return;
    this.state.sequence = [...plan.stops];
    this.state.sequenceIndex = 1;
    await this.startMission(plan.stops[0], plan.stops[1], onSpeechCallback);
  }

  /**
   * STAGE 2: Transition from Introduction to Active Escort (Moving)
   */
  public transitionToEnRoute() {
    if (this.state.stage !== 'INTRODUCING') return;

    this.state.stage = 'EN_ROUTE';
    this.state.activeSpeechText = `Escorting guest to ${this.state.destination.name}...`;
    this.notify();

    // 1. Dispatch real ROS 2 / Nav2 navigation goal to Jetson
    const dest = this.state.destination;
    jetsonBridge.sendNavGoal(
      dest.coordinates.x,
      dest.coordinates.y,
      dest.coordinates.yaw,
      dest.name
    );

    // 2. Start progress tracking loop
    this.startProgressTracking();
  }

  private startProgressTracking() {
    this.stopProgressTracking();
    const totalDist = this.state.distanceRemainingMeters || 20;

    this.progressInterval = setInterval(() => {
      if (this.state.stage !== 'EN_ROUTE') return;

      // Check real Jetson robot pose if connected
      const jetsonState = jetsonBridge.getState();
      const dest = this.state.destination;

      let currentDist = this.state.distanceRemainingMeters;

      if (jetsonState.status === 'connected') {
        const realDist = Math.hypot(
          dest.coordinates.x - jetsonState.robotPose.x,
          dest.coordinates.y - jetsonState.robotPose.y
        );
        currentDist = realDist;
      } else {
        // Standalone simulation for kiosk demo mode: decrement distance gradually
        currentDist = Math.max(0, currentDist - 0.4);
      }

      this.state.distanceRemainingMeters = Number(currentDist.toFixed(1));
      const pct = Math.min(100, Math.max(0, Math.round(((totalDist - currentDist) / totalDist) * 100)));
      this.state.progressPercent = pct;

      if (this.state.missionStartTime) {
        this.state.durationSeconds = Math.round((Date.now() - this.state.missionStartTime) / 1000);
      }

      // Mid-transit spoken reassurance at ~50%
      if (pct >= 45 && pct <= 60 && !this.inTransitAnnounced && !this.state.isAudioMuted) {
        this.inTransitAnnounced = true;
        const transitText = dest.inTransitText || `We are en route to ${dest.name}. Distance remaining: ${Math.round(currentDist)} meters.`;
        textToSpeech.speak(transitText, { pitch: 0.74, rate: 0.86 }).catch(() => {});
      }

      // Check arrival condition: within 1.2 meters of goal
      if (currentDist <= 1.2 || pct >= 100) {
        this.reachDestination();
      } else {
        this.notify();
      }
    }, 500);
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * STAGE 3: Destination Reached - Delivers arrival announcement & rich briefing
   */
  public async reachDestination(onSpeechCallback?: (text: string, onEnd?: () => void) => void) {
    this.stopProgressTracking();
    jetsonBridge.stopTeleop();

    this.state.stage = 'ARRIVED';
    this.state.distanceRemainingMeters = 0;
    this.state.progressPercent = 100;

    const dest = this.state.destination;
    const arrivalText = dest.arrivalAnnouncement ||
      `We have arrived at your destination: ${dest.name}. Here you will find our key academic facilities. Touch the screen to see building details or to proceed to your next stop.`;

    this.state.activeSpeechText = arrivalText;
    this.notify();

    // Log completed leg into history
    this.recordCompletedMission();

    // Speak arrival announcement in baritone voice
    if (!this.state.isAudioMuted) {
      if (onSpeechCallback) {
        onSpeechCallback(arrivalText);
      } else {
        try {
          await textToSpeech.speak(arrivalText, { pitch: 0.74, rate: 0.86 });
        } catch {}
      }
    }
  }

  /**
   * STAGE 4: Advances to the next sequential waypoint if part of a multi-stop tour
   */
  public async proceedToNextStop(onSpeechCallback?: (text: string, onEnd?: () => void) => void) {
    const nextIdx = this.state.sequenceIndex + 1;
    if (nextIdx < this.state.sequence.length) {
      const nextOrigin = this.state.sequence[this.state.sequenceIndex];
      const nextDest = this.state.sequence[nextIdx];
      this.state.sequenceIndex = nextIdx;
      await this.startMission(nextOrigin, nextDest, onSpeechCallback);
    } else {
      // Entire tour sequence complete
      this.completeTour();
    }
  }

  public completeTour() {
    this.stopProgressTracking();
    this.state.stage = 'COMPLETED';
    this.state.activeSpeechText = 'Guided tour sequence completed successfully. Thank you for visiting Sri Sri University!';
    this.notify();

    if (!this.state.isAudioMuted) {
      textToSpeech.speak(this.state.activeSpeechText, { pitch: 0.74, rate: 0.86 }).catch(() => {});
    }
  }

  public cancelMission() {
    this.stopProgressTracking();
    jetsonBridge.cancelNavGoal();
    textToSpeech.stop();

    if (this.state.stage === 'EN_ROUTE' || this.state.stage === 'INTRODUCING') {
      const mission: GuidedMission = {
        id: 'mission_' + Date.now(),
        timestamp: Date.now(),
        origin: this.state.origin,
        destination: this.state.destination,
        sequenceIndex: this.state.sequenceIndex,
        totalInSequence: this.state.sequence.length,
        distanceTraveledMeters: 0,
        durationSeconds: this.state.durationSeconds,
        status: 'cancelled'
      };
      this.saveMission(mission);
    }

    this.state.stage = 'IDLE';
    this.state.activeSpeechText = null;
    this.state.distanceRemainingMeters = 0;
    this.state.progressPercent = 0;
    this.notify();
  }

  private recordCompletedMission() {
    const mission: GuidedMission = {
      id: 'mission_' + Date.now(),
      timestamp: Date.now(),
      origin: this.state.origin,
      destination: this.state.destination,
      sequenceIndex: this.state.sequenceIndex,
      totalInSequence: this.state.sequence.length,
      distanceTraveledMeters: Number((Math.hypot(
        this.state.destination.coordinates.x - this.state.origin.coordinates.x,
        this.state.destination.coordinates.y - this.state.origin.coordinates.y
      )).toFixed(1)),
      durationSeconds: this.state.durationSeconds || 18,
      status: 'completed'
    };
    this.saveMission(mission);
  }

  private saveMission(mission: GuidedMission) {
    this.state.completedMissions = [mission, ...this.state.completedMissions.slice(0, 49)];
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('kiosk_mission_history', JSON.stringify(this.state.completedMissions));
      }
    } catch {}
  }

  public clearHistory() {
    this.state.completedMissions = [];
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kiosk_mission_history');
      }
    } catch {}
    this.notify();
  }
}

export const guidedTourService = new GuidedTourService();
