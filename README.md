# 🚨 SERCN – Smart Emergency Response Coordination Network

> AI-Powered Multi-Agency Emergency Response System for Faster Emergency Dispatch

<p align="center">
  <img src="assets/logo.png" width="150">
</p>

## 📌 Overview

SERCN (Smart Emergency Response Coordination Network) is an AI-powered emergency response platform designed to reduce emergency response time by automatically identifying, prioritizing, and dispatching the nearest available responder.

Unlike traditional centralized dispatch systems, SERCN continuously tracks emergency vehicles, hospitals, volunteers, and emergency incidents in real time, enabling intelligent decentralized coordination.

This project was developed for the **AI First Hackathon – Summer School 2026, IIT Jammu** under the theme:

**AI for Bharat: Governance & Social Impact**

---

# 🎯 Problem Statement

Current emergency response systems suffer from:

- Delayed manual dispatch
- Centralized decision making
- No real-time responder optimization
- Poor coordination between agencies
- Longer response times during the Golden Hour

These delays can significantly impact survival rates during medical emergencies, accidents, fires, and disasters.

---

# 💡 Solution

SERCN creates a unified emergency ecosystem connecting:

- 🚑 Ambulances
- 🚓 Police
- 🚒 Fire Services
- 🏥 Hospitals
- 🙋 Volunteers
- 👤 Citizens

The platform uses AI to:

- Analyze emergency severity
- Locate nearby responders
- Calculate traffic-aware ETA
- Recommend hospitals
- Dispatch the best responder automatically

---

# ✨ Features

## 👤 Citizen Portal

- Emergency SOS
- Live GPS location sharing
- Emergency category selection
- Medical profile
- Live tracking
- Emergency timeline

---

## 🤖 AI Dispatch Center

- AI Severity Prediction
- Intelligent responder matching
- Traffic-aware ETA calculation
- Automated dispatch engine
- Hospital recommendation
- Volunteer recommendation

---

## 🚑 Responder Dashboard

- Live emergency alerts
- Accept / Reject missions
- Navigation assistance
- Real-time location updates

---

## 🏥 Hospital Dashboard

- Bed availability
- ICU availability
- Incoming patient alerts
- Emergency reservation

---

## 👨‍💼 Admin Control Room

- Live GIS Map
- Analytics Dashboard
- Active emergencies
- Vehicle utilization
- Hospital occupancy
- Response statistics

---

# 🧠 AI Modules

### Emergency Severity Classification

Predicts emergency priority based on incident type.

Example:

```
Heart Attack → Critical
Fire → High
Accident → High
Medical Emergency → Medium
```

---

### Intelligent Vehicle Ranking

Ranks responders using:

- Distance
- Availability
- Traffic
- AI Dispatch Score

---

### Hospital Recommendation

Ranks hospitals using:

- Available beds
- ICU availability
- Distance

---

### ETA Prediction

Uses

- Haversine Distance
- Traffic Adjustment
- Vehicle Speed

to estimate arrival time.

---

# 🏗 System Architecture

```
                Citizen App
                     │
              Emergency SOS
                     │
                     ▼
           AI Dispatch Engine
      ┌─────────┼─────────┐
      ▼         ▼         ▼
 Severity    Vehicle    Hospital
 Analysis    Matching   Selection
      │         │         │
      └─────────┼─────────┘
                ▼
       Best Responder Selected
                │
        Dispatch Notification
                │
                ▼
          Live Tracking
```

---

# ⚙ Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)

## Backend (Prototype)

- JavaScript
- Local Storage
- Simulated REST APIs

## Maps

- Leaflet.js

## Charts

- Chart.js

## Icons

- Lucide Icons

## AI Logic

- Haversine Distance
- Severity Scoring
- Vehicle Ranking
- Hospital Ranking
- ETA Prediction

---

# 📂 Project Structure

```
SERCN/
│
├── index.html
├── css/
│     └── styles.css
│
├── js/
│     ├── app.js
│     ├── apiService.js
│     ├── aiEngine.js
│     ├── auth.js
│     ├── chartsManager.js
│     ├── simulationEngine.js
│     ├── db.js
│     │
│     └── components/
│           ├── citizenApp.js
│           ├── adminApp.js
│           ├── ambulanceApp.js
│           ├── policeApp.js
│           ├── fireApp.js
│           ├── hospitalApp.js
│           ├── volunteerApp.js
│           └── aiDispatchApp.js
```

---

# 🚀 How It Works

1. Citizen presses SOS.
2. Emergency details are recorded.
3. AI classifies severity.
4. Nearby responders are ranked.
5. Best responder is selected.
6. Hospital is recommended.
7. Volunteer (if nearby) is notified.
8. Citizen tracks responder in real time.

---

# 📊 AI Dispatch Workflow

```
Emergency Reported
        │
        ▼
Severity Classification
        │
        ▼
Nearest Vehicle Search
        │
        ▼
Traffic ETA Calculation
        │
        ▼
Hospital Recommendation
        │
        ▼
Volunteer Recommendation
        │
        ▼
Automatic Dispatch
        │
        ▼
Live Tracking
```

---

# 🔮 Future Enhancements

- Real GPS integration
- Google Maps Directions API
- Live traffic prediction
- Computer Vision incident detection
- Voice-based SOS
- IoT ambulance integration
- Drone-assisted emergency response
- Traffic signal preemption
- Multilingual AI assistant
- Predictive emergency hotspot analytics

---

# 📸 Screens

- Citizen Dashboard
- AI Dispatch Center
- Admin Control Room
- Live GIS Map
- Ambulance Dashboard
- Hospital Dashboard
- Analytics Dashboard

---

# 👥 Team

**Code Sparkies**

- **Akshita Manker** — AI/ML, Web Development
- **Dhruv Sharma** — Machine Learning, Full Stack Development
- **Saanjh Yadav** — Team Member

---

# 🏆 Hackathon

**AI First Hackathon 2026**

Institute Innovation & Incubation Council (I3C)

Indian Institute of Technology Jammu

---

# 📜 License

This project was developed solely for educational and hackathon purposes.
