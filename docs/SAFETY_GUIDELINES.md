# Robot Motion & Hardware Safety Guidelines
## KIOSK — Sri Sri University Autonomous AI Campus Robot
**Engineered by the Sri Sri University Robotics Club**

---

## 1. Zero Direct AI-to-Motor Access Invariant

* **Absolute Safety Rule:** Under no circumstance may the AI language model, voice recognition pipeline, or direct user speech send raw actuator PWM commands directly to the motor driver.
* **Mediation Workflow:**
  1. The user speaks: *"Navigate to Shruti Academic Complex."*
  2. The tablet voice assistant parses the goal intent: `NAVIGATE_TO { landmark_id: "shruti-complex" }`.
  3. The tablet transmits the destination goal to the Jetson over the local WebSocket network.
  4. Jetson's ROS 2 Nav2 stack samples the 2D LiDAR costmap and generates a valid, obstacle-free trajectory.
  5. The path trajectory is validated against safety buffers before low-level velocity commands are sent to the Arduino.

---

## 2. Emergency Stop (E-Stop) Hierarchy

1. **Hardware E-Stop (Tier 3):**
   * A physical, normally-closed red mushroom emergency stop button wired in series with the motor driver power relay. Pressing this instantly cuts power to the 24V planetary DC motors regardless of software state.
2. **Software E-Stop (Tier 1 & Tier 2):**
   * A prominent software E-Stop trigger on the tablet UI transmits an immediate `$STP,1*1A\n` serial interrupt packet, cutting PWM output within $\le 5\text{ ms}$.
3. **Communication Loss Watchdog (Tier 3):**
   * If serial communication from the Jetson drops or freezes for more than **$300\text{ ms}$**, the Arduino firmware automatically brings motor PWM output to zero.

---

## 3. Speed & Acceleration Limits in Pedestrian Environments

To protect students, faculty, and visitors across the Sri Sri University campus:

| Parameter | Safety Value | Justification |
| :--- | :--- | :--- |
| **Max Linear Velocity** | **$0.80\text{ m/s}$** ($2.88\text{ km/h}$) | Standard human walking speed is $\sim 1.3\text{ m/s}$; robot speed is capped at $\approx 60\%$ of human speed. |
| **Max Angular Velocity** | **$1.20\text{ rad/s}$** ($68.7^\circ/\text{s}$) | Prevents sudden rotational jerks that could destabilize high center-of-gravity payloads. |
| **Max Linear Acceleration** | **$0.40\text{ m/s}^2$** | Smooth acceleration avoids wheel slip and chassis oscillation. |
| **Emergency Deceleration** | **$1.50\text{ m/s}^2$** | Rapid, controlled stop when an obstacle enters the critical warning zone. |

---

## 4. LiDAR Safety Zones & Dynamic Costmaps

The 360° 2D LiDAR scanner continuously evaluates three concentric protection zones:

```
           [Robot Chassis]
           ┌─────────────┐
           │    KIOSK    │
           └─────────────┘
  ◄──── 0.4 m ────►  CRITICAL ZONE: Immediate Emergency Stop ($STP)
  ◄──────── 1.0 m ────────►  WARNING ZONE: Decelerate speed to 50% & recalculate path
  ◄───────────── 2.5 m ─────────────►  CLEAR ZONE: Nominal cruising speed
```

1. **Critical Zone ($< 0.4\text{ m}$):**
   * Triggers immediate stop and sounds a polite vocal warning: *"Obstacle detected in immediate path. Halting movement."*
2. **Warning Zone ($0.4\text{ m} - 1.0\text{ m}$):**
   * Jetson reduces velocity to $50\%$ and re-plans the local trajectory to navigate around the obstacle.
3. **Clear Zone ($> 1.0\text{ m}$):**
   * Robot operates at normal planned transit speed.

---

## 5. Battery & Electrical Safety

* **Battery Chemistry:** 24V 20Ah Lithium Iron Phosphate (**LiFePO4**).
* **Battery Protection:** Integrated 40A continuous Battery Management System (BMS) with over-charge, over-discharge, short-circuit, and cell-balancing protection.
* **Low Battery Cutoff:**
  * At **$20\%$ charge**, the robot vocalizes: *"Battery at 20 percent. Please connect charger."*
  * At **$10\%$ charge**, autonomous navigation is disabled; only the tablet interface remains powered.
