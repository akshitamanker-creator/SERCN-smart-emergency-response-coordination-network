/**
 * SERCN Header Component
 */

import { apiService } from '../apiService.js';
import { renderAuthModal } from '../auth.js';

export function renderHeader(onRoleChange) {
  const headerContainer = document.getElementById('main-header');
  if (!headerContainer) return;

  const currentRole = apiService.db.currentUser.role;
  const notifCount = apiService.db.notifications.length;

  headerContainer.innerHTML = `
    <div class="brand-container" id="brand-home-click">
      <div class="brand-logo">
        <i data-lucide="shield-alert" style="width:24px;height:24px;"></i>
      </div>
      <div>
        <div class="brand-title">SERCN</div>
        <div class="brand-subtitle">Smart Emergency Response</div>
      </div>
    </div>

    <div class="header-controls">
      <!-- Role Switcher Dropdown -->
      <div class="role-switcher-wrapper">
        <label for="global-role-select">Role:</label>
        <select id="global-role-select" class="role-select">
          <option value="citizen" ${currentRole === 'citizen' ? 'selected' : ''}>Citizen App</option>
          <option value="ai-dispatch" ${currentRole === 'ai-dispatch' ? 'selected' : ''}>AI Dispatch Engine</option>
          <option value="ambulance" ${currentRole === 'ambulance' ? 'selected' : ''}>Ambulance Driver</option>
          <option value="police" ${currentRole === 'police' ? 'selected' : ''}>Police Officer</option>
          <option value="fire" ${currentRole === 'fire' ? 'selected' : ''}>Fire Officer</option>
          <option value="hospital" ${currentRole === 'hospital' ? 'selected' : ''}>Hospital Staff</option>
          <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Control Room Admin</option>
          <option value="volunteer" ${currentRole === 'volunteer' ? 'selected' : ''}>Volunteer Responder</option>
          <option value="settings" ${currentRole === 'settings' ? 'selected' : ''}>Settings</option>
        </select>
      </div>

      <!-- Theme Toggle -->
      <button class="icon-btn" id="theme-toggle-btn" title="Toggle Light/Dark Theme">
        <i data-lucide="${document.documentElement.getAttribute('data-theme') === 'light' ? 'moon' : 'sun'}" style="width:18px;height:18px;"></i>
      </button>

      <!-- Notification Center Button -->
      <button class="icon-btn" id="notif-btn" title="Notifications">
        <i data-lucide="bell" style="width:18px;height:18px;"></i>
        ${notifCount > 0 ? `<span class="badge-counter">${notifCount}</span>` : ''}
      </button>

      <!-- User Profile Auth Button -->
      <div class="user-profile-badge" id="user-profile-trigger">
        <div class="avatar-circle">${apiService.db.currentUser.name.charAt(0)}</div>
        <span style="font-size:0.85rem; font-weight:600;" class="desktop-only">${apiService.db.currentUser.name}</span>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Role Switcher Event
  document.getElementById('global-role-select')?.addEventListener('change', (e) => {
    const newRole = e.target.value;
    apiService.setUserRole(newRole);
    if (onRoleChange) onRoleChange(newRole);
  });

  // Theme Toggle Event
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    renderHeader(onRoleChange);
  });

  // User Profile Click -> Open Auth Modal
  document.getElementById('user-profile-trigger')?.addEventListener('click', () => {
    renderAuthModal("login", () => {
      renderHeader(onRoleChange);
      if (onRoleChange) onRoleChange(apiService.db.currentUser.role);
    });
  });

  // Brand click -> Return to Citizen App
  document.getElementById('brand-home-click')?.addEventListener('click', () => {
    apiService.setUserRole('citizen');
    if (onRoleChange) onRoleChange('citizen');
  });
}
