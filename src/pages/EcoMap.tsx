import { useEffect, useRef, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Map as MapIcon, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';

interface Point {
  name: string;
  lat: number;
  lng: number;
  type: 'Drop Point' | 'Active Pickup Agent' | 'Recycling Center' | 'Past Pickup';
  badge: string;
  date?: string;
}

const points: Point[] = [
  { name: 'GreenDrop Andheri', lat: 19.1136, lng: 72.8697, type: 'Drop Point', badge: '🟢 Drop' },
  { name: 'EcoCollect Bandra', lat: 19.0596, lng: 72.8295, type: 'Active Pickup Agent', badge: '🟡 Agent' },
  { name: 'RecycleMart Dadar', lat: 19.0178, lng: 72.8478, type: 'Recycling Center', badge: '🟢 Center' },
  { name: 'CleanCity Kurla', lat: 19.0728, lng: 72.8826, type: 'Drop Point', badge: '🟢 Drop' },
  { name: 'GreenHub Powai', lat: 19.1197, lng: 72.9057, type: 'Recycling Center', badge: '🟢 Center' },
];

const past: Point[] = [
  { name: 'Your Pickup #PK-0042', lat: 19.0895, lng: 72.8656, type: 'Past Pickup', badge: '🔵 Past', date: 'Apr 13' },
  { name: 'Your Pickup #PK-0039', lat: 19.0612, lng: 72.8347, type: 'Past Pickup', badge: '🔵 Past', date: 'Mar 28' },
  { name: 'Your Pickup #PK-0035', lat: 19.1043, lng: 72.8912, type: 'Past Pickup', badge: '🔵 Past', date: 'Mar 10' },
];

const EcoMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import('leaflet');
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, { zoomControl: true }).setView([19.076, 72.877], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const greenIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#00e5a0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 4px 12px rgba(0,229,160,0.6);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;">♻</span></div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 28],
      });
      const yellowIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#f59e0b;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 4px 12px rgba(245,158,11,0.6);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;">🚚</span></div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 28],
      });
      const blueIcon = L.divIcon({
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#3b8beb;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 4px 12px rgba(59,139,235,0.6);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:13px;">⏱</span></div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 28],
      });

      points.forEach(p => {
        const icon = p.type === 'Active Pickup Agent' ? yellowIcon : greenIcon;
        const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
        const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        m.bindPopup(`
          <div style="min-width:180px;font-family:Inter,sans-serif;color:#fff;">
            <strong style="font-size:14px;color:#fff;">${p.name}</strong><br/>
            <span style="display:inline-block;margin-top:4px;font-size:10px;padding:2px 8px;border-radius:99px;background:rgba(0,229,160,0.15);color:#00e5a0;border:1px solid rgba(0,229,160,0.4);">${p.type}</span>
            <p style="margin:8px 0 6px;font-size:11px;color:#aaa;">📍 1.2 km away</p>
            <a href="${dirUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:6px 12px;background:#3b8beb;color:#fff;text-decoration:none;border-radius:8px;font-size:11px;font-weight:700;">Get Directions →</a>
          </div>
        `);
      });

      past.forEach(p => {
        const m = L.marker([p.lat, p.lng], { icon: blueIcon }).addTo(map);
        m.bindPopup(`<div style="font-family:Inter,sans-serif;color:#fff;"><strong>${p.name}</strong><br/><span style="font-size:11px;color:#aaa;">${p.date}</span></div>`);
      });

      mapRef.current = map;
      setLeaflet(L);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const findNearest = () => {
    if (!navigator.geolocation || !mapRef.current || !leaflet) {
      toast.error('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        mapRef.current.setView([lat, lng], 14);
        if (userMarkerRef.current) userMarkerRef.current.remove();
        const pulseIcon = leaflet.divIcon({
          html: `<div style="position:relative;width:20px;height:20px;"><div style="position:absolute;inset:0;border-radius:50%;background:#3b8beb;border:3px solid #fff;box-shadow:0 0 18px rgba(59,139,235,0.8);"></div><div style="position:absolute;inset:-12px;border-radius:50%;border:2px solid #3b8beb;animation:eco-pulse 1.6s ease-out infinite;"></div></div>`,
          className: '', iconSize: [20, 20], iconAnchor: [10, 10],
        });
        userMarkerRef.current = leaflet.marker([lat, lng], { icon: pulseIcon }).addTo(mapRef.current);
        toast.success('Nearest center: GreenDrop Andheri', { description: '0.8 km away' });
      },
      () => toast.error('Location permission denied'),
    );
  };

  return (
    <AppShell>
      <PageWrapper>
        <div className="mb-6">
          <p className="section-label flex items-center gap-2"><MapIcon className="w-3.5 h-3.5 text-eco-green" /> Eco Map</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">Live Recycling Network 🗺️</h1>
          <p className="text-muted-foreground-2 text-sm mt-1">Find drop points, active agents, and your past pickups around the city.</p>
        </div>

        <div className="relative glass-deep rounded-2xl overflow-hidden mb-4">
          <div ref={containerRef} style={{ width: '100%', height: 500 }} className="md:h-[500px] h-[350px]" />
          <Button onClick={findNearest} className="absolute bottom-4 left-4 z-[1000] btn-eco font-bold rounded-full px-4 h-11 shadow-xl">
            <Navigation className="w-4 h-4 mr-1.5" /> Find Nearest
          </Button>
        </div>

        <div className="glass-deep rounded-2xl p-4 flex flex-wrap gap-4 text-sm text-white">
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-eco-green inline-block" /> Drop Point / Recycling Center</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-eco-amber inline-block" /> Active Pickup Agent</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-eco-blue inline-block" /> Your Past Pickups</span>
        </div>

        <style>{`@keyframes eco-pulse{0%{transform:scale(0.6);opacity:1;}100%{transform:scale(2.4);opacity:0;}}.leaflet-popup-content-wrapper{background:#0d2118 !important;color:#fff !important;border:1px solid rgba(0,229,160,0.25) !important;border-radius:14px !important;}.leaflet-popup-tip{background:#0d2118 !important;}.leaflet-container{background:#050d0a !important;}`}</style>
      </PageWrapper>
    </AppShell>
  );
};

export default EcoMap;
