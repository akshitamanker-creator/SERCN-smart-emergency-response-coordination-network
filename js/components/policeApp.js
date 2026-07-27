/**
 * SERCN Police Officer Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';

export function renderPoliceApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const myVehicle = db.vehicles.find(v => v.type === "police") || db.vehicles[1];
  const policeIncidents = db.emergencies.filter(e => e.type === "Crime" || e.type === "Accident");

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Police Officer Header Bar -->
      <div class="glass-card" style="border-left:4px solid var(--secondary-blue);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #2196F3, #0D47A1); font-size:1.1rem;">
              <i data-lucide="shield"></i>
            </div>
            <div>
              <h2 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800;">${myVehicle.callSign}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">Officer: ${myVehicle.driver} • Unit: ${myVehicle.id}</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <button class="btn btn-warning" id="traffic-clearance-btn">
              <i data-lucide="siren"></i> Activate Traffic Priority Wave
            </button>
            <span class="badge badge-info">STATUS: ${myVehicle.status}</span>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Nearby Police Incidents Radar -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="shield-alert" style="color:var(--secondary-blue);"></i>
                Active Crime & Accident Incidents Radar
              </div>
              <span class="badge badge-critical">${policeIncidents.length} Active Feeds</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${policeIncidents.map(inc => `
                <div style="background:var(--input-bg); padding:1rem; border-radius:12px; border:1px solid var(--input-border); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span style="font-weight:800; font-size:1rem; color:#2196F3;">${inc.type}</span>
                      <span class="badge badge-critical">Severity ${inc.severity}/10</span>
                    </div>
                    <div style="font-size:0.85rem; margin-top:4px;">📍 ${inc.address}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Reported by: ${inc.citizenName} • ${inc.timestamp}</div>
                  </div>

                  <button class="btn btn-secondary" style="padding:0.6rem 1rem;" onclick="alert('Police Patrol ${myVehicle.id} assigned to ${inc.id}!')">
                    <i data-lucide="navigation"></i> Accept Patrol Call
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Police GIS Map -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="map" style="color:var(--secondary-blue);"></i>
                Police Patrol GIS Grid Map
              </div>
            </div>
            <div id="police-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- Police Controls & Precinct Stations -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Traffic Management Console -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="traffic-cone" style="color:var(--warning-yellow);"></i>
                Traffic Signal Override
              </div>
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
              Toggle green wave signal overrides along emergency ambulance corridors.
            </div>
            <button class="btn btn-warning" style="width:100%;" onclick="alert('Green Wave Signal Override active on 5th Ave Corridor!')">
              <i data-lucide="zap"></i> Override Corridor Signal to Green
            </button>
          </div>

          <!-- Precinct Stations -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="building" style="color:var(--secondary-blue);"></i>
                Precinct Station Roster
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.85rem;">
              ${db.policeStations.map(ps => `
                <div style="background:var(--input-bg); padding:0.65rem; border-radius:8px; display:flex; justify-content:space-between;">
                  <span>${ps.name}</span>
                  <span style="font-weight:700; color:#2196F3;">${ps.officersOnDuty} Officers</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapManager.initMap('police-map', [myVehicle.lat, myVehicle.lng], 14);
    mapManager.renderEmergencyEcosystem(db, "police");
  }, 100);

  document.getElementById('traffic-clearance-btn')?.addEventListener('click', () => {
    apiService.addNotification({
      title: "Traffic Priority Wave Activated",
      text: "Siren beacon broadcast to local traffic signals for express routing.",
      type: "warning"
    });
  });
}
