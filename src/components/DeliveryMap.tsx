import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { HiOutlineTruck, HiOutlineMapPin } from "react-icons/hi2";

const MapContainer = styled.div`
  width: 100%;
  height: 40rem;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  border: 2px solid var(--color-grey-200);
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;
`;

const MapControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  z-index: 1000;
`;

const ControlButton = styled.button`
  background-color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: var(--color-brand-600);
  }
`;

const StatusBar = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background-color: white;
  padding: 1.2rem 1.6rem;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.3rem;

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-brand-600);
  }

  & strong {
    color: var(--color-grey-700);
  }
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-green-700);

  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    background-color: var(--color-green-700);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

type Location = {
  lat: number;
  lng: number;
};

type DeliveryMapProps = {
  distributorLocation: Location;
  clientLocation: Location;
  distributorName: string;
  clientName: string;
};

function DeliveryMap({
  distributorLocation,
  clientLocation,
  distributorName,
  clientName,
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [distance, setDistance] = useState<string>("0 km");
  const [eta, setEta] = useState<string>("0 min");

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(linkElement);

    // Load Leaflet JS
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    scriptElement.async = true;

    scriptElement.onload = () => {
      const L = (window as any).L;

      // Initialize map centered between distributor and client
      const centerLat = (distributorLocation.lat + clientLocation.lat) / 2;
      const centerLng = (distributorLocation.lng + clientLocation.lng) / 2;

      const mapInstance = L.map(mapRef.current!).setView(
        [centerLat, centerLng],
        13
      );

      // Add OpenStreetMap tiles (FREE!)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Custom truck icon
      const truckIcon = L.divIcon({
        html: `
          <div style="
            background-color: #2563eb;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 20px;
          ">
            🚛
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Custom destination icon
      const destinationIcon = L.divIcon({
        html: `
          <div style="
            background-color: #dc2626;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 20px;
          ">
            📍
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Add distributor marker
      const distributorMarker = L.marker(
        [distributorLocation.lat, distributorLocation.lng],
        { icon: truckIcon }
      )
        .addTo(mapInstance)
        .bindPopup(
          `<strong>🚛 ${distributorName}</strong><br/>Current Location`
        );

      // Add client marker
      L.marker([clientLocation.lat, clientLocation.lng], {
        icon: destinationIcon,
      })
        .addTo(mapInstance)
        .bindPopup(`<strong>📍 ${clientName}</strong><br/>Destination`);

      // Draw route line
      const routeLine = L.polyline(
        [
          [distributorLocation.lat, distributorLocation.lng],
          [clientLocation.lat, clientLocation.lng],
        ],
        {
          color: "#2563eb",
          weight: 4,
          opacity: 0.7,
          dashArray: "10, 10",
        }
      ).addTo(mapInstance);

      // Fit map to show both markers
      const bounds = L.latLngBounds([
        [distributorLocation.lat, distributorLocation.lng],
        [clientLocation.lat, clientLocation.lng],
      ]);
      mapInstance.fitBounds(bounds, { padding: [50, 50] });

      // Calculate and display distance
      const dist = calculateDistance(distributorLocation, clientLocation);
      setDistance(`${dist.toFixed(1)} km`);
      setEta(`${Math.ceil(dist * 2)} min`); // Rough estimate: 2 min per km

      // Simulate real-time movement (for demo)
      let step = 0;
      const totalSteps = 100;
      const updateInterval = setInterval(() => {
        step++;
        if (step > totalSteps) {
          clearInterval(updateInterval);
          return;
        }

        // Interpolate position
        const progress = step / totalSteps;
        const newLat =
          distributorLocation.lat +
          (clientLocation.lat - distributorLocation.lat) * progress;
        const newLng =
          distributorLocation.lng +
          (clientLocation.lng - distributorLocation.lng) * progress;

        // Update marker position
        distributorMarker.setLatLng([newLat, newLng]);

        // Update route line
        routeLine.setLatLngs([
          [newLat, newLng],
          [clientLocation.lat, clientLocation.lng],
        ]);

        // Update distance and ETA
        const remainingDist = calculateDistance(
          { lat: newLat, lng: newLng },
          clientLocation
        );
        setDistance(`${remainingDist.toFixed(1)} km`);
        setEta(`${Math.ceil(remainingDist * 2)} min`);
      }, 1000); // Update every second

      setMap(mapInstance);

      // Cleanup
      return () => {
        clearInterval(updateInterval);
        mapInstance.remove();
      };
    };

    document.head.appendChild(scriptElement);

    return () => {
      document.head.removeChild(linkElement);
      document.head.removeChild(scriptElement);
    };
  }, [distributorLocation, clientLocation, distributorName, clientName]);

  const centerMap = () => {
    if (!map) return;
    const L = (window as any).L;
    const bounds = L.latLngBounds([
      [distributorLocation.lat, distributorLocation.lng],
      [clientLocation.lat, clientLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <MapContainer>
      <MapElement ref={mapRef} />

      <MapControls>
        <ControlButton onClick={centerMap} title="Center map">
          <HiOutlineMapPin />
        </ControlButton>
      </MapControls>

      <StatusBar>
        <StatusItem>
          <HiOutlineTruck />
          <div>
            <strong>Distance:</strong> {distance}
          </div>
        </StatusItem>
        <StatusItem>
          <div>
            <strong>ETA:</strong> {eta}
          </div>
        </StatusItem>
        <LiveIndicator>LIVE</LiveIndicator>
      </StatusBar>
    </MapContainer>
  );
}

export default DeliveryMap;
