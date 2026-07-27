/**
 * SERCN Ambulance Driver Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';

export function renderAmbulanceApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const myVehicle = db.vehicles.find(v => v.type === "ambulance") || db.vehicles[0];
  const assignedEmg = db.emergencies.find(e => e.id === myVehicle.currentEmergencyId) || db.emergencies[0];

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Ambulance Status Header -->
      <div class="glass-card" style="border-left:4px solid var(--success-green);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #4CAF50, #1B5E20); font-size:1.1rem;">
              <i data-lucide="ambulance"></i>
            </div>
            <div>
              <h2 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800;">${myVehicle.callSign}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">Driver: ${myVehicle.driver} • Unit ID: ${myVehicle.id}</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <span class="badge ${myVehicle.status === 'AVAILABLE' ? 'badge-success' : 'badge-critical'}">
              STATUS: ${myVehicle.status}
            </span>

            ${myVehicle.status !== 'AVAILABLE' ? `
              <button class="btn btn-success" id="complete-mission-btn">
                <i data-lucide="check-circle"></i> Complete Mission & Return Available
              </button>
            ` : `
              <button class="btn btn-outline" id="toggle-busy-btn">
                <i data-lucide="clock"></i> Mark Busy
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Incoming Call Card / Active Emergency Mission -->
          ${assignedEmg ? `
            <div class="glass-card" style="border:1px solid rgba(229,57,53,0.4); background:radial-gradient(circle at 0% 0%, rgba(229,57,53,0.15), transparent 70%);">
              <div class="card-header">
                <div class="card-title" style="color:#FF5252;">
                  <i data-lucide="siren" class="pulse-light"></i>
                  DISPATCH MISSION CALL: ${assignedEmg.type} (${assignedEmg.id})
                </div>
                <span class="badge badge-critical">PRIORITY ${assignedEmg.severity}/10</span>
              </div>

              <div class="grid-2">
                <div>
                  <div style="font-size:0.85rem; color:var(--text-muted);">Patient Details:</div>
                  <div style="font-size:1.1rem; font-weight:800; margin-top:2px;">${assignedEmg.citizenName}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Phone: ${assignedEmg.citizenPhone}</div>
                  <div style="font-size:0.85rem; font-weight:600; margin-top:8px; color:#FF5252;">
                    Medical Summary: ${assignedEmg.medicalHistorySummary}
                  </div>
                </div>

                <div style="background:var(--input-bg); padding:1rem; border-radius:12px; display:flex; flex-direction:column; gap:0.5rem;">
                  <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.85rem; color:var(--text-muted);">Target Address:</span>
                    <span style="font-weight:700; font-size:0.85rem;">${assignedEmg.address}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.85rem; color:var(--text-muted);">Estimated ETA:</span>
                    <span style="font-weight:800; color:#4CAF50; font-size:1.1rem;">${assignedEmg.etaMinutes} MINS</span>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:0.85rem; color:var(--text-muted);">Target Hospital:</span>
                    <span style="font-weight:700; color:#9C27B0; font-size:0.85rem;">Metro Central General</span>
                  </div>
                </div>
              </div>

              <div style="display:flex; gap:1rem; margin-top:1.25rem;">
                <button class="btn btn-success" style="flex:1; padding:0.75rem;" id="accept-mission-btn">
                  <i data-lucide="navigation-2"></i> Accept Mission & Start Turn-by-Turn GPS
                </button>
                <button class="btn btn-outline" style="padding:0.75rem;" onclick="alert('Mission Rejected. AI Engine re-routing to Medic 2.')">
                  Reject & Re-route
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Live GPS Navigation Map -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="navigation" style="color:var(--success-green);"></i>
                Turn-by-Turn GPS Navigation & Trajectory Preview
              </div>
              <span class="badge badge-success">GPS Locked</span>
            </div>
            <div id="ambulance-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- Right Column: Vehicle Equipment & Live Status -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Equipment Checklist -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="briefcase-medical" style="color:var(--secondary-blue);"></i>
                Onboard Medical Equipment
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${myVehicle.equipment.map(eq => `
                <div style="background:var(--input-bg); padding:0.6rem 0.85rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem;">
                  <span>${eq}</span>
                  <i data-lucide="check-circle-2" style="color:#4CAF50; width:16px; height:16px;"></i>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Hospital Destination Quick Contact -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="hospital" style="color:var(--hospital-purple);"></i>
                Hospital ER Pre-Notification
              </div>
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
              Transmit patient vitals to Metro Central General ER triage room.
            </div>
            <button class="btn btn-secondary" style="width:100%;" onclick="alert('Vitals & ETA pre-transmitted to Metro Central General ER!')">
              <i data-lucide="radio-receiver"></i> Transmit ER Pre-Arrival Alert
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapManager.initMap('ambulance-map', [myVehicle.lat, myVehicle.lng], 14);
    mapManager.renderEmergencyEcosystem(db, "ambulance");
  }, 100);

  // Complete Mission Handler
  document.getElementById('complete-mission-btn')?.addEventListener('click', () => {
    myVehicle.status = "AVAILABLE";
    myVehicle.currentEmergencyId = null;
    apiService.addNotification({
      title: "Mission Completed",
      text: `${myVehicle.callSign} completed mission and returned to AVAILABLE.`,
      type: "success"
    });
    apiService.saveState();
    renderAmbulanceApp();
  });

  // Accept Mission Handler
  document.getElementById('accept-mission-btn')?.addEventListener('click', async () => {
    await apiService.acceptMission({
      vehicleId: myVehicle.id,
      emergencyId: assignedEmg.id
    });
    renderAmbulanceApp();
  });
}
