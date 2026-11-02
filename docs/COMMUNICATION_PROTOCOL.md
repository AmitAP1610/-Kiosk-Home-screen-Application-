# Communication Protocols & IPC Specifications
## KIOSK — Sri Sri University Autonomous AI Campus Robot
**Engineered by the Sri Sri University Robotics Club**

---

## 1. Network Topology & Static Subnet

* **Subnet:** `172.17.0.0/24`
* **Tablet (UI & Speech):** `172.17.0.1` (Static, displayed in UI header)
* **Jetson (ROS 2 & Nav2):** `172.17.0.2`
* **Transport:** Local autonomous Wi-Fi router / Ad-hoc access point (zero external internet required for local control and SLAM).

---

## 2. Layer 1 (Tablet) <===> Layer 2 (Jetson) Bridge

* **Transport:** WebSocket (`ws://172.17.0.2:8080/robot-telemetry`) + HTTP REST (`http://172.17.0.2:8080/api/v1`)
* **Frequency:** 10 Hz telemetry streaming
* **Format:** Strict JSON

### A. Velocity Request (Tablet -> Jetson)
Transmitted when the user navigates via manual teleoperation or voice command:
```json
{
  "type": "cmd_vel_request",
  "source": "tablet_ui",
  "linear": 0.35,
  "angular": 0.0,
  "timestamp": 1793202536749
}
```

### B. Emergency Stop (Tablet -> Jetson)
Transmitted immediately upon tapping the software E-Stop button:
```json
{
  "type": "emergency_stop",
  "source": "tablet_e_stop",
  "timestamp": 1793202536749
}
```

### C. Live Telemetry Broadcast (Jetson -> Tablet, 10 Hz)
Broadcast to update the Tablet UI status badges and telemetry cards:
```json
{
  "type": "telemetry",
  "timestamp": 1793202536750,
  "jetson": {
    "cpu_usage_percent": 24.5,
    "temperature_c": 46.2,
    "ros2_active": true
  },
  "lidar": {
    "connected": true,
    "scan_rate_hz": 10.0,
    "nearest_obstacle_m": 2.14
  },
  "arduino": {
    "connected": true,
    "e_stop_active": false,
    "current_speed_m_s": 0.32
  },
  "battery": {
    "voltage_v": 25.6,
    "percentage": 94
  },
  "pose": {
    "x": 1.25,
    "y": 0.45,
    "theta_deg": 12.0
  }
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
