/**
 * SERCN Leaflet Map Controller
 * Renders GIS maps with color-coded custom markers, popups, and route polylines.
 */

/* global L */

class MapManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.polylines = [];
  }

  initMap(containerId, center = [40.7180, -74.0020], zoom = 13) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Destroy existing map instance if container was reused
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map(containerId, {
      zoomControl: true,
      attributionControl: false
    }).setView(center, zoom);

    // Dark styled OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    return this.map;
  }

  renderEmergencyEcosystem(db, filterType = "ALL") {
    if (!this.map) return;

    // Clear existing markers & polylines
    this.clearLayers();

    // 1. Render Emergencies (Red Pulse Pins)
    if (filterType === "ALL" || filterType === "EMERGENCY") {
      db.emergencies.forEach(emg => {
        if (emg.status !== "RESOLVED") {
          const icon = L.divIcon({
            className: 'custom-map-icon emergency',
            html: `<i data-lucide="alert-circle" style="width:16px;height:16px;"></i>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([emg.lat, emg.lng], { icon })
            .bindPopup(`
              <div style="font-family: sans-serif; padding: 4px;">
                <div style="font-weight: 800; color: #FF5252; font-size: 1rem;">🚨 ${emg.type}</div>
                <div style="font-size: 0.8rem; margin-top: 4px;"><strong>Location:</strong> ${emg.address}</div>
                <div style="font-size: 0.8rem;"><strong>Severity:</strong> ${emg.severity}/10</div>
                <div style="font-size: 0.8rem;"><strong>Status:</strong> ${emg.status}</div>
                <div style="font-size: 0.8rem;"><strong>ETA:</strong> ${emg.etaMinutes} mins</div>
              </div>
            `);

          marker.addTo(this.map);
          this.markers.push(marker);
        }
      });
    }

    // 2. Render Vehicles (Ambulances, Police, Fire)
    db.vehicles.forEach(veh => {
      if (filterType === "ALL" || filterType.toLowerCase() === veh.type) {
        let className = `custom-map-icon ${veh.type}`;
        let iconName = "ambulance";
        if (veh.type === "police") iconName = "shield";
        if (veh.type === "fire") iconName = "flame";

        const icon = L.divIcon({
          className,
          html: `<i data-lucide="${iconName}" style="width:16px;height:16px;"></i>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([veh.lat, veh.lng], { icon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <div style="font-weight: 800; color: #FFF; font-size: 0.95rem;">${veh.callSign}</div>
              <div style="font-size: 0.8rem; margin-top: 4px;"><strong>Driver:</strong> ${veh.driver}</div>
              <div style="font-size: 0.8rem;"><strong>Status:</strong> <span style="color:#4CAF50;">${veh.status}</span></div>
            </div>
          `);

        marker.addTo(this.map);
        this.markers.push(marker);

        // Draw Route Polyline if assigned to active emergency
        if (veh.currentEmergencyId) {
          const emergency = db.emergencies.find(e => e.id === veh.currentEmergencyId);
          if (emergency) {
            let routeColor = "#4CAF50";
            if (veh.type === "police") routeColor = "#2196F3";
            if (veh.type === "fire") routeColor = "#FF9800";

            const line = L.polyline([
              [veh.lat, veh.lng],
              [emergency.lat, emergency.lng]
            ], {
              color: routeColor,
              weight: 4,
              opacity: 0.8,
              dashArray: '8, 8'
            }).addTo(this.map);

            this.polylines.push(line);
          }
        }
      }
    });

    // 3. Render Hospitals (Purple Markers)
    if (filterType === "ALL" || filterType === "HOSPITAL") {
      db.hospitals.forEach(hosp => {
        const icon = L.divIcon({
          className: 'custom-map-icon hospital',
          html: `<i data-lucide="hospital" style="width:16px;height:16px;"></i>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <div style="font-weight: 800; color: #9C27B0; font-size: 0.95rem;">🏥 ${hosp.name}</div>
              <div style="font-size: 0.8rem; margin-top: 4px;"><strong>Available Beds:</strong> ${hosp.availableBeds}/${hosp.totalBeds}</div>
              <div style="font-size: 0.8rem;"><strong>ICU Available:</strong> ${hosp.icuBedsAvailable}</div>
            </div>
          `);

        marker.addTo(this.map);
        this.markers.push(marker);
      });
    }

    // 4. Render Volunteers (Yellow Markers)
    if (filterType === "ALL" || filterType === "VOLUNTEER") {
      db.volunteers.forEach(vol => {
        const icon = L.divIcon({
          className: 'custom-map-icon volunteer',
          html: `<i data-lucide="user-check" style="width:14px;height:14px;"></i>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([vol.lat, vol.lng], { icon })
          .bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <div style="font-weight: 800; color: #FFC107; font-size: 0.9rem;">🟡 Volunteer: ${vol.name}</div>
              <div style="font-size: 0.8rem;">${vol.certifications.join(", ")}</div>
            </div>
          `);

        marker.addTo(this.map);
        this.markers.push(marker);
      });
    }

    // Re-initialize Lucide Icons for dynamic map HTML elements
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  clearLayers() {
    this.markers.forEach(m => this.map && this.map.removeLayer(m));
    this.polylines.forEach(p => this.map && this.map.removeLayer(p));
    this.markers = [];
    this.polylines = [];
  }
}

export const mapManager = new MapManager();
