/**
 * SERCN AI Dispatch Engine Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';
import { rankNearestVehicles, rankHospitals } from '../aiEngine.js';

export function renderAIDispatchApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const targetEmg = db.emergencies[0] || {
    id: "EMG-DEMO",
    type: "Heart Attack",
    severity: 9,
    lat: 40.7180,
    lng: -74.0020,
    address: "452 Broadway, SoHo, NY"
  };

  const rankedVehicles = rankNearestVehicles(targetEmg.lat, targetEmg.lng, db.vehicles, null, db.simulation.trafficCondition);
  const rankedHospitals = rankHospitals(targetEmg.lat, targetEmg.lng, db.hospitals);

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- AI Engine Header Banner -->
      <div class="glass-card" style="background: linear-gradient(135deg, rgba(21, 101, 192, 0.2), rgba(15, 23, 42, 0.8)); border-left: 4px solid var(--secondary-blue);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="cpu" style="color:var(--secondary-blue); width:24px; height:24px;"></i>
              <h2 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:800;">Autonomous AI Dispatch Engine</h2>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
              Predictive Haversine Distance & Dynamic Traffic Neural Network Dispatching
            </p>
          </div>
          <div style="display:flex; gap:1rem;">
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:var(--text-muted);">Current Emergency Target</div>
              <div style="font-weight:800; color:#FF5252;">${targetEmg.id} (${targetEmg.type})</div>
            </div>
            <button class="btn btn-primary" id="re-run-ai-btn">
              <i data-lucide="play-circle"></i> Trigger AI Optimization
            </button>
          </div>
        </div>
      </div>

      <!-- 12-Step Visual AI Pipeline Breakdown -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="git-commit" style="color:var(--primary-red);"></i>
            Live AI Dispatch Workflow Pipeline
          </div>
        </div>

        <div class="dispatch-pipeline">
          <div class="pipeline-step completed">
            <div class="step-number">Step 1</div>
            <div class="step-label">Receive Intake</div>
          </div>
          <div class="pipeline-step completed">
            <div class="step-number">Step 2</div>
            <div class="step-label">Severity Score</div>
          </div>
          <div class="pipeline-step active">
            <div class="step-number">Step 3</div>
            <div class="step-label">Nearest Search</div>
          </div>
          <div class="pipeline-step active">
            <div class="step-number">Step 4</div>
            <div class="step-label">Calculate ETA</div>
          </div>
          <div class="pipeline-step active">
            <div class="step-number">Step 5</div>
            <div class="step-label">Rank Vehicles</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 6</div>
            <div class="step-label">Notify Ambulance</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 7</div>
            <div class="step-label">Notify Police</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 8</div>
            <div class="step-label">Notify Fire</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 9</div>
            <div class="step-label">Notify Hospital</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 10</div>
            <div class="step-label">Wait Acceptance</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 11</div>
            <div class="step-label">Assign Unit</div>
          </div>
          <div class="pipeline-step">
            <div class="step-number">Step 12</div>
            <div class="step-label">Sync Network</div>
          </div>
        </div>
      </div>

      <!-- Main AI Analysis Matrices -->
      <div class="grid-main-sidebar">
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- Ranked Vehicles Selection Matrix Table -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="list-ordered" style="color:var(--success-green);"></i>
                AI Vehicle Matching & Ranking Matrix
              </div>
              <span class="badge badge-success">Traffic: ${db.simulation.trafficCondition}</span>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
                <thead>
                  <tr style="border-bottom:1px solid var(--card-border); color:var(--text-muted);">
                    <th style="padding:0.75rem;">Rank</th>
                    <th style="padding:0.75rem;">Callsign / Vehicle</th>
                    <th style="padding:0.75rem;">Type</th>
                    <th style="padding:0.75rem;">Distance</th>
                    <th style="padding:0.75rem;">Est. ETA</th>
                    <th style="padding:0.75rem;">AI Score</th>
                    <th style="padding:0.75rem;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${rankedVehicles.map((v, i) => `
                    <tr style="border-bottom:1px solid var(--card-border);">
                      <td style="padding:0.75rem; font-weight:800; color:${i===0 ? '#4CAF50' : 'var(--text-main)'};">#${i+1}</td>
                      <td style="padding:0.75rem; font-weight:700;">${v.callSign}</td>
                      <td style="padding:0.75rem; text-transform:uppercase; font-size:0.75rem;">
                        <span class="badge badge-info">${v.type}</span>
                      </td>
                      <td style="padding:0.75rem;">${v.distanceKm} km</td>
                      <td style="padding:0.75rem; font-weight:700; color:#FF5252;">${v.etaMinutes} mins</td>
                      <td style="padding:0.75rem;">
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                          <div style="width:60px; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                            <div style="width:${v.aiScore}%; height:100%; background:linear-gradient(90deg, #4CAF50, #81C784);"></div>
                          </div>
                          <span style="font-weight:700;">${v.aiScore}%</span>
                        </div>
                      </td>
                      <td style="padding:0.75rem;">
                        <button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="alert('Manual Override Dispatch Sent to ${v.callSign}')">
                          Override Dispatch
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- AI Map -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title">
                <i data-lucide="map-pin" style="color:var(--warning-yellow);"></i>
                AI Trajectory GIS Map
              </div>
            </div>
            <div id="ai-dispatch-map" class="leaflet-map-container"></div>
          </div>
        </div>

        <!-- AI Score Cards & Hospital Recommendation -->
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          
          <!-- AI Predictive Metrics Card -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="sparkles" style="color:#FF5252;"></i>
                AI Model Metrics
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div style="background:var(--input-bg); padding:0.85rem; border-radius:10px;">
                <div style="font-size:0.75rem; color:var(--text-muted);">Severity Classifier</div>
                <div style="font-size:1.35rem; font-weight:800; color:#FF5252; margin-top:2px;">
                  ${targetEmg.severity} / 10 (CRITICAL)
                </div>
              </div>
              <div style="background:var(--input-bg); padding:0.85rem; border-radius:10px;">
                <div style="font-size:0.75rem; color:var(--text-muted);">Best Vehicle Confidence</div>
                <div style="font-size:1.35rem; font-weight:800; color:#4CAF50; margin-top:2px;">
                  ${rankedVehicles[0]?.aiScore || 94}% Score
                </div>
              </div>
              <div style="background:var(--input-bg); padding:0.85rem; border-radius:10px;">
                <div style="font-size:0.75rem; color:var(--text-muted);">Traffic Congestion Delay</div>
                <div style="font-size:1.35rem; font-weight:800; color:#FF9800; margin-top:2px;">
                  +${db.simulation.trafficCondition === 'HEAVY' ? '2.5' : db.simulation.trafficCondition === 'GRIDLOCK' ? '5.0' : '0.0'} mins
                </div>
              </div>
            </div>
          </div>

          <!-- Hospital Reservation Recommendation -->
          <div class="glass-card">
            <div class="card-header">
              <div class="card-title" style="font-size:1rem;">
                <i data-lucide="hospital" style="color:var(--hospital-purple);"></i>
                Hospital Reservation Matrix
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${rankedHospitals.map(h => `
                <div style="background:var(--input-bg); padding:0.75rem; border-radius:10px; border:1px solid var(--input-border);">
                  <div style="font-weight:700; color:#9C27B0;">${h.name}</div>
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                    <span>Dist: ${h.distanceKm} km</span>
                    <span>Beds: ${h.availableBeds}/${h.totalBeds}</span>
                    <span>Match: <strong style="color:#4CAF50;">${h.hospitalScore}%</strong></span>
                  </div>
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
    mapManager.initMap('ai-dispatch-map', [40.7180, -74.0020], 13);
    mapManager.renderEmergencyEcosystem(db, "ALL");
  }, 100);

  document.getElementById('re-run-ai-btn')?.addEventListener('click', () => {
    apiService.addNotification({
      title: "AI Engine Optimization Executed",
      text: "Recalculated full city dispatch weights and Haversine vectors.",
      type: "success"
    });
    renderAIDispatchApp();
  });
}
