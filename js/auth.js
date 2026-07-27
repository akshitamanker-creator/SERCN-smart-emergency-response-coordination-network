/**
 * SERCN JWT Authentication & Session Manager
 */

import { apiService } from './apiService.js';

export function renderAuthModal(mode = "login", onComplete = () => {}) {
  const container = document.getElementById('auth-modal-container');
  if (!container) return;

  container.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-card">
        <button class="modal-close" id="close-auth-modal">✕</button>
        
        <div style="text-align:center; margin-bottom: 1.5rem;">
          <div style="width:50px; height:50px; background:linear-gradient(135deg, #E53935, #B71C1C); border-radius:12px; margin:0 auto 0.75rem auto; display:flex; align-items:center; justify-content:center; color:white;">
            <i data-lucide="shield-alert" style="width:28px;height:28px;"></i>
          </div>
          <h2 style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800;">
            ${mode === "login" ? "Emergency Portal Login" : mode === "register" ? "Create SERCN Account" : "Reset Password"}
          </h2>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
            Secure JWT Authenticated Emergency Access
          </p>
        </div>

        <form id="auth-form">
          ${mode === "register" ? `
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="auth-name" class="form-input" placeholder="e.g. Jane Doe" required value="Jane Doe" />
            </div>
          ` : ''}

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="user@sercn-net.org" required value="${apiService.db.currentUser.email}" />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="auth-password" class="form-input" placeholder="••••••••" required value="EmergencyPass123!" />
          </div>

          ${mode === "register" ? `
            <div class="form-group">
              <label class="form-label">Select System Role</label>
              <select id="auth-role" class="form-select">
                <option value="citizen">Citizen</option>
                <option value="ambulance">Ambulance Driver</option>
                <option value="police">Police Officer</option>
                <option value="fire">Fire Officer</option>
                <option value="hospital">Hospital Staff</option>
                <option value="admin">Control Room Admin</option>
                <option value="volunteer">Verified Volunteer</option>
              </select>
            </div>
          ` : ''}

          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem; padding:0.8rem;">
            <i data-lucide="key-round"></i> ${mode === "login" ? "Sign In with JWT" : mode === "register" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        <div style="margin-top:1.25rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
          ${mode === "login" ? `
            Don't have an account? <a href="#" id="switch-to-reg" style="color:#FF5252; font-weight:600;">Register Now</a>
            <br/><br/>
            <a href="#" id="switch-to-forgot" style="color:var(--text-muted); font-size:0.8rem;">Forgot Password?</a>
          ` : `
            Already registered? <a href="#" id="switch-to-login" style="color:#FF5252; font-weight:600;">Sign In</a>
          `}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Handlers
  document.getElementById('close-auth-modal')?.addEventListener('click', () => {
    container.innerHTML = '';
  });

  document.getElementById('switch-to-reg')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAuthModal("register", onComplete);
  });

  document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAuthModal("login", onComplete);
  });

  document.getElementById('switch-to-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAuthModal("forgot", onComplete);
  });

  document.getElementById('auth-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email')?.value;
    const name = document.getElementById('auth-name')?.value || "Jane Doe";
    const role = document.getElementById('auth-role')?.value || "citizen";

    // Mock JWT Auth update
    apiService.db.currentUser.email = email;
    apiService.db.currentUser.name = name;
    apiService.setUserRole(role);

    apiService.addNotification({
      title: "JWT Authentication Successful",
      text: `Logged in as ${name} (${role.toUpperCase()})`,
      type: "success"
    });

    container.innerHTML = '';
    onComplete();
  });
}
