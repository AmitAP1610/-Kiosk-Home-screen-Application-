# System Architecture & Layer Boundaries
## Intelligent Robot Operating System (KAIRO)

### 1. Hardware-to-Software Matrix

| Hardware Unit | Responsibility | Forbidden Tasks | Technology Stack |
| :--- | :--- | :--- | :--- |
| **Realme Android Tablet** | Face rendering, Eye/Mouth animations, Voice Assistant, Microphone capture, STT, TTS, AI LLM dialogue, Camera vision (MediaPipe/TFLite), Touchscreen UI (8 Screens) | LiDAR processing, SLAM, Nav2 path planning, direct motor PWM | React 18, TypeScript, Vite, Tailwind CSS, Web Speech API, MediaDevices |
| **NVIDIA Jetson** | 2D LiDAR driver, SLAM mapping, localization, Nav2 path planning, obstacle avoidance, Arduino USB serial communication, telemetry server | Speech recognition, Text-to-speech, AI LLM processing, tablet camera vision | Ubuntu, Python, ROS 2, FastAPI, WebSocket |
| **Arduino** | Motor driver direction/PWM, movement execution, communication watchdog (300ms timeout), hardware E-stop | Running voice/vision models, autonomous path planning | Arduino C++, Serial protocol |
| **Drive Motors** | Differential drive locomotion | N/A | DC Gear Motors + H-Bridge Driver |

---

### 2. Strict Architectural Invariants
1. **Tablet Independence:** The Realme Tablet face and voice assistant remain 100% operational even if the Jetson is powered off or disconnected.
2. **Motor Safety:** Motor commands originating from the user or AI MUST pass through the Jetson safety and obstacle validator before being transmitted to the Arduino.
3. **Sensor Realism:** The tablet's RGB camera is used for visual person/object detection, never treated as a depth sensor. Only the 2D LiDAR is used for obstacle distance measurement.

