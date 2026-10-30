# Communication Protocols & IPC Specifications
## KAIRO Mobile Robot Operating System

---

## 1. Layer 1 (Tablet) <===> Layer 2 (Jetson)
- **Transport:** WebSocket (`ws://<jetson-ip>:8080/robot-telemetry`) + HTTP REST (`http://<jetson-ip>:8080/api/v1`)
- **Network:** Local Robot Wi-Fi Hotspot (Autonomous zero-internet routing)
- **Format:** JSON

### Direction: Tablet -> Jetson (Drive Request)
```json
{
  "type": "cmd_vel_request",
  "source": "tablet_ui",
  "linear": 0.35,
  "angular": 0.0,
  "timestamp": 1793202536749
}
```

### Direction: Tablet -> Jetson (Emergency Stop)
```json
{
  "type": "emergency_stop",
  "source": "tablet_e_stop",
  "timestamp": 1793202536749
}
```

### Direction: Jetson -> Tablet (Telemetry Broadcast, 10 Hz)
```json
{
  "type": "telemetry",
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
  "pose": {
    "x": 1.25,
    "y": 0.45,
    "theta_deg": 12.0
  }
}
```

---

## 2. Layer 2 (Jetson) <===> Layer 3 (Arduino)
- **Transport:** USB Serial (e.g. `/dev/ttyUSB0` or `/dev/ttyACM0` at 115200 baud)
- **Framing:** Delimited ASCII Packet with Checksum
- **Format:** `<COMMAND,VALUE1,VALUE2,CHECKSUM>\n`

### Drive Packet (Velocity Command):
`$DRV,150,-150*3E\n` (Left Motor PWM: 150, Right Motor PWM: -150)

### Emergency Stop Packet:
`$STP,1*1A\n` (Instant motor cutoff and brake)

### Watchdog Requirement:
If Arduino does not receive a valid `$DRV` packet within 300 milliseconds, it cuts motor PWM to 0 immediately.

