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
   * Spoken welcome introduction; automatically transitions to Hub Screen.
2. **Screen ② — Campus Hub (`HubScreen.tsx`):**
   * Central touch menu with 3 large circular modules:
     * `1. Robo Info`
     * `2. Map & SSU Info`
     * `3. Sessions / Agenda`
   * Back button at top-left returns to Face Screen.
3. **Screen ③ — Map & Directory (`MapInfoScreen.tsx`):**
   * Leaflet GIS with Esri Satellite, CartoDB Dark, and OpenStreetMap views.
   * Verified GPS coordinates for Sri Sri University buildings.
   * Click-to-speak voice guidance and Basic Info tab.
4. **Screen ④ — Sessions & Agenda (`SessionsAgendaScreen.tsx`):**
   * 12 verified and dummy university sessions across Today, Tomorrow, and Upcoming.
   * Filterable by track and date with speech summary and venue locator.
5. **Screen ⑤ — Robo Info (`RoboInfoScreen.tsx`):**
   * Official Sri Sri University Robotics Club gold emblem.
   * Club origin story, basic college info, and 3-tier architecture.
   * Team members and live telemetry with Giant Kiosk Font Mode toggle.

---

## 5. Development & Build Verification

```powershell
# Run Development Server
npm.cmd run dev

# Run Production Typecheck and Bundle
npm.cmd run build
```

Build outputs are compiled into `dist/` with zero TypeScript errors.
