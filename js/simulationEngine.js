/**
 * SERCN Simulation Engine
 * Handles live animated vehicle movement ticks, traffic conditions, hospital surges, and emergency spawning.
 */

import { apiService } from './apiService.js';

class SimulationEngine {
  constructor() {
    this.timer = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => this.tick(), 2500); // Ticks every 2.5s
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  tick() {
    const db = apiService.db;
    if (!db.simulation.vehicleMovementActive) return;

    let movedAny = false;

    // Interpolate vehicles towards their assigned emergency target location
    db.vehicles.forEach(vehicle => {
      if ((vehicle.status === "DISPATCHED" || vehicle.status === "BUSY") && vehicle.currentEmergencyId) {
        const emergency = db.emergencies.find(e => e.id === vehicle.currentEmergencyId);
        if (emergency) {
          // Move 5% closer to target each tick
          const stepSize = 0.05;
          const latDiff = emergency.lat - vehicle.lat;
          const lngDiff = emergency.lng - vehicle.lng;

          if (Math.abs(latDiff) > 0.0005 || Math.abs(lngDiff) > 0.0005) {
            vehicle.lat += latDiff * stepSize;
            vehicle.lng += lngDiff * stepSize;

            // Reduce ETA dynamically
            if (emergency.etaMinutes > 0.5) {
              emergency.etaMinutes = parseFloat((emergency.etaMinutes - 0.2).toFixed(1));
            }

            movedAny = true;
          }
        }
      }
    });

    if (movedAny) {
      apiService.saveState();
    }
  }

  // Simulation Control: Spawn Random Emergency
  spawnRandomEmergency() {
    const types = ["Heart Attack", "Accident", "Fire", "Crime", "Stroke"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Offset lat/lng around NY center (40.7128, -74.0060)
    const randomLat = 40.7100 + (Math.random() * 0.03 - 0.015);
    const randomLng = -74.0060 + (Math.random() * 0.03 - 0.015);

    apiService.createEmergency({
      type: randomType,
      severity: Math.floor(Math.random() * 4) + 7,
      lat: randomLat,
      lng: randomLng,
      address: `Simulated Sensor #${Math.floor(Math.random() * 100)} Area`
    });

    apiService.addNotification({
      title: "SIMULATION: Emergency Spawned",
      text: `New ${randomType} simulated emergency created. AI Dispatch initiated!`,
      type: "warning"
    });
  }

  // Simulation Control: Toggle Traffic Level
  setTrafficCondition(condition) {
    apiService.db.simulation.trafficCondition = condition;
    apiService.addNotification({
      title: "Traffic Conditions Updated",
      text: `System traffic simulation updated to ${condition}. ETAs recalculated.`,
      type: "info"
    });
    apiService.saveState();
  }

  // Simulation Control: Simulate Hospital Surge
  toggleHospitalSurge() {
    const db = apiService.db;
    db.simulation.hospitalSurge = !db.simulation.hospitalSurge;
    
    db.hospitals.forEach(h => {
      if (db.simulation.hospitalSurge) {
        h.availableBeds = Math.max(1, Math.floor(h.availableBeds * 0.2));
        h.icuBedsAvailable = Math.max(0, Math.floor(h.icuBedsAvailable * 0.1));
      } else {
        h.availableBeds = Math.floor(h.totalBeds * 0.25);
        h.icuBedsAvailable = 5;
      }
    });

    apiService.addNotification({
      title: "Hospital Bed Occupancy Shifted",
      text: db.simulation.hospitalSurge ? "HIGH SURGE SIMULATION: ICU & Bed capacity constrained." : "Surge cleared. Capacity restored.",
      type: db.simulation.hospitalSurge ? "warning" : "success"
    });
    apiService.saveState();
  }
}

export const simulationEngine = new SimulationEngine();
