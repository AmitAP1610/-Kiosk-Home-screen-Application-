# System Architecture & Layer Boundaries
## KIOSK — Sri Sri University Autonomous AI Campus Robot
**Engineered by the Sri Sri University Robotics Club**

---

## 1. Hardware-to-Software Responsibility Matrix

The KIOSK robot employs a strict 3-tier distributed processing architecture to guarantee zero-latency user interaction, resilient autonomous navigation, and absolute motor safety:

```
┌────────────────────────────────────────────────────────┐
│ TIER 1: REALME ANDROID TABLET (Touch & Interaction OS)  │
│ • Runs React 18 / TypeScript / Vite UI                 │
│ • Procedural animated SVG robot face & eye tracking     │
│ • Web Speech API STT (Recognition) & TTS (Synthesis)   │
│ • Campus Highlights & Facilities photo guide & audio tours │
│ • Static IP: 172.17.0.1                                │
└───────────────────────────┬────────────────────────────┘
                            │ WebSocket / REST over Local Wi-Fi
                            ▼
┌────────────────────────────────────────────────────────┐
│ TIER 2: NVIDIA JETSON EDGE AI (Autonomous Brain)       │
│ • Runs Ubuntu Linux + ROS 2 (Humble)                   │
│ • 2D LiDAR Driver & SLAM (Cartographer / Slam Toolbox) │
│ • Nav2 Path Planning, Costmaps & Obstacle Avoidance    │
│ • Telemetry Aggregator & WebSocket Bridge Server       │
└───────────────────────────┬────────────────────────────┘
                            │ USB Serial (115200 Baud, Checksum)
                            ▼
┌────────────────────────────────────────────────────────┐
│ TIER 3: ARDUINO MEGA 2560 (Motor Drive & Safety)        │
│ • Dual Planetary DC Motor PWM Speed Profiling          │
│ • Quadrature Optical Encoder Odometry (500 CPR)        │
│ • 300ms Watchdog Timer (Automatic Zero-PWM Cutout)     │
│ • Physical & Software E-Stop Hardware Relay            │
└────────────────────────────────────────────────────────┘
```

---

## 2. Tier Responsibility Breakdown

