import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png?url';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png?url';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png?url';

export interface MapCgp {
  displayName: string;
  firmName: string;
  city: string;
  postalCode: string;
  departmentCode: string;
  departmentName: string;
  oriasNumber: string | null;
  slug: string;
  latitude: number;
  longitude: number;
}

const FRANCE_CENTER: L.LatLngTuple = [46.6, 2.5];
const FRANCE_DEFAULT_ZOOM = 6;
const SINGLE_MARKER_ZOOM = 12;

// L.Icon.Default._getIconUrl() prepends its own auto-detected imagePath in
// front of whatever url we give it, which breaks under bundlers. Building a
// plain L.icon() and assigning it per marker bypasses that auto-detection.
const markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPopupContent(cgp: MapCgp): string {
  const lines = [`<strong>${escapeHtml(cgp.displayName)}</strong>`];

  if (cgp.firmName) {
    lines.push(escapeHtml(cgp.firmName));
  }

  lines.push(escapeHtml(`${cgp.city} ${cgp.postalCode}`.trim()));

  if (cgp.departmentName) {
    lines.push(escapeHtml(`${cgp.departmentName} (${cgp.departmentCode})`));
  }

  if (cgp.oriasNumber) {
    lines.push(`ORIAS : ${escapeHtml(cgp.oriasNumber)}`);
    lines.push('<small>Informations à vérifier sur le registre officiel ORIAS.</small>');
  }

  lines.push(`<a href="/cgp/${encodeURIComponent(cgp.slug)}/">Voir la fiche</a>`);

  return lines.join('<br />');
}

export function initCgpMap(): void {
  const mapEl = document.getElementById('cgp-map');
  const dataEl = document.getElementById('cgp-map-data');
  if (!mapEl || !dataEl) return;

  const cgps: MapCgp[] = JSON.parse(dataEl.textContent ?? '[]');

  const map = L.map(mapEl, {
    center: FRANCE_CENTER,
    zoom: FRANCE_DEFAULT_ZOOM,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  if (cgps.length === 0) return;

  const markers = cgps.map((cgp) =>
    L.marker([cgp.latitude, cgp.longitude], { icon: markerIcon }).bindPopup(buildPopupContent(cgp)),
  );

  if (markers.length === 1) {
    markers[0].addTo(map);
    map.setView([cgps[0].latitude, cgps[0].longitude], SINGLE_MARKER_ZOOM);
    return;
  }

  const group = L.featureGroup(markers).addTo(map);
  map.fitBounds(group.getBounds(), { padding: [24, 24] });
}
