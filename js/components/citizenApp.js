/**
 * SERCN Citizen App Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';

export function renderCitizenApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const activeEmg = db.emergencies.find(e => e.citizenName === db.currentUser.name && e.status !== "RESOLVED");

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Offline Mode Banner Toggle -->
      <div id="offline-banner" class="glass-card" style="padding: 0.75rem 1.25rem; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid var(--warning-yellow);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <i data-lucide="wifi-off" style="color: var(--warning-yellow); width: 20px; height: 20px;"></i>
          <div>
            <div style="font-weight: 700; font-size: 0.85rem;">Offline Emergency Direct SMS Fallback</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">If cellular data fails, SOS triggers low-frequency mesh SMS automatically.</div>
          </div>
        </div>
        <span class="badge badge-warning">Simulated Mesh Active</span>
      </div>

      <!-- Main Citizen Layout -->
      <div class="grid-main-sidebar">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- SOS Trigger Section -->
          <div class="glass-card sos-section">
            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">
              Emergency Assistance Network
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 500px; margin-bottom: 1.5rem;">
              Press the SOS button below to automatically dispatch the nearest available responder with your live GPS.
            </p>

            <button class="sos-button-trigger" id="trigger-sos-btn">
              <span>SOS</span>
              <span class="sos-subtext">Hold 1 sec</span>
            </button>

            <!-- 8 Category Grid -->
            <div style="margin-top: 2rem; width: 100%;">
              <div style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem;">
                Select Emergency Category
              </div>
              <div class="category-grid">
                <div class="category-card" data-cat="Heart Attack">
                  <div class="category-icon"><i data-lucide="heart-pulse"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Heart Attack</span>
                </div>
                <div class="category-card" data-cat="Stroke">
                  <div class="category-icon"><i data-lucide="activity"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Stroke</span>
                </div>
                <div class="category-card" data-cat="Accident">
                  <div class="category-icon"><i data-lucide="car-front"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Accident</span>
                </div>
                <div class="category-card" data-cat="Fire">
                  <div class="category-icon"><i data-lucide="flame"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Fire</span>
                </div>
                <div class="category-card" data-cat="Crime">
                  <div class="category-icon"><i data-lucide="shield-alert"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Crime</span>
                </div>
                <div class="category-card" data-cat="Natural Disaster">
                  <div class="category-icon"><i data-lucide="wind"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Natural Disaster</span>
                </div>
                <div class="category-card" data-cat="Medical Emergency">
                  <div class="category-icon"><i data-lucide="cross"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Medical</span>
                </div>
                <div class="category-card" data-cat="Other">
                  <div class="category-icon"><i data-lucide="alert-triangle"></i></div>
                  <span style="font-size: 0.8rem; font-weight: 700;">Other</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Tracking Section (If Active Emergency Exists) -->
          ${activeEmg ? `
            <div class="glass-card" style="border-left: 4px solid var(--primary-red);">
              <div class="card-header">
                <div class="card-title">
                  <i data-lucide="navigation" style="color: var(--primary-red);"></i>
                  Active Emergency Status: ${activeEmg.type} (${activeEmg.id})
                </div>
                <span class="badge badge-critical">ETA: ${activeEmg.etaMinutes} MINS</span>
              </div>

              <div class="grid-2">
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.75rem;">Live Timeline</div>
                  <div class="timeline">
                    ${activeEmg.timeline.map(t => `
                      <div class="timeline-step ${t.status}">
                        <div class="timeline-node">
                          <i data-lucide="${t.status === 'completed' ? 'check' : 'clock'}" style="width:14px;height:14px;"></i>
                        </div>
                        <div class="timeline-content">
                          <div class="timeline-title">${t.step}</div>
                          <div class="timeline-time">${t.time}</div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.75rem;">Responders Dispatched</div>
                  <div style="background: var(--input-bg); padding: 1rem; border-radius: 12px; border: 1px solid var(--input-border); display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.85rem; color:var(--text-muted);">Assigned Vehicle:</span>
                      <span style="font-weight:700; color:#4CAF50;">${activeEmg.assignedVehicleId || 'Finding nearest...'}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.85rem; color:var(--text-muted);">Reserved Hospital:</span>
                      <span style="font-weight:700; color:#9C27B0;">${activeEmg.assignedHospitalId || 'Metro Central General'}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:0.85rem; color:var(--text-muted);">Volunteer Responder:</span>
                      <span style="font-weight:700; color:#FFC107;">${activeEmg.assignedVolunteerId || 'Elena Rostova (0.2km away)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Interactive GIS Emergency Radar Map -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="map" style="color: var(--secondary-blue);"></i>
                Live GIS Responder Radar
              </div>
              <span class="badge badge-info">GPS Signal Strong</span>
            </div>
            <div id="citizen-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- Right Sidebar: Medical Profile & Nearby Radar -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Personal Medical Passport -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size: 1.05rem;">
                <i data-lucide="user-check" style="color: var(--success-green);"></i>
                Medical History Passport
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Blood Group:</span>
                <span style="font-weight: 800; color: #FF5252;">${db.currentUser.bloodGroup}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Allergies:</span>
                <span style="font-weight: 700;">${db.currentUser.allergies}</span>
              </div>
              <div>
                <span style="color: var(--text-muted);">Medical History:</span>
                <div style="font-weight: 600; margin-top: 2px;">${db.currentUser.medicalConditions}</div>
              </div>
            </div>
          </div>

          <!-- Emergency Contacts -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size: 1.05rem;">
                <i data-lucide="phone-call" style="color: var(--secondary-blue);"></i>
                Emergency Contacts
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              ${db.currentUser.emergencyContacts.map(c => `
                <div style="background: var(--input-bg); padding: 0.65rem 0.85rem; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700;">${c.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${c.phone}</div>
                  </div>
                  <button class="btn btn-outline" style="padding: 0.35rem 0.6rem;" onclick="alert('Calling ${c.name} (${c.phone})...')">
                    <i data-lucide="phone" style="width:14px;height:14px;"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Nearby Emergency Stations Radar -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size: 1.05rem;">
                <i data-lucide="building-2" style="color: var(--hospital-purple);"></i>
                Nearby Emergency Facilities
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.85rem;">
              <div style="border-bottom: 1px solid var(--card-border); padding-bottom: 0.5rem;">
                <div style="font-weight: 700; color: #9C27B0;">🏥 Metro Central General</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">1.2 km away • 18 Beds Available</div>
              </div>
              <div style="border-bottom: 1px solid var(--card-border); padding-bottom: 0.5rem;">
                <div style="font-weight: 700; color: #2196F3;">👮 1st Precinct Station</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">0.8 km away • 24 Officers On Duty</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #FF9800;">🚒 Engine Company 7</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">0.5 km away • 3 Fire Trucks Ready</div>
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
    mapManager.initMap('citizen-map', [40.7180, -74.0020], 14);
    mapManager.renderEmergencyEcosystem(db, "ALL");
  }, 100);

  // SOS Trigger Handler -> Open Intake Form Modal
  document.getElementById('trigger-sos-btn')?.addEventListener('click', () => {
    triggerIntakeModal("Medical Emergency");
  });

  // Category Click Handler
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      triggerIntakeModal(cat);
    });
  });
}

// Intake Modal for Media Upload, Voice Recording, and Live GPS
function triggerIntakeModal(category) {
  const modalContainer = document.getElementById('auth-modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-card">
        <button class="modal-close" id="close-sos-modal">✕</button>

        <div style="text-align:center; margin-bottom: 1.25rem;">
          <div class="sos-button-trigger" style="width:70px; height:70px; font-size:1rem; margin:0 auto 0.75rem auto;">
            <span>SOS</span>
          </div>
          <h2 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:800;">
            Initiate ${category} Emergency
          </h2>
          <p style="font-size:0.8rem; color:var(--text-muted);">
            GPS locked at 40.7180, -74.0020 (Broad St & Wall St, NY)
          </p>
        </div>

        <form id="sos-intake-form">
          <div class="form-group">
            <label class="form-label">Attach Incident Photo / Video</label>
            <input type="file" class="form-input" accept="image/*,video/*" />
          </div>

          <div class="form-group">
            <label class="form-label">Voice Recording Note (Simulated)</label>
            <button type="button" id="rec-voice-btn" class="btn btn-outline" style="width:100%;">
              <i data-lucide="mic"></i> Record Voice Description (Hold to Speak)
            </button>
          </div>

          <div class="form-group">
            <label class="form-label">Additional Symptoms / Notes</label>
            <textarea class="form-textarea" rows="2" placeholder="Describe victim condition, hazards, or exact door code..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; padding:0.85rem; font-size:1rem;">
            <i data-lucide="radio-tower"></i> Transmit Emergency Request
          </button>
        </form>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('close-sos-modal')?.addEventListener('click', () => {
    modalContainer.innerHTML = '';
  });

  document.getElementById('rec-voice-btn')?.addEventListener('click', (e) => {
    e.target.innerHTML = `<i data-lucide="square" style="color:#FF5252;"></i> Recording Audio... 00:04`;
    if (window.lucide) window.lucide.createIcons();
  });

  document.getElementById('sos-intake-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    modalContainer.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card" style="text-align:center; padding:3rem 2rem;">
          <div class="brand-logo" style="width:60px; height:60px; margin:0 auto 1rem auto; animation: pulse-sos 1.2s infinite;">
            <i data-lucide="radar" style="width:32px;height:32px;"></i>
          </div>
          <h3 style="font-family:var(--font-heading); font-size:1.4rem; font-weight:800;">Finding Nearest Responders...</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">
            AI Engine calculating Haversine distance matrix and traffic speeds...
          </p>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();

    await apiService.createEmergency({
      type: category,
      lat: 40.7180,
      lng: -74.0020,
      address: "452 Broadway, SoHo, NY",
      mediaAttached: { photos: 1, video: false, voiceNote: true }
    });

    setTimeout(() => {
      modalContainer.innerHTML = '';
      renderCitizenApp();
    }, 1200);
  });
}
