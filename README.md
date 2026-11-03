# KIOSK — Sri Sri University Autonomous AI Campus Robot

<div align="center">
  <img src="public/robotics-club-logo.jpg" alt="Sri Sri University Robotics Club Emblem" width="160" height="160" style="border-radius: 50%; border: 3px solid #D49A36; box-shadow: 0 2px 12px rgba(48, 52, 59, 0.2);" />
  <h3>Engineered & Built by the <strong>Sri Sri University Robotics Club</strong></h3>
  <p><em>"Learn, Lead, Serve" • Sri Sri University • Cuttack, Odisha</em></p>
  <p><strong>Static Network IP: <code>172.17.0.1</code></strong></p>
</div>

---

## 🌟 Executive Overview

**KIOSK** is an autonomous campus service robot developed by the **Sri Sri University Robotics Club**. It combines procedural robotic facial expression animations, an on-device bilingual voice assistant (English & Hindi) calibrated with a mature male baritone cadence, an interactive visual campus highlights guide with audio tours, live academic symposia and event timetable with photo banners, and robust 3-tier embedded systems engineering.

The system is architected to run on a **Realme Android Tablet** mounted on the robot's beveled polygon head, with zero cloud dependency required for speech recognition, text-to-speech, or interactive campus guidance.

---

## 📐 Application Architecture & Wireframe Flow

The user interface follows the 5-screen kiosk workflow designed for the robot's tablet display:

```
┌─────────────────────────────────────────────────────────────┐
│ ① ROBOT FACE (Home)                                         │
│ • Static IP 172.17.0.1 badge at top left                   │
│ • Procedural cyan glowing eyes & lip-sync mouth             │
│ • Automatic spoken voice introduction                       │
│ • Automatically shifts to Hub after speech or tap           │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Automatic or Tap)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ ② CAMPUS ROBOT HUB (Main Menu)                              │
│ • Top bar: Back to Face + SSU Brand + Club Logo             │
│ • 3 Large Expansive Touch Modules (Full Screen Coverage):   │
│   [ 1. Robo Info ]  [ 2. Highlights ]  [ 3. Sessions ]      │
│ • Quick Voice Assistant Microphone Bar                      │
└──────────┬───────────────────┼───────────────────┬──────────┘
           │                   │                   │
           ▼                   ▼                   ▼
┌──────────────────┐ ┌───────────────────┐ ┌──────────────────┐
│ ⑤ ROBO INFO      │ │ ③ CAMPUS          │ │ ④ SESSIONS &     │
│ • Club Story     │ │   HIGHLIGHTS      │ │   AGENDA         │
│ • Club Emblem    │ │ • Photo Gallery   │ │ • 12 SSU Events  │
│ • 3-Tier Arch    │ │ • Audio Tours     │ │ • Photo Banners  │
│ • Maker Space    │ │ • Key Facilities  │ │ • Key Takeaways  │
│ • Safety Relay   │ │ • Visiting Hours  │ │ • Entry Badges   │
└──────────────────┘ └───────────────────┘ └──────────────────┘
```

### Screen Breakdown
1. **Box ① — Robot Face Screen (`FaceScreen.tsx`):**
   * Displays the animated cyan eyes, responsive pupil tracking, blinking, and viseme audio reactivity.
   * Prominently displays network IP `172.17.0.1` at the top left.
   * Delivers the spoken voice introduction and automatically transitions to the Campus Hub.
2. **Box ② — Campus Robot Hub (`HubScreen.tsx`):**
   * Engineered with the official industrial AMR palette: Main background `#F2F2EF`, Primary Charcoal (`#30343B`), Secondary Silver (`#B0B4B8`), Dark components (`#202124`), Industrial Amber Accent (`#D49A36`), and Crisp White Cards (`#FFFFFF`).
   * Clean, physical engineering dashboard with three expansive touch modules covering the display with optimal ergonomics.
   * Top-left back button returning directly to the animated Face screen.
