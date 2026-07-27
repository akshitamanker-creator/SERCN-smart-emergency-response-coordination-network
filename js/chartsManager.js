/**
 * SERCN Chart.js Analytics Controller
 * Renders high-tech emergency response analytics for Control Room Dashboards.
 */

/* global Chart */

class ChartsManager {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  // 1. Emergency Category Distribution Chart
  renderTypesChart(canvasId, db) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Aggregate emergency counts by type
    const counts = { "Heart Attack": 12, "Accident": 28, "Fire": 9, "Crime": 15, "Stroke": 8, "Medical": 18 };
    db.emergencies.forEach(e => {
      counts[e.type] = (counts[e.type] || 0) + 1;
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [{
          label: 'Incidents Today',
          data: Object.values(counts),
          backgroundColor: [
            '#E53935',
            '#1565C0',
            '#FF9800',
            '#9C27B0',
            '#E91E63',
            '#00BCD4'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
          y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // 2. Average Response Time Trend Line Chart
  renderResponseTimeChart(canvasId) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Response Time (mins)',
          data: [5.2, 4.8, 6.1, 5.5, 4.2, 3.9],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
          y: { ticks: { color: '#94A3B8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // 3. Hospital Occupancy Doughnut Chart
  renderHospitalCapacityChart(canvasId, db) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let totalBeds = 0;
    let availableBeds = 0;
    db.hospitals.forEach(h => {
      totalBeds += h.totalBeds;
      availableBeds += h.availableBeds;
    });
    const occupiedBeds = totalBeds - availableBeds;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Occupied Beds', 'Available Beds'],
        datasets: [{
          data: [occupiedBeds, availableBeds],
          backgroundColor: ['#E53935', '#4CAF50'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94A3B8' } }
        }
      }
    });
  }

  // 4. Vehicle Utilization Doughnut Chart
  renderVehicleStatusChart(canvasId, db) {
    this.destroyChart(canvasId);
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const available = db.vehicles.filter(v => v.status === "AVAILABLE").length;
    const busy = db.vehicles.filter(v => v.status !== "AVAILABLE").length;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Available Fleet', 'Dispatched / Busy'],
        datasets: [{
          data: [available, busy],
          backgroundColor: ['#2196F3', '#FF9800'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94A3B8' } }
        }
      }
    });
  }
}

export const chartsManager = new ChartsManager();
