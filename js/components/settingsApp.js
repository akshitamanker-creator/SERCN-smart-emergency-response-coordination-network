/**
 * SERCN Settings Page Component
 */

import { apiService } from '../apiService.js';

export function renderSettingsApp() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const user = apiService.db.currentUser;

  container.innerHTML = `
    <div class="dashboard-view" style="max-width: 900px; margin: 0 auto;">
      <div class="glass-card" style="border-left: 4px solid var(--secondary-blue);">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="settings" style="color:var(--secondary-blue);"></i>
            System Settings & Profile Preferences
          </div>
        </div>

        <form id="settings-form">
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="set-name" class="form-input" value="${user.name}" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="set-email" class="form-input" value="${user.email}" />
            </div>

            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="text" id="set-phone" class="form-input" value="${user.phone}" />
            </div>

            <div class="form-group">
              <label class="form-label">Blood Group</label>
              <select id="set-blood" class="form-select">
                <option value="O+" ${user.bloodGroup === 'O+' ? 'selected' : ''}>O positive (O+)</option>
                <option value="O-" ${user.bloodGroup === 'O-' ? 'selected' : ''}>O negative (O-)</option>
                <option value="A+" ${user.bloodGroup === 'A+' ? 'selected' : ''}>A positive (A+)</option>
                <option value="B+" ${user.bloodGroup === 'B+' ? 'selected' : ''}>B positive (B+)</option>
                <option value="AB+" ${user.bloodGroup === 'AB+' ? 'selected' : ''}>AB positive (AB+)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Medical History & Conditions</label>
            <textarea id="set-medical" class="form-textarea" rows="2">${user.medicalConditions}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Allergies</label>
            <input type="text" id="set-allergies" class="form-input" value="${user.allergies}" />
          </div>

          <div class="grid-2" style="margin-top:1.5rem;">
            <div class="form-group">
              <label class="form-label">Language Preference</label>
              <select class="form-select">
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="hi">Hindi</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Audio Siren Alerts</label>
              <select class="form-select">
                <option value="on">Enabled (Audible Siren on SOS)</option>
                <option value="off">Disabled (Mute)</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem; padding:0.8rem;">
            <i data-lucide="save"></i> Save Profile Settings
          </button>
        </form>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    user.name = document.getElementById('set-name').value;
    user.email = document.getElementById('set-email').value;
    user.phone = document.getElementById('set-phone').value;
    user.bloodGroup = document.getElementById('set-blood').value;
    user.medicalConditions = document.getElementById('set-medical').value;
    user.allergies = document.getElementById('set-allergies').value;

    apiService.saveState();
    apiService.addNotification({
      title: "Settings Saved",
      text: "Profile and medical details updated successfully.",
      type: "success"
    });
  });
}
