/**
 * SERCN Fire Department Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';

export function renderFireApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const myVehicle = db.vehicles.find(v => v.type === "fire") || db.vehicles[3];
  const fireIncidents = db.emergencies.filter(e => e.type === "Fire" || e.severity >= 9);

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Fire Department Header -->
      <div class="glass-card" style="border-left:4px solid var(--warning-yellow);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #FF9800, #E65100); font-size:1.1rem;">
              <i data-lucide="flame"></i>
            </div>
            <div>
              <h2 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800;">${myVehicle.callSign}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">Commander: ${myVehicle.driver} • Engine Unit: ${myVehicle.id}</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <button class="btn btn-warning" id="hydrant-sync-btn">
              <i data-lucide="droplet"></i> Sync Nearest Water Hydrants
            </button>
            <span class="badge badge-warning">STATUS: ${myVehicle.status}</span>
          </div>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Fire Incident Callouts -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="flame" style="color:var(--warning-yellow);"></i>
                Active Fire & Structural Alarm Incidents
              </div>
              <span class="badge badge-critical">${fireIncidents.length} Emergency Feeds</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${fireIncidents.map(inc => `
                <div style="background:var(--input-bg); padding:1rem; border-radius:12px; border:1px solid var(--input-border); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <span style="font-weight:800; font-size:1rem; color:#FF9800;">🔥 ${inc.type}</span>
                      <span class="badge badge-critical">Severity ${inc.severity}/10</span>
                    </div>
                    <div style="font-size:0.85rem; margin-top:4px;">📍 ${inc.address}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Target Hydrant: HYD-01 (85 PSI Pressure)</div>
                  </div>

                  <button class="btn btn-warning" style="padding:0.6rem 1rem;" onclick="alert('Fire Truck F-301 Dispatched to ${inc.id}!')">
                    <i data-lucide="flame"></i> Deploy Water Cannon
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Fire GIS Map with Water Hydrants Overlay -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="map-pin" style="color:var(--warning-yellow);"></i>
                Fire Engine GIS & Water Hydrant Infrastructure Map
              </div>
            </div>
            <div id="fire-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- Water Hydrants & Hazmat Info -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Hydrants Grid -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="droplet" style="color:#00BCD4;"></i>
                Water Hydrants Network
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.85rem;">
              ${db.hydrants.map(h => `
                <div style="background:var(--input-bg); padding:0.65rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:700;">${h.id}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${h.pressurePsi} PSI • ${h.status}</div>
                  </div>
                  <i data-lucide="check" style="color:#4CAF50; width:16px; height:16px;"></i>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Hazmat Preparedness -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="shield-alert" style="color:var(--primary-red);"></i>
                Hazmat Unit Readiness
              </div>
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted);">
              Thermal imaging cameras & chemical spill containment foam units primed.
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapManager.initMap('fire-map', [myVehicle.lat, myVehicle.lng], 14);
    mapManager.renderEmergencyEcosystem(db, "fire");
  }, 100);

  document.getElementById('hydrant-sync-btn')?.addEventListener('click', () => {
    apiService.addNotification({
      title: "Water Hydrants Synced",
      text: "Nearest high-pressure hydrant HYD-01 (85 PSI) locked on Fire map.",
      type: "info"
    });
  });
}
