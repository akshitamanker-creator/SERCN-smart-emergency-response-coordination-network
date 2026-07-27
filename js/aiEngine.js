/**
 * SERCN AI Dispatch & Predictive Engine
 * Handles real-time severity scoring, Haversine vehicle match, traffic ETA, and hospital match logic.
 */

// Calculate Haversine Distance in Kilometers between two GPS coordinates
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// 1. AI Severity Classifier (Score 1-10)
export function classifySeverity(type) {
  const map = {
    "Heart Attack": 10,
    "Stroke": 9,
    "Fire": 9,
    "Accident": 8,
    "Crime": 7,
    "Natural Disaster": 9,
    "Medical Emergency": 6,
    "Other": 4
  };
  return map[type] || 5;
}

// 2. Traffic-Adjusted ETA Calculator
export function calculateETA(distanceKm, trafficCondition = "NORMAL") {
  let baseSpeed = 50; // km/h emergency vehicle speed
  if (trafficCondition === "HEAVY") baseSpeed = 30;
  if (trafficCondition === "GRIDLOCK") baseSpeed = 15;

  const timeHours = distanceKm / baseSpeed;
  const timeMinutes = Math.max(1.5, parseFloat((timeHours * 60).toFixed(1)));
  return timeMinutes;
}

// 3. Nearest Vehicle Selection Engine
export function rankNearestVehicles(emergencyLat, emergencyLng, vehicles, requiredType = null, trafficCondition = "NORMAL") {
  return vehicles
    .filter(v => requiredType ? v.type === requiredType : true)
    .map(v => {
      const dist = calculateDistanceKm(emergencyLat, emergencyLng, v.lat, v.lng);
      const eta = calculateETA(dist, trafficCondition);
      // AI Score Formula: (100 - (Distance * 15)) * (Status === 'AVAILABLE' ? 1.0 : 0.6)
      const availabilityFactor = v.status === "AVAILABLE" ? 1.0 : 0.6;
      const score = Math.max(10, Math.round((100 - (dist * 12)) * availabilityFactor));

      return {
        ...v,
        distanceKm: dist,
        etaMinutes: eta,
        aiScore: score
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore);
}

// 4. Hospital Recommendation Engine
export function rankHospitals(emergencyLat, emergencyLng, hospitals) {
  return hospitals.map(h => {
    const dist = calculateDistanceKm(emergencyLat, emergencyLng, h.lat, h.lng);
    const bedFactor = (h.availableBeds / h.totalBeds) * 40;
    const icuFactor = (h.icuBedsAvailable / h.icuBedsTotal) * 40;
    const distFactor = Math.max(0, 20 - (dist * 2));
    const score = Math.min(99, Math.round(bedFactor + icuFactor + distFactor));

    return {
      ...h,
      distanceKm: dist,
      hospitalScore: score
    };
  }).sort((a, b) => b.hospitalScore - a.hospitalScore);
}

// 5. Automated AI Dispatch Pipeline Execution
export function runAIDispatchEngine(emergencyId, apiService) {
  const db = apiService.db;
  const emergency = db.emergencies.find(e => e.id === emergencyId);
  if (!emergency) return;

  // Step 1: Severity classification
  const severityScore = classifySeverity(emergency.type);
  emergency.severity = severityScore;

  // Step 2: Vehicle matching
  let reqType = "ambulance";
  if (emergency.type === "Fire") reqType = "fire";
  if (emergency.type === "Crime") reqType = "police";

  const rankedVehicles = rankNearestVehicles(
    emergency.lat,
    emergency.lng,
    db.vehicles,
    reqType,
    db.simulation.trafficCondition
  );

  const bestVehicle = rankedVehicles[0];
  if (bestVehicle) {
    emergency.assignedVehicleId = bestVehicle.id;
    emergency.etaMinutes = bestVehicle.etaMinutes;
    bestVehicle.status = "DISPATCHED";
    bestVehicle.currentEmergencyId = emergency.id;
  }

  // Step 3: Hospital reservation matching
  const rankedHospitals = rankHospitals(emergency.lat, emergency.lng, db.hospitals);
  if (rankedHospitals.length > 0) {
    emergency.assignedHospitalId = rankedHospitals[0].id;
  }

  // Step 4: Volunteer recommendation
  const nearestVol = db.volunteers
    .map(v => ({ ...v, dist: calculateDistanceKm(emergency.lat, emergency.lng, v.lat, v.lng) }))
    .sort((a, b) => a.dist - b.dist)[0];
  
  if (nearestVol && nearestVol.dist < 2.0) {
    emergency.assignedVolunteerId = nearestVol.id;
  }

  // Update status & notify
  emergency.status = "DISPATCHED";
  emergency.timeline = [
    { step: "Emergency Intake", time: new Date().toLocaleTimeString(), status: "completed" },
    { step: `AI Severity Assessment (${severityScore}/10)`, time: new Date().toLocaleTimeString(), status: "completed" },
    { step: `Dispatched ${bestVehicle ? bestVehicle.callSign : 'Responder'}`, time: new Date().toLocaleTimeString(), status: "completed" },
    { step: `Hospital Reserved (${rankedHospitals[0]?.name || 'N/A'})`, time: new Date().toLocaleTimeString(), status: "completed" },
    { step: "En Route to Location", time: new Date().toLocaleTimeString(), status: "active" }
  ];

  apiService.addNotification({
    title: "AI Auto-Dispatch Triggered",
    text: `AI Engine assigned ${bestVehicle?.callSign || 'vehicle'} to ${emergency.type} (${emergency.id}). ETA: ${emergency.etaMinutes} mins.`,
    type: "critical"
  });

  apiService.saveState();
}
