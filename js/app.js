/**
 * SERCN Application Entry Point & Router
 */

import { apiService } from './apiService.js';
import { simulationEngine } from './simulationEngine.js';
import { renderHeader } from './components/header.js';
import { renderCitizenApp } from './components/citizenApp.js';
import { renderAIDispatchApp } from './components/aiDispatchApp.js';
import { renderAmbulanceApp } from './components/ambulanceApp.js';
import { renderPoliceApp } from './components/policeApp.js';
import { renderFireApp } from './components/fireApp.js';
import { renderHospitalApp } from './components/hospitalApp.js';
import { renderAdminApp } from './components/adminApp.js';
import { renderVolunteerApp } from './components/volunteerApp.js';
import { renderSimulationBar } from './components/simulationBar.js';
import { renderSettingsApp } from './components/settingsApp.js';

class App {
  constructor() {
    this.currentRole = apiService.db.currentUser.role || 'citizen';
  }

  init() {
    // Start simulation engine tick loop
    simulationEngine.start();

    // Render global header & simulation toolbar
    this.renderLayout();

    // Subscribe to state changes for real-time notification toasts
    this.lastNotifId = null;
    apiService.subscribe(db => {
      if (db.notifications.length > 0) {
        const latest = db.notifications[0];
        if (latest.id !== this.lastNotifId) {
          this.lastNotifId = latest.id;
          this.showToast(latest.title, latest.text, latest.type);
        }
      }
    });

    // Render current active role dashboard
    this.route(this.currentRole);
  }

  renderLayout() {
    renderHeader(role => {
      this.currentRole = role;
      this.route(role);
    });

    renderSimulationBar(() => {
      this.route(this.currentRole);
    });
  }

  route(role) {
    this.currentRole = role;
    renderHeader(role => {
      this.currentRole = role;
      this.route(role);
    });

    switch (role) {
      case 'citizen':
        renderCitizenApp();
        break;
      case 'ai-dispatch':
        renderAIDispatchApp();
        break;
      case 'ambulance':
        renderAmbulanceApp();
        break;
      case 'police':
        renderPoliceApp();
        break;
      case 'fire':
        renderFireApp();
        break;
      case 'hospital':
        renderHospitalApp();
        break;
      case 'admin':
        renderAdminApp();
        break;
      case 'volunteer':
        renderVolunteerApp();
        break;
      case 'settings':
        renderSettingsApp();
        break;
      default:
        renderCitizenApp();
        break;
    }
  }

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i data-lucide="${type === 'critical' ? 'alert-octagon' : type === 'warning' ? 'alert-triangle' : 'info'}" style="width:20px;height:20px;"></i>
      <div>
        <div style="font-weight:700; font-size:0.85rem;">${title}</div>
        <div style="font-size:0.75rem; opacity:0.9;">${message}</div>
      </div>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
