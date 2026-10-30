# Robot Motion & Hardware Safety Guidelines
## KAIRO Mobile Robot Operating System

---

## 1. Zero Direct AI-to-Motor Access Invariant
- **Rule:** The AI voice model, LLM, or user prompt can **never** send unmediated hardware PWM commands directly to the Arduino.
- **Workflow:**
  1. User asks: *"Move forward 2 meters."*
  2. Tablet STT converts speech to text.
  3. AI identifies intent: `REQUEST_MOVE { direction: "forward", distance_m: 2.0 }`.
  4. Tablet transmits JSON intent request to Jetson over local WebSocket.
  5. Jetson Nav2 checks LiDAR scan: verifies no obstacles within 2 meters, verifies clear costmap.
  6. Jetson sends trajectory to Arduino via USB Serial.
  7. If LiDAR detects an obstacle at $< 0.4\text{ m}$, Jetson halts transmission and notifies Tablet.

---

## 2. Hardwired & Software Emergency Stop (E-Stop)
- **Local Screen E-Stop:** Large, prominent red E-Stop button on the tablet UI.
- **Communication Loss Watchdog:** The Arduino firmware maintains a hardware millisecond watchdog timer. If communication from the Jetson ceases for $> 300\text{ ms}$, all motor output is killed instantly.
- **Physical Bumper / Power Switch:** Recommended physical normally-closed safety switch in series with the motor driver logic power supply.

