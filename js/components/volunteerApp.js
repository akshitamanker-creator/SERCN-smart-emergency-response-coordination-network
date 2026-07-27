/**
 * SERCN Volunteer Responder Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';

export function renderVolunteerApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const volunteer = db.volunteers[0];
  const nearbyIncidents = db.emergencies.filter(e => e.status !== "RESOLVED");

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Volunteer Header -->
      <div class="glass-card" style="border-left:4px solid var(--volunteer-amber);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #FFC107, #FF6F00); font-size:1.1rem;">
              <i data-lucide="user-check"></i>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <h2 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800;">${volunteer.name}</h2>
                <span class="badge badge-warning">VERIFIED VOLUNTEER</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted);">
                Badge: ${volunteer.badgeNumber} • Certifications: ${volunteer.certifications.join(', ')}
              </div>
            </div>
          </div>

          <div>
            <span class="badge badge-success">READY FOR NEARBY DISPATCH</span>
          </div>
        </div>
      </div>

      <!-- Layout -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Nearby Community Emergency Requests -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="heart-handshake" style="color:var(--volunteer-amber);"></i>
                Nearby Incidents Requiring Immediate CPR / First Aid
              </div>
              <span class="badge badge-warning">Within 1.5 km</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              ${nearbyIncidents.map(inc => `
                <div style="background:var(--input-bg); padding:1rem; border-radius:12px; border:1px solid var(--input-border); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-weight:800; font-size:1rem; color:#FFC107;">🚨 ${inc.type} (0.2 km away)</div>
                    <div style="font-size:0.85rem; margin-top:4px;">📍 ${inc.address}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Patient: ${inc.citizenName} • Status: ${inc.status}</div>
                  </div>

                  <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-warning" style="padding:0.6rem 0.85rem;" onclick="alert('Accepted Help Request! Navigation locked.')">
                      <i data-lucide="navigation"></i> Respond as Volunteer
                    </button>
                    <button class="btn btn-success" style="padding:0.6rem 0.85rem;" onclick="alert('First Aid Marked Completed! Thank you for your service.')">
                      <i data-lucide="check"></i> Mark First Aid Done
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Volunteer GIS Map -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="map" style="color:var(--volunteer-amber);"></i>
                Volunteer Proximity Radar Map
              </div>
            </div>
            <div id="volunteer-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- CPR & First Aid Protocol Guide -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <div class="glass-card" style="border-top:3px solid var(--volunteer-amber);">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="book-open" style="color:var(--volunteer-amber);"></i>
                CPR Emergency Protocol Checklist
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
              <div style="background:var(--input-bg); padding:0.65rem; border-radius:8px;">
                <strong>1. Call for Help & AED</strong>: Ensure ambulance is dispatched.
              </div>
              <div style="background:var(--input-bg); padding:0.65rem; border-radius:8px;">
                <strong>2. Check Airway & Breathing</strong>: Look for normal chest rise.
              </div>
              <div style="background:var(--input-bg); padding:0.65rem; border-radius:8px;">
                <strong>3. Chest Compressions</strong>: 100-120 bpm pushing 2 inches deep.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapManager.initMap('volunteer-map', [volunteer.lat, volunteer.lng], 14);
    mapManager.renderEmergencyEcosystem(db, "VOLUNTEER");
  }, 100);
}
