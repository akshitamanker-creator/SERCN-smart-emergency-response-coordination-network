/**
 * SERCN Admin / Control Room Master Dashboard Component
 */

import { apiService } from '../apiService.js';
import { mapManager } from '../mapManager.js';
import { chartsManager } from '../chartsManager.js';

export function renderAdminApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const db = apiService.db;
  const activeCases = db.emergencies.filter(e => e.status !== "RESOLVED").length;
  const availableVehicles = db.vehicles.filter(v => v.status === "AVAILABLE").length;
  const busyVehicles = db.vehicles.filter(v => v.status !== "AVAILABLE").length;

  container.innerHTML = `
    <div class="dashboard-view">
      <!-- Admin Header Bar -->
      <div class="glass-card" style="border-left:4px solid var(--primary-red);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:0.85rem;">
            <div class="avatar-circle" style="width:44px; height:44px; background:linear-gradient(135deg, #E53935, #B71C1C); font-size:1.1rem;">
              <i data-lucide="layout-dashboard"></i>
            </div>
            <div>
              <h2 style="font-family:var(--font-heading); font-size:1.35rem; font-weight:800;">Emergency Control Room Command Center</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">Real-time Multi-Agency GIS Operations & Analytics</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:1rem;">
            <span class="badge badge-critical" style="font-size:0.85rem; padding:0.4rem 0.8rem;">
              LIVE CONNECTED METRO GRID
            </span>
          </div>
        </div>
      </div>

      <!-- Live Operations KPI Ribbon -->
      <div class="grid-4">
        <div class="glass-card" style="border-top:3px solid var(--primary-red);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">ACTIVE EMERGENCIES</div>
              <div style="font-size:1.8rem; font-weight:800; color:#FF5252; margin-top:2px;">${activeCases}</div>
            </div>
            <i data-lucide="alert-circle" style="color:#FF5252; width:32px; height:32px;"></i>
          </div>
        </div>

        <div class="glass-card" style="border-top:3px solid var(--success-green);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">AVG RESPONSE TIME</div>
              <div style="font-size:1.8rem; font-weight:800; color:#4CAF50; margin-top:2px;">4.1 MINS</div>
            </div>
            <i data-lucide="clock" style="color:#4CAF50; width:32px; height:32px;"></i>
          </div>
        </div>

        <div class="glass-card" style="border-top:3px solid var(--secondary-blue);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">AVAILABLE FLEET</div>
              <div style="font-size:1.8rem; font-weight:800; color:#2196F3; margin-top:2px;">${availableVehicles} / ${db.vehicles.length}</div>
            </div>
            <i data-lucide="truck" style="color:#2196F3; width:32px; height:32px;"></i>
          </div>
        </div>

        <div class="glass-card" style="border-top:3px solid var(--warning-yellow);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">DISPATCHED / BUSY</div>
              <div style="font-size:1.8rem; font-weight:800; color:#FF9800; margin-top:2px;">${busyVehicles}</div>
            </div>
            <i data-lucide="radio" style="color:#FF9800; width:32px; height:32px;"></i>
          </div>
        </div>
      </div>

      <!-- Large Interactive Command Center GIS Map -->
      <div class="glass-card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="globe" style="color:var(--secondary-blue);"></i>
            Unified Metro Emergency GIS Command Map
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-outline" id="map-filter-all" style="padding:0.35rem 0.75rem; font-size:0.75rem;">Show All</button>
            <button class="btn btn-outline" id="map-filter-emg" style="padding:0.35rem 0.75rem; font-size:0.75rem; color:#FF5252;">Emergencies Only</button>
            <button class="btn btn-outline" id="map-filter-amb" style="padding:0.35rem 0.75rem; font-size:0.75rem; color:#4CAF50;">Ambulances Only</button>
          </div>
        </div>
        <div id="admin-master-map" class="leaflet-map-container" style="height:550px;"></div>
      </div>

      <!-- Analytics Charts Section -->
      <div class="grid-2">
        <div class="glass-card">
          <div class="card-header">
            <div class="card-title" style="font-size:1rem;">
              <i data-lucide="bar-chart-2" style="color:var(--primary-red);"></i>
              Incident Types Today
            </div>
          </div>
          <div style="height:250px; position:relative;">
            <canvas id="types-chart"></canvas>
          </div>
        </div>

        <div class="glass-card">
          <div class="card-header">
            <div class="card-title" style="font-size:1rem;">
              <i data-lucide="trending-down" style="color:var(--success-green);"></i>
              Response Time Trend (24 Hrs)
            </div>
          </div>
          <div style="height:250px; position:relative;">
            <canvas id="response-chart"></canvas>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="glass-card">
          <div class="card-header">
            <div class="card-title" style="font-size:1rem;">
              <i data-lucide="pie-chart" style="color:var(--hospital-purple);"></i>
              Metro Hospital ICU & Bed Occupancy
            </div>
          </div>
          <div style="height:220px; position:relative;">
            <canvas id="hospital-chart"></canvas>
          </div>
        </div>

        <div class="glass-card">
          <div class="card-header">
            <div class="card-title" style="font-size:1rem;">
              <i data-lucide="truck" style="color:var(--secondary-blue);"></i>
              Vehicle Fleet Utilization
            </div>
          </div>
          <div style="height:220px; position:relative;">
            <canvas id="vehicle-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Initialize Map
  setTimeout(() => {
    mapManager.initMap('admin-master-map', [40.7180, -74.0020], 13);
    mapManager.renderEmergencyEcosystem(db, "ALL");

    // Initialize Analytics Charts
    chartsManager.renderTypesChart('types-chart', db);
    chartsManager.renderResponseTimeChart('response-chart');
    chartsManager.renderHospitalCapacityChart('hospital-chart', db);
    chartsManager.renderVehicleStatusChart('vehicle-chart', db);
  }, 100);

  // Filter Buttons
  document.getElementById('map-filter-all')?.addEventListener('click', () => {
    mapManager.renderEmergencyEcosystem(db, "ALL");
  });
  document.getElementById('map-filter-emg')?.addEventListener('click', () => {
    mapManager.renderEmergencyEcosystem(db, "EMERGENCY");
  });
  document.getElementById('map-filter-amb')?.addEventListener('click', () => {
    mapManager.renderEmergencyEcosystem(db, "ambulance");
  });
}
