/**
 * SERCN Floating Emergency Simulation Controls Component
 */

import { apiService } from '../apiService.js';
import { simulationEngine } from '../simulationEngine.js';

export function renderSimulationBar(onSimUpdate) {
  const container = document.getElementById('simulation-bar-container');
  if (!container) return;

  const db = apiService.db;

  container.innerHTML = `
    <div class="simulation-bar">
      <div class="sim-label">
        <i data-lucide="play" style="width:14px;height:14px;"></i> SIM ENGINE
      </div>

      <div class="sim-btn-group">
        <button class="sim-btn" id="sim-spawn-btn" title="Spawn Random Emergency">
          <i data-lucide="plus-circle"></i> Spawn Incident
        </button>

        <button class="sim-btn ${db.simulation.vehicleMovementActive ? 'active' : ''}" id="sim-move-btn" title="Toggle Animated Vehicle Movement">
          <i data-lucide="play-circle"></i> ${db.simulation.vehicleMovementActive ? 'Moving...' : 'Move Vehicles'}
        </button>

        <button class="sim-btn" id="sim-traffic-btn" title="Toggle Traffic Congestion">
          <i data-lucide="activity"></i> Traffic: ${db.simulation.trafficCondition}
        </button>

        <button class="sim-btn" id="sim-surge-btn" title="Simulate Hospital Occupancy Surge">
          <i data-lucide="hospital"></i> ${db.simulation.hospitalSurge ? 'Surge ACTIVE' : 'Surge Off'}
        </button>

        <button class="sim-btn" id="sim-reset-btn" title="Reset Database to Seed State">
          <i data-lucide="rotate-ccw"></i> Reset DB
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Handlers
  document.getElementById('sim-spawn-btn')?.addEventListener('click', () => {
    simulationEngine.spawnRandomEmergency();
    if (onSimUpdate) onSimUpdate();
  });

  document.getElementById('sim-move-btn')?.addEventListener('click', () => {
    db.simulation.vehicleMovementActive = !db.simulation.vehicleMovementActive;
    if (db.simulation.vehicleMovementActive) {
      simulationEngine.start();
    } else {
      simulationEngine.stop();
    }
    apiService.saveState();
    renderSimulationBar(onSimUpdate);
  });

  document.getElementById('sim-traffic-btn')?.addEventListener('click', () => {
    const states = ["NORMAL", "HEAVY", "GRIDLOCK"];
    const nextIdx = (states.indexOf(db.simulation.trafficCondition) + 1) % states.length;
    simulationEngine.setTrafficCondition(states[nextIdx]);
    renderSimulationBar(onSimUpdate);
    if (onSimUpdate) onSimUpdate();
  });

  document.getElementById('sim-surge-btn')?.addEventListener('click', () => {
    simulationEngine.toggleHospitalSurge();
    renderSimulationBar(onSimUpdate);
    if (onSimUpdate) onSimUpdate();
  });

  document.getElementById('sim-reset-btn')?.addEventListener('click', () => {
    apiService.resetDatabase();
    location.reload();
  });
}
