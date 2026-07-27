/**
 * SERCN Hospital Staff Dashboard Component
 */

import { apiService } from '../apiService.js';

export function renderHospitalApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const hospital = db.hospitals[0];
  const incomingPatients = db.emergencies.filter(e => e.status !== "RESOLVED");

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Hospital Header Bar -->
      <div class="glass-card" style="border-left:4px solid var(--hospital-purple);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #9C27B0, #4A148C); font-size:1.1rem;">
              <i data-lucide="hospital"></i>
            </div>
            <div>
              <h2 style="font-family:var(--font-heading); font-size:1.3rem; font-weight:800;">${hospital.name}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">${hospital.address} • ER Triage Station</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <button class="btn btn-primary" id="reserve-icu-btn">
              <i data-lucide="plus-circle"></i> Reserve Emergency ICU Bed
            </button>
          </div>
        </div>
      </div>

      <!-- Live Bed Capacity KPI Cards -->
      <div class="grid-4">
        <div class="glass-card" style="text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">TOTAL BEDS</div>
          <div style="font-size:1.8rem; font-weight:800; margin-top:4px;">${hospital.totalBeds}</div>
          <div style="font-size:0.75rem; color:#4CAF50; margin-top:2px;">${hospital.availableBeds} Available</div>
        </div>

        <div class="glass-card" style="text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">ICU BEDS</div>
          <div style="font-size:1.8rem; font-weight:800; color:#FF5252; margin-top:4px;">${hospital.icuBedsAvailable} / ${hospital.icuBedsTotal}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Immediate Critical Cap</div>
        </div>

        <div class="glass-card" style="text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">ER DOCTORS ON DUTY</div>
          <div style="font-size:1.8rem; font-weight:800; color:#2196F3; margin-top:4px;">${hospital.doctorsAvailable}</div>
          <div style="font-size:0.75rem; color:#4CAF50; margin-top:2px;">On-Call Ready</div>
        </div>

        <div class="glass-card" style="text-align:center;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">OPERATION THEATRES (OT)</div>
          <div style="font-size:1.8rem; font-weight:800; color:#FF9800; margin-top:4px;">${hospital.operationTheatresActive} / ${hospital.operationTheatresTotal}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">2 OTs Open</div>
        </div>
      </div>

      <!-- Main Triage Queue Layout -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Incoming Patient Triage Queue Table -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="users" style="color:var(--hospital-purple);"></i>
                Incoming ER Emergency Patient Queue
              </div>
              <span class="badge badge-critical">${incomingPatients.length} En Route</span>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
                <thead>
                  <tr style="border-bottom:1px solid var(--card-border); color:var(--text-muted);">
                    <th style="padding:0.75rem;">Emergency ID</th>
                    <th style="padding:0.75rem;">Patient Name</th>
                    <th style="padding:0.75rem;">Condition / Type</th>
                    <th style="padding:0.75rem;">ETA</th>
                    <th style="padding:0.75rem;">Assigned Ambulance</th>
                    <th style="padding:0.75rem;">Required Dept</th>
                    <th style="padding:0.75rem;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${incomingPatients.map(p => `
                    <tr style="border-bottom:1px solid var(--card-border);">
                      <td style="padding:0.75rem; font-weight:800; color:#FF5252;">${p.id}</td>
                      <td style="padding:0.75rem; font-weight:700;">${p.citizenName}</td>
                      <td style="padding:0.75rem;">${p.type}</td>
                      <td style="padding:0.75rem; font-weight:800; color:#4CAF50;">${p.etaMinutes} MINS</td>
                      <td style="padding:0.75rem;">${p.assignedVehicleId || 'AMB-101'}</td>
                      <td style="padding:0.75rem;"><span class="badge badge-info">${p.type === 'Heart Attack' ? 'Cardiology' : 'Trauma ER'}</span></td>
                      <td style="padding:0.75rem;">
                        <button class="btn btn-success" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="alert('Bed #3 Assigned & Surgical Team Notified for ${p.citizenName}!')">
                          Assign ER Bed
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Side: Live Capacity Controls -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Live Capacity Sliders -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="sliders" style="color:var(--secondary-blue);"></i>
                Live Capacity Controls
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div>
                <label class="form-label">Available General Beds: <span id="bed-val">${hospital.availableBeds}</span></label>
                <input type="range" id="bed-slider" min="0" max="250" value="${hospital.availableBeds}" style="width:100%;" />
              </div>

              <div>
                <label class="form-label">Available ICU Beds: <span id="icu-val">${hospital.icuBedsAvailable}</span></label>
                <input type="range" id="icu-slider" min="0" max="30" value="${hospital.icuBedsAvailable}" style="width:100%;" />
              </div>
            </div>
          </div>

          <!-- Specialties Offered -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="award" style="color:var(--success-green);"></i>
                Hospital Level 1 Trauma Specialties
              </div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              ${hospital.specialties.map(s => `
                <span class="badge badge-info">${s}</span>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Slider events
  document.getElementById('bed-slider')?.addEventListener('input', (e) => {
    hospital.availableBeds = parseInt(e.target.value);
    document.getElementById('bed-val').innerText = e.target.value;
    apiService.saveState();
  });

  document.getElementById('icu-slider')?.addEventListener('input', (e) => {
    hospital.icuBedsAvailable = parseInt(e.target.value);
    document.getElementById('icu-val').innerText = e.target.value;
    apiService.saveState();
  });

  document.getElementById('reserve-icu-btn')?.addEventListener('click', () => {
    if (hospital.icuBedsAvailable > 0) {
      hospital.icuBedsAvailable -= 1;
      apiService.addNotification({
        title: "ICU Bed Reserved",
        text: `ICU Bed locked for incoming emergency. ${hospital.icuBedsAvailable} ICU beds remain.`,
        type: "success"
      });
      apiService.saveState();
      renderHospitalApp();
    }
  });
}
