# Communication Protocols & IPC Specifications
## KIOSK — Sri Sri University Autonomous AI Campus Robot (v1.0.4)
**Engineered by the Sri Sri University Robotics Club**

---

## 1. Network Topology & Static Subnet

* **Subnet:** `172.17.0.0/24`
* **Tablet (UI & Speech):** `172.17.0.1` (Static, displayed in UI header)
* **Jetson (ROS 1 / ROS 2 & Nav2):** `172.17.0.2`
* **Transport:** Local autonomous Wi-Fi router / Ad-hoc access point (zero external internet required for local control, teleoperation, and SLAM).

---

## 2. Layer 1 (Tablet) <===> Layer 2 (Jetson) Bridge

* **Transport:** WebSocket (`ws://172.17.0.2:9090` / `ws://172.17.0.2:8080/robot-telemetry`)
* **Protocol Support:** Dual ROS 1 (`rosbridge_websocket` / JSON) & ROS 2 (`ros2_bridge`)
* **Teleop Frequency:** Continuous 10 Hz velocity streaming with deadman safety timeout
* **Format:** Strict JSON / ROS standard message schemas

### A. Velocity Request (Tablet -> Jetson)
Transmitted continuously at 10 Hz while the virtual joystick or teleoperation button is pressed:
```json
{
  "op": "publish",
  "topic": "/cmd_vel",
  "msg": {
    "linear": { "x": 0.35, "y": 0.0, "z": 0.0 },
    "angular": { "x": 0.0, "y": 0.0, "z": 0.45 }
  }
}
```
*Deadman Safety:* If no `/cmd_vel` packet is received by Jetson within **500 ms**, the robot automatically decelerates to a complete stop (`linear = 0.0`, `angular = 0.0`).

### B. Autonomous Navigation Goal (Tablet -> Jetson)
Transmitted when the user or AI assistant commands the robot to move to a campus landmark:
```json
{
  "op": "publish",
  "topic": "/Goal",
  "msg": {
    "header": { "frame_id": "map" },
    "pose": {
      "position": { "x": 14.2, "y": -8.5, "z": 0.0 },
      "orientation": { "x": 0.0, "y": 0.0, "z": 0.707, "w": 0.707 }
    }
  }
}
```

### C. Real-Time 2D SLAM Map (Jetson -> Tablet)
Transmitted when the tablet subscribes to the `/map` topic (`nav_msgs/OccupancyGrid`):
```json
{
  "op": "publish",
  "topic": "/map",
  "msg": {
    "info": {
      "resolution": 0.05,
      "width": 384,
      "height": 384,
      "origin": { "position": { "x": -10.0, "y": -10.0, "z": 0.0 } }
    },
    "data": [0, 0, 0, 100, 100, -1, -1, ...]
  }
}
```
*Rendering:* The tablet draws this occupancy grid onto an HTML5 Canvas, showing occupied walls ($100$), free space ($0$), and unknown areas ($-1$).

### D. Emergency Stop (Tablet -> Jetson)
Transmitted immediately upon tapping the software E-Stop button:
```json
{
  "type": "emergency_stop",
  "source": "tablet_e_stop",
  "timestamp": 1794333000000
}
```

---

## 3. Layer 2 (Jetson) <===> Layer 3 (Arduino) Serial Protocol

* **Physical Medium:** USB Serial (`/dev/ttyUSB0` or `/dev/ttyACM0`)
* **Baud Rate:** `115200 bps`, 8 data bits, no parity, 1 stop bit (8-N-1)
* **Packet Framing:** Delimited ASCII with XOR Checksum:
  ```
  $<COMMAND>,<PARAM_1>,<PARAM_2>*<XOR_HEX>\n
  ```

### A. Velocity Drive Packet
Sent by Jetson Nav2 to Arduino every 50ms:
```
$DRV,150,-150*3E\n
```
* `$DRV`: Drive command identifier
* `150`: Left motor PWM value ($-255$ to $+255$)
* `-150`: Right motor PWM value ($-255$ to $+255$)
* `*3E`: 2-digit hexadecimal XOR checksum

### B. Emergency Stop Packet
```
$STP,1*1A\n
```

---

## 4. Native Android Tablet IPC Bridges (`MainActivity.java`)

When running inside the Capacitor Android APK, the web interface interacts with hardware via exposed JavaScript interfaces:

1. **`window.AndroidSpeechRecognizer`:**
   * Starts native Google/Android speech recognition.
   * Emits `window.onAndroidSpeechPartialResult(text)` and `window.onAndroidSpeechFinalResult(text)`.
2. **`window.AndroidTTS`:**
   * Direct native invocation of Android `TextToSpeech` engine.
   * Auto-selects UK/US English baritone male voice (`en-gb-x-rjs#male`).
   * Configures pitch `0.75` and speech rate `0.85` matching the official audio sample.
```
* Instantly cuts motor PWM to 0 and shorts H-bridge outputs for regenerative dynamic braking.

### C. Watchdog Invariant
The Arduino firmware evaluates a hardware timer:
* If no valid `$DRV` packet with a verified checksum is received within **$300\text{ ms}$**, all motor PWM signals are automatically cut to 0.

---

## 4. Voice & Speech Synthesis Protocol (On-Tablet)

* **Engine:** Browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`).
* **Tone Calibration:** Deep baritone natural male voice:
  * Default Pitch: **`0.82`**
  * Default Rate: **`0.90`**
  * Target Reference: [`public/voice-sample.mp3`](../public/voice-sample.mp3)
* **Viseme Lip-Sync:** Procedural frequency simulation emitting viseme updates ($0.0 - 1.0$) to synchronize mouth aperture with speech audio.
