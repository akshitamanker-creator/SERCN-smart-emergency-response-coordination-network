/**
 * SERCN Centralized Mock Database State & Seed Data
 * Simulated Metro Coordinates centered around 40.7128, -74.0060 (New York / Metro Area)
 */

export const initialDB = {
  // Current active logged-in user profile
  currentUser: {
    id: "USR-1001",
    name: "Jane Doe",
    role: "citizen", // citizen, ambulance, police, fire, hospital, admin, volunteer
    email: "jane.doe@sercn-net.org",
    phone: "+1 (555) 234-5678",
    bloodGroup: "O+",
    medicalConditions: "Asthma, Mild Hypertension",
    allergies: "Penicillin",
    emergencyContacts: [
      { name: "John Doe (Spouse)", phone: "+1 (555) 987-6543" },
      { name: "Sarah Smith (Sister)", phone: "+1 (555) 345-6789" }
    ],
    jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU1ItMTAwMSIsInJvbGUiOiJjaXRpemVuIn0"
  },

  // Active Emergencies Ecosystem
  emergencies: [
    {
      id: "EMG-8042",
      type: "Heart Attack",
      categoryIcon: "heart-pulse",
      severity: 9, // 1 to 10 scale
      status: "DISPATCHED", // REPORTED, DISPATCHED, ON_SCENE, TRANSPORTING, RESOLVED
      citizenName: "Jane Doe",
      citizenPhone: "+1 (555) 234-5678",
      lat: 40.7180,
      lng: -74.0020,
      address: "452 Broadway, SoHo, NY",
      timestamp: "10 mins ago",
      assignedVehicleId: "AMB-101",
      assignedHospitalId: "HOSP-01",
      assignedVolunteerId: "VOL-501",
      etaMinutes: 4.5,
      mediaAttached: { photos: 1, video: false, voiceNote: true },
      medicalHistorySummary: "Patient with history of asthma & chest pain. Blood O+",
      timeline: [
        { step: "Reported & Geolocated", time: "21:16:02", status: "completed" },
        { step: "AI Severity Classification (Score: 9/10)", time: "21:16:05", status: "completed" },
        { step: "Nearest Vehicle Assigned (AMB-101)", time: "21:16:12", status: "completed" },
        { step: "Hospital ICU Reserved (City General)", time: "21:16:18", status: "completed" },
        { step: "Ambulance En Route", time: "21:16:25", status: "active" },
        { step: "Patient Arrival at ER", time: "--:--:--", status: "pending" }
      ]
    },
    {
      id: "EMG-8043",
      type: "Accident",
      categoryIcon: "car-front",
      severity: 7,
      status: "REPORTED",
      citizenName: "Robert Vance",
      citizenPhone: "+1 (555) 444-9911",
      lat: 40.7250,
      lng: -73.9980,
      address: "Houston St & Lafayette St, NY",
      timestamp: "3 mins ago",
      assignedVehicleId: "POL-201",
      assignedHospitalId: "HOSP-02",
      assignedVolunteerId: null,
      etaMinutes: 6.0,
      mediaAttached: { photos: 2, video: true, voiceNote: false },
      medicalHistorySummary: "Vehicle collision. Two passengers with minor lacerations.",
      timeline: [
        { step: "Reported & Geolocated", time: "21:23:00", status: "completed" },
        { step: "AI Severity Classification (Score: 7/10)", time: "21:23:04", status: "completed" },
        { step: "Finding Nearest Responders...", time: "21:23:10", status: "active" }
      ]
    },
    {
      id: "EMG-8044",
      type: "Fire",
      categoryIcon: "flame",
      severity: 10,
      status: "DISPATCHED",
      citizenName: "Commercial Sensor #9",
      citizenPhone: "N/A",
      lat: 40.7100,
      lng: -74.0150,
      address: "Battery Park City Commercial Complex, NY",
      timestamp: "15 mins ago",
      assignedVehicleId: "FIRE-301",
      assignedHospitalId: null,
      assignedVolunteerId: null,
      etaMinutes: 2.5,
      mediaAttached: { photos: 0, video: false, voiceNote: false },
      medicalHistorySummary: "Structural fire report. Water supply hydrant requested.",
      timeline: [
        { step: "Automated Sensor Alarm", time: "21:11:00", status: "completed" },
        { step: "AI Severity Classification (Score: 10/10)", time: "21:11:03", status: "completed" },
        { step: "Fire Engine F-301 Dispatched", time: "21:11:15", status: "completed" },
        { step: "Hydrant Routing Locked", time: "21:11:20", status: "active" }
      ]
    }
  ],

  // Emergency Vehicles Fleet
  vehicles: [
    {
      id: "AMB-101",
      callSign: "Medic 1 (Ambulance)",
      type: "ambulance",
      driver: "Officer Mark Vance",
      lat: 40.7150,
      lng: -74.0080,
      status: "BUSY", // AVAILABLE, DISPATCHED, BUSY, MAINTENANCE
      speedKmH: 45,
      equipment: ["Defibrillator", "Ventilator", "Trauma Kit"],
      currentEmergencyId: "EMG-8042"
    },
    {
      id: "AMB-102",
      callSign: "Medic 2 (Ambulance)",
      type: "ambulance",
      driver: "Paramedic Sarah Lin",
      lat: 40.7300,
      lng: -73.9900,
      status: "AVAILABLE",
      speedKmH: 0,
      equipment: ["Advanced ALS Unit", "Pediatric Care"],
      currentEmergencyId: null
    },
    {
      id: "POL-201",
      callSign: "Patrol 4 (Police)",
      type: "police",
      driver: "Sgt. David Miller",
      lat: 40.7220,
      lng: -73.9940,
      status: "DISPATCHED",
      speedKmH: 50,
      equipment: ["Tactical Gear", "Traffic Cones"],
      currentEmergencyId: "EMG-8043"
    },
    {
      id: "FIRE-301",
      callSign: "Tower Ladder 3 (Fire)",
      type: "fire",
      driver: "Captain Thomas Ross",
      lat: 40.7120,
      lng: -74.0120,
      status: "BUSY",
      speedKmH: 40,
      equipment: ["Thermal Imager", "Water Cannon 1000L", "Hazmat Unit"],
      currentEmergencyId: "EMG-8044"
    }
  ],

  // Hospitals System
  hospitals: [
    {
      id: "HOSP-01",
      name: "Metro Central General Hospital",
      address: "100 Hospital Plaza, NY",
      lat: 40.7280,
      lng: -73.9850,
      totalBeds: 250,
      availableBeds: 18,
      icuBedsTotal: 30,
      icuBedsAvailable: 3,
      doctorsAvailable: 12,
      operationTheatresActive: 4,
      operationTheatresTotal: 6,
      specialties: ["Cardiology", "Trauma Level 1", "Neurology"]
    },
    {
      id: "HOSP-02",
      name: "St. Jude Emergency Medical Center",
      address: "55 5th Avenue, NY",
      lat: 40.7340,
      lng: -73.9920,
      totalBeds: 180,
      availableBeds: 34,
      icuBedsTotal: 20,
      icuBedsAvailable: 8,
      doctorsAvailable: 9,
      operationTheatresActive: 2,
      operationTheatresTotal: 4,
      specialties: ["Burn Unit", "Pediatric Trauma", "Orthopedics"]
    }
  ],

  // Fire Hydrants Infrastructure
  hydrants: [
    { id: "HYD-01", lat: 40.7105, lng: -74.0142, status: "OPERATIONAL", pressurePsi: 85 },
    { id: "HYD-02", lat: 40.7115, lng: -74.0160, status: "OPERATIONAL", pressurePsi: 90 },
    { id: "HYD-03", lat: 40.7255, lng: -73.9970, status: "OPERATIONAL", pressurePsi: 78 }
  ],

  // Police Stations
  policeStations: [
    { id: "PS-01", name: "1st Precinct Police Station", lat: 40.7195, lng: -74.0040, officersOnDuty: 24 },
    { id: "PS-02", name: "5th Precinct Police Station", lat: 40.7160, lng: -73.9970, officersOnDuty: 18 }
  ],

  // Fire Stations
  fireStations: [
    { id: "FS-01", name: "Engine Company 7 / Ladder 1", lat: 40.7130, lng: -74.0080, trucksAvailable: 3 },
    { id: "FS-02", name: "Ladder Company 20", lat: 40.7260, lng: -74.0010, trucksAvailable: 2 }
  ],

  // Verified Volunteers
  volunteers: [
    {
      id: "VOL-501",
      name: "Elena Rostova",
      badgeNumber: "SERCN-VOL-994",
      certifications: ["CPR Certified", "Advanced First Aid"],
      lat: 40.7170,
      lng: -74.0035,
      status: "DISPATCHED",
      distanceKm: 0.2
    },
    {
      id: "VOL-502",
      name: "Marcus Chen",
      badgeNumber: "SERCN-VOL-441",
      certifications: ["Basic Life Support (BLS)"],
      lat: 40.7240,
      lng: -73.9990,
      status: "AVAILABLE",
      distanceKm: 0.8
    }
  ],

  // Historical Analytics & Records
  history: [
    { id: "EMG-7990", type: "Stroke", date: "2026-07-26", responseTimeMinutes: 3.8, status: "RESOLVED", outcome: "Discharged Stable" },
    { id: "EMG-7991", type: "Accident", date: "2026-07-26", responseTimeMinutes: 4.2, status: "RESOLVED", outcome: "Treated & Transported" },
    { id: "EMG-7992", type: "Fire", date: "2026-07-25", responseTimeMinutes: 5.1, status: "RESOLVED", outcome: "Extinguished" },
    { id: "EMG-7993", type: "Heart Attack", date: "2026-07-25", responseTimeMinutes: 3.4, status: "RESOLVED", outcome: "Successful Resuscitation" }
  ],

  // Real-time System Notifications
  notifications: [
    { id: "NOTIF-1", title: "Ambulance Dispatched", text: "Medic 1 (AMB-101) assigned to EMG-8042", time: "10 mins ago", type: "critical" },
    { id: "NOTIF-2", title: "ICU Bed Reserved", text: "Metro Central General reserved Bed #4 for patient Jane Doe", time: "8 mins ago", type: "info" },
    { id: "NOTIF-3", title: "Hydrant Location Synced", text: "Hydrant HYD-01 locked for Fire Truck F-301", time: "5 mins ago", type: "warning" }
  ],

  // Simulation Environment Variables
  simulation: {
    trafficCondition: "NORMAL", // NORMAL, HEAVY, GRIDLOCK
    hospitalSurge: false,
    vehicleMovementActive: true
  }
};