| Processing Layer | Hardware Target | Mandatory Responsibilities | Forbidden Responsibilities |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Interface)** | **Realme Android Tablet** (10.4" 2K Display) | Face rendering, eye gaze tracking, Web Speech API audio, campus highlights guide, timetable, tablet UI | LiDAR data ingestion, SLAM computation, direct motor PWM control |
| **Tier 2 (Robotics)** | **NVIDIA Jetson Edge Node** (GPU Accelerated) | 2D LiDAR scanning, occupancy grid SLAM, Nav2 trajectory calculation, dynamic obstacle avoidance | Microphone audio capture, speech recognition, tablet UI rendering |
| **Tier 3 (Actuation)** | **Arduino Mega 2560** (16 MHz AVR) | H-bridge motor PWM, encoder odometry counting, 300ms watchdog timer, emergency stop cutout | High-level path planning, speech synthesis, AI language processing |

---

## 3. Core Architectural Invariants

1. **Tablet Independence Invariant:**
   * The tablet interface operates autonomously. If the NVIDIA Jetson or Arduino is powered down, disconnected, or restarting, the tablet face, voice guidance, campus map, and agenda remain 100% functional.
2. **Zero Direct AI-to-Motor Access Invariant:**
   * No user voice prompt, AI service, or UI element can directly actuate the robot's drive motors. All motion requests must be routed as high-level intent packets to Tier 2 (Jetson Nav2), which validates obstacles via LiDAR before issuing motor commands to Tier 3.
3. **Hardwired Watchdog Invariant:**
   * The Arduino firmware enforces a 300ms communication timeout. If a valid, checksum-verified speed packet is not received within 300ms, the Arduino immediately halts motor PWM output.

---

## 4. UI Screen Navigation Structure

1. **Screen ① — Face Screen (`FaceScreen.tsx`):**
   * Network IP `172.17.0.1` badge at top-left.
   * Procedural cyan glowing eyes with natural blink cycles and viseme lip-sync.
   * Spoken welcome introduction with calibrated deep male baritone tone.
   * **Stays on the Face screen** after speech completes until explicitly tapped or touched.
2. **Screen ② — Campus Hub (`HubScreen.tsx`):**
   * Central touch menu with 3 large circular modules:
     * `1. Robo Info`
     * `2. Map & SSU Info`
     * `3. Sessions / Agenda`
   * Back button at top-left returns to Face Screen.
   * Bottom gallery strip and minimize/maximize buttons removed for kiosk touch reliability.
3. **Screen ③ — Map, SLAM & Teleoperation (`MapInfoScreen.tsx`):**
   * Live HTML5 Canvas subscriber rendering real-time ROS 2D SLAM Occupancy Grid (`/map`).
   * Touch joystick sending continuous 10 Hz `/cmd_vel` velocity pulses to Jetson Nav2.
   * Leaflet GIS with Esri Satellite, CartoDB Dark, and OpenStreetMap views.
   * Verified GPS coordinates for Sri Sri University buildings with click-to-speak audio tours.
4. **Screen ④ — Sessions & Agenda (`SessionsAgendaScreen.tsx`):**
   * 12 verified and dummy university sessions across Today, Tomorrow, and Upcoming.
   * Filterable by track and date with speech summary and venue locator.
5. **Screen ⑤ — Robo Info (`RoboInfoScreen.tsx`):**
   * Official Sri Sri University Robotics Club gold emblem.
   * Club origin story, basic college info, and 3-tier architecture.
   * Team members and live telemetry with Giant Kiosk Font Mode toggle.

---

## 5. Sequential Autonomous Guided Escort Architecture (Point A → Point B)

To fulfill the guest orientation requirement ("Introduce yourself, guide guest from Point A to Point B, announce destination arrival, and provide facility briefings in sequence"), the system includes a dedicated Sequential Guided Escort Engine (`src/services/guidedTourService.ts`) and interactive UI (`src/screens/GuidedTourScreen.tsx`):

```
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: INTRODUCING (Self-Introduction & Route Announcement)         │
│ • Robot speaks: "Namaste! I am Kiosk, your autonomous campus guide...  │
│   Please follow me as I escort you from [Point A] to [Point B]."       │
│ • Speech engine: Native baritone voice (Pitch 0.74, Rate 0.86)         │
│ • UI displays live speech transcription & route overview               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Speech Finished / Skip)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: EN_ROUTE (Autonomous In-Transit Escort Navigation)            │
│ • Dispatches ROS 2 Nav2 Navigation Goal (/goal_pose) to Jetson edge    │
│ • Displays real-time Escort Radar, remaining distance & transit status │
│ • Periodic progress announcements: "We are en route to [Destination]..."│
│ • Jetson LiDAR obstacle avoidance & deadman safety relay active       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Nav2 Reached Goal / Confirm Arrival)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: ARRIVED (Destination Arrival Announcement & Rich Briefing)    │
│ • Robot halts motors and announces arrival verbally:                   │
│   "We have arrived at your destination: [Point B Name]! Here is your   │
│   facility briefing..."                                                │
│ • Presents rich on-site briefing sheet:                                │
│   - Facility overview, operating hours, reception contact              │
│   - Academic faculties and departments housed inside                   │
│   - Key amenities (Elevators, Wi-Fi, Water points, Labs)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Advance to Next Stop in Sequence)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: SEQUENTIAL ADVANCEMENT & MISSION STORAGE                      │
│ • Multi-stop tour sequences (e.g. A → B → C → D) automatically advance  │
│   to the next destination waypoint in sequence                         │
│ • Completed missions permanently logged in localStorage                │
│   ('kiosk_mission_history') with timestamps, duration & stop logs      │
│ • Offline storage preserves all landmark coordinates & custom stops    │
└────────────────────────────────────────────────────────────────────────┘
```

### Pre-Loaded Verified Campus Landmarks
- **Point A:** Welcome Plaza & Main Reception (`20.48512° N, 85.83415° E`)
- **Point B:** Shruti Central Library & Media Resource Centre (`20.48545° N, 85.83460° E`)
- **Point C:** Sri Sri College of Ayurvedic Science & Research Hospital (`20.48620° N, 85.83510° E`)
- **Point D:** Robotics Club Maker Space & Advanced Engineering Lab (`20.48480° N, 85.83390° E`)
- **Point E:** Kaivalya Central Dining Hall (`20.48590° N, 85.83350° E`)
- **Point F:** Open Air Amphitheatre & Cultural Arena (`20.48650° N, 85.83480° E`)

---

## 6. Development & CI/CD Compilation Pipeline

* **TypeScript / Web Application:**
  ```powershell
  # Start local Vite development server
  npm.cmd run dev

  # Run Production Typecheck and Bundle
  npm.cmd run build
  ```
* **Android Native Compilation Toolchain:**
  * **Android Gradle Plugin (AGP):** `8.13.0`
  * **Gradle Version:** `8.13` (configured in `gradle-wrapper.properties` & GitHub Actions)
  * **Android SDK:** Compile SDK 36, Target SDK 36, Build Tools 36.0.0
  * **Java Environment:** OpenJDK 21 (Temurin)
  * **Release Automation:** Tagged GitHub Release (`v1.0.7-apk`) + instant raw repository mirror (`dist-apk/KIOSK-AMR-v1.0.7.apk`).