3. **Box ③ — Campus Highlights & Facilities (`MapInfoScreen.tsx`):**
   * Rich photographic cards and click-to-speak audio guides for Sri Sri University's signature landmarks: Shruti Academic Complex & Central Library, 100+ Bed Sri Sri Ayurveda Hospital, Kaivalya Central Dining Hall, Sri Sri Robotics Maker Space, Open-Air Amphitheatre (OAT), Sports Arena, Hostels, and Vishwashanti Ashram.
   * Category filters and instant building search with operating hours and key facilities.
4. **Box ④ — Sessions & Campus Agenda (`SessionsAgendaScreen.tsx`):**
   * Live timetable of 12 academic symposia, robotics demos, yoga masterclasses, and conferences with high-definition photo banners.
   * Filterable by date (*Today*, *Tomorrow*, *Upcoming*, *All*) and track (*Robotics & AI*, *Academic*, *Wellness*, *Cultural*, *Orientation*).
   * Spoken audio summary, key takeaways list, entry requirement badges, and speaker information.
5. **Box ⑤ — Robo Info & Club Engineering (`RoboInfoScreen.tsx`):**
   * Features the official **Sri Sri University Robotics Club** emblem.
   * Documents the club origin story, what the club builds, and basic university background (*"Learn, Lead, Serve"*).
   * Detailed 3-tier hardware breakdown and safety watchdog protocol.
   * Giant Kiosk Font Mode toggle for clear readability from tablet viewing distance.

---

## 🎙️ Calibrated Natural Male AI Voice Pipeline

The speech synthesis engine ([`src/services/textToSpeech.ts`](src/services/textToSpeech.ts)) is calibrated to mirror a deep, mature, authoritative male baritone matching the target reference audio sample:

* **Voice Selection:** Automatically prioritizes deep natural male voices (`Google UK English Male`, `Microsoft George`, `Microsoft Brian`, `Microsoft Ryan`, `Microsoft Guy`, `Microsoft David`).
* **Vocal Formant Pitch:** Calibrated to **`0.82`** (deep baritone chest register).
* **Cadence & Rate:** Calibrated to **`0.90`** (deliberate, steady, dignified pacing).
* **Reference Audio Player:** Includes an in-app reference tone player in **Settings** playing [`public/voice-sample.mp3`](public/voice-sample.mp3) with one-click tone matching.
* **ElevenLabs Integration:** Ready for instant AI voice cloning with a single API key and Voice ID.

---

## ⚙️ 3-Tier Hardware & Software Architecture

| Processing Tier | Hardware Unit | Operating Role | Technical Stack |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Interface)** | **Realme Android Tablet 10.4"** | Procedural SVG face, Web Speech API (STT & TTS), Touch UI, Front Camera gaze | React 18, TypeScript, Vite, Tailwind CSS |
| **Tier 2 (Navigation)** | **NVIDIA Jetson Edge Node** | ROS 2 Nav2, 2D LiDAR SLAM, dynamic costmaps, obstacle deceleration | Ubuntu, ROS 2 Humble, Python, WebSocket |
| **Tier 3 (Safety & Drive)** | **Arduino Mega 2560** | Planetary motor PWM, quadrature encoders, 300ms watchdog failsafe, E-Stop relay | Embedded C++, Serial Protocol @ 115200 baud |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)

### Installation & Launch

```powershell
# 1. Clone or navigate to the repository
cd "c:\Users\amitk\OneDrive\Desktop\ROBOT FACE"

# 2. Install dependencies
npm.cmd install

# 3. Start local Vite development server
npm.cmd run dev
```

Open **`http://localhost:5173`** in Google Chrome or Android WebView on the tablet.

### Production Build

```powershell
npm.cmd run build
```

Build outputs are bundled to the `dist/` folder and optimized for low-latency tablet execution.

---

## 📜 License & Ownership
Copyright © 2026 **Sri Sri University Robotics Club**. Developed for autonomous campus navigation, visitor orientation, and student robotics research.
