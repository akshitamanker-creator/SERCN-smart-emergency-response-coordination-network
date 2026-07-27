/**
 * SERCN Frontend API Service Layer
 * Simulates REST Endpoints with async network responses & state event listeners.
 */

import { initialDB } from './db.js';
import { runAIDispatchEngine } from './aiEngine.js';

class APIService {
  constructor() {
    // Load from LocalStorage if previously saved, else seed
    const saved = localStorage.getItem('sercn_db_v1');
    if (saved) {
      try {
        this.db = JSON.parse(saved);
      } catch (e) {
        this.db = initialDB;
      }
    } else {
      this.db = initialDB;
      this.saveState();
    }

    this.listeners = [];
  }

  saveState() {
    localStorage.setItem('sercn_db_v1', JSON.stringify(this.db));
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.db));
  }

  // API PLACEHOLDER: POST /api/emergency
  async createEmergency(payload) {
    await new Promise(r => setTimeout(r, 400)); // Simulate async network round-trip

    const newId = `EMG-${Math.floor(1000 + Math.random() * 9000)}`;
    const emergency = {
      id: newId,
      type: payload.type || "Medical Emergency",
      categoryIcon: payload.categoryIcon || "alert-circle",
      severity: payload.severity || 8,
      status: "REPORTED",
      citizenName: payload.citizenName || this.db.currentUser.name,
      citizenPhone: payload.citizenPhone || this.db.currentUser.phone,
      lat: payload.lat || 40.7180,
      lng: payload.lng || -74.0020,
      address: payload.address || "Live Shared GPS Coordinates",
      timestamp: "Just now",
      assignedVehicleId: null,
      assignedHospitalId: null,
      assignedVolunteerId: null,
      etaMinutes: 5.0,
      mediaAttached: payload.mediaAttached || { photos: 0, video: false, voiceNote: false },
      medicalHistorySummary: payload.medicalHistorySummary || `${this.db.currentUser.medicalConditions}. Blood ${this.db.currentUser.bloodGroup}`,
      timeline: [
        { step: "Emergency Reported", time: new Date().toLocaleTimeString(), status: "completed" },
        { step: "AI Severity Analysis", time: new Date().toLocaleTimeString(), status: "active" },
        { step: "Searching Nearest Responders", time: "--:--", status: "pending" },
        { step: "Dispatched", time: "--:--", status: "pending" }
      ]
    };

    this.db.emergencies.unshift(emergency);
    this.saveState();

    // Trigger AI Dispatch calculation automatically
    runAIDispatchEngine(emergency.id, this);

    return { status: 201, message: "Emergency created successfully", emergency };
  }

  // API PLACEHOLDER: GET /api/responders
  async getResponders() {
    await new Promise(r => setTimeout(r, 200));
    return {
      status: 200,
      vehicles: this.db.vehicles,
      volunteers: this.db.volunteers,
      policeStations: this.db.policeStations,
      fireStations: this.db.fireStations
    };
  }

  // API PLACEHOLDER: POST /api/accept
  async acceptMission(payload) {
    const { vehicleId, volunteerId, emergencyId } = payload;
    const emergency = this.db.emergencies.find(e => e.id === emergencyId);
    if (!emergency) return { status: 404, message: "Emergency not found" };

    if (vehicleId) {
      const vehicle = this.db.vehicles.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.status = "BUSY";
        vehicle.currentEmergencyId = emergencyId;
        emergency.assignedVehicleId = vehicleId;
      }
    }

    if (volunteerId) {
      const vol = this.db.volunteers.find(v => v.id === volunteerId);
      if (vol) {
        vol.status = "DISPATCHED";
        emergency.assignedVolunteerId = volunteerId;
      }
    }

    emergency.status = "DISPATCHED";
    emergency.timeline.push({
      step: `Accepted by ${vehicleId || volunteerId}`,
      time: new Date().toLocaleTimeString(),
      status: "completed"
    });

    this.addNotification({
      title: "Mission Accepted",
      text: `${vehicleId || volunteerId} accepted assignment for ${emergencyId}`,
      type: "critical"
    });

    this.saveState();
    return { status: 200, message: "Mission accepted successfully", emergency };
  }

  // API PLACEHOLDER: POST /api/location/update
  async updateLocation(payload) {
    const { id, type, lat, lng } = payload;
    if (type === "vehicle") {
      const vehicle = this.db.vehicles.find(v => v.id === id);
      if (vehicle) {
        vehicle.lat = lat;
        vehicle.lng = lng;
      }
    } else if (type === "volunteer") {
      const vol = this.db.volunteers.find(v => v.id === id);
      if (vol) {
        vol.lat = lat;
        vol.lng = lng;
      }
    }
    this.saveState();
    return { status: 200, message: "Location updated" };
  }

  // API PLACEHOLDER: GET /api/dashboard
  async getDashboardMetrics() {
    await new Promise(r => setTimeout(r, 150));
    const activeCases = this.db.emergencies.filter(e => e.status !== "RESOLVED").length;
    const completedCases = this.db.history.length;
    const availableVehicles = this.db.vehicles.filter(v => v.status === "AVAILABLE").length;
    const busyVehicles = this.db.vehicles.filter(v => v.status === "BUSY" || v.status === "DISPATCHED").length;

    return {
      status: 200,
      activeCases,
      completedCases,
      avgResponseTimeMinutes: 4.1,
      availableVehicles,
      busyVehicles,
      totalVehicles: this.db.vehicles.length
    };
  }

  // API PLACEHOLDER: GET /api/hospitals
  async getHospitals() {
    await new Promise(r => setTimeout(r, 150));
    return { status: 200, hospitals: this.db.hospitals };
  }

  // API PLACEHOLDER: GET /api/history
  async getHistory() {
    await new Promise(r => setTimeout(r, 150));
    return { status: 200, history: this.db.history };
  }

  // Helper notification adder
  addNotification(notif) {
    this.db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: notif.title,
      text: notif.text,
      time: "Just now",
      type: notif.type || "info"
    });
  }

  // Update current user role
  setUserRole(role) {
    this.db.currentUser.role = role;
    this.saveState();
  }

  // Reset database state to seed
  resetDatabase() {
    this.db = JSON.parse(JSON.stringify(initialDB));
    this.saveState();
  }
}

export const apiService = new APIService();
