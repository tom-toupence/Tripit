"use client";

import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import StepCarousel from "./PinBanner";
import { AnimatePresence, motion } from "framer-motion";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 20, lng: 30 };
const initialZoom = 1;
const focusZoom = 7;

// Pin URLs and dimensions
const STATIC_PIN_URL = "/assets/pins/static_pin_ellipse_red.svg";
const ANIMATED_PIN_URL = "/assets/pins/animated_pin_ellipse_red.svg";
const PIN_PIXEL_WIDTH = 36;
const PIN_PIXEL_HEIGHT = 48;
const VIEWBOX_WIDTH = 48;
const ELLIPSE_CX = 24;
const ELLIPSE_CY = 50;
const scale = PIN_PIXEL_WIDTH / VIEWBOX_WIDTH;

function staticPin(): google.maps.Icon {
  return {
    url: STATIC_PIN_URL,
    scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
    anchor: new window.google.maps.Point(
      ELLIPSE_CX * scale,
      ELLIPSE_CY * scale
    ),
  };
}

function animatedPin(): google.maps.Icon {
  return {
    url: ANIMATED_PIN_URL,
    scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
    anchor: new window.google.maps.Point(
      ELLIPSE_CX * scale,
      ELLIPSE_CY * scale
    ),
  };
}

function normalizeCoords(lat: number, lng: number) {
  return lat > 90 || lat < -90 ? { lat: lng, lng: lat } : { lat, lng };
}

function animateToLocation(
  map: google.maps.Map,
  target: { lat: number; lng: number }
) {
  const frames = 60;
  const start = map.getCenter()!;
  const startLat = start.lat();
  const startLng = start.lng();
  const dLat = (target.lat - startLat) / frames;
  const dLng = (target.lng - startLng) / frames;

  map.setZoom(focusZoom);
  let i = 0;
  const iv = window.setInterval(() => {
    i++;
    map.panTo({ lat: startLat + dLat * i, lng: startLng + dLng * i });
    if (i >= frames) window.clearInterval(iv);
  }, 16);
}

type Step = {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
  date: string;
  description: string;
  photos: { url: string; description: string }[];
  adresse?: string;
};

export default function Map() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [pathCoordinates, setPathCoordinates] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [tripName, setTripName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset map and get country
  useEffect(() => {
    const clearMap = (e: Event) => {
      const detail = (e as CustomEvent<{ id: number; country: string }>).detail;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      setPathCoordinates([]);
      setSelectedStep(null);
      setTripName(detail.country);
      setIsModalOpen(false);
    };
    window.addEventListener("showMarkers", clearMap);
    return () => window.removeEventListener("showMarkers", clearMap);
  }, []);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.setCenter(center);
    map.setZoom(initialZoom);

    // Listener click sur la carte pour fermer la bannière/modal
    google.maps.event.addListener(map, "click", () => {
      setSelectedStep(null);
      setIsModalOpen(false);
    });
  };

  // Au focus d'une étape, on crée le marker et on prépare le click listener
  useEffect(() => {
    const handleFocus = (e: Event) => {
      const detail = (e as CustomEvent<Partial<Step>>).detail;
      const map = mapRef.current;
      if (!map || !detail) return;

      const { lat, lng } = normalizeCoords(detail.latitude!, detail.longitude!);
      markersRef.current.forEach((m) => m.setIcon(staticPin()));

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: detail.locationName,
        icon: animatedPin(),
        zIndex: 999,
      });

      marker.addListener("click", async () => {
        // Reverse-geocoding via Nominatim
        let adresse = "";
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const json = await resp.json();
          adresse = json.display_name || "";
        } catch (err) {
          console.error("Erreur reverse-geocoding OSM :", err);
        }

        setSelectedStep({
          id: detail.id!,
          locationName: detail.locationName || "",
          latitude: lat,
          longitude: lng,
          date: detail.date || "",
          description: detail.description || "",
          photos: detail.photos || [],
          adresse,
        });
        setIsModalOpen(false); // Si tu cliques sur un nouveau marker, on ferme le modal éventuel
      });

      markersRef.current.push(marker);
      setPathCoordinates((prev) => [...prev, { lat, lng }]);

      if (markersRef.current.length === 1) {
        map.setCenter({ lat, lng });
        map.setZoom(focusZoom);
      } else {
        animateToLocation(map, { lat, lng });
      }
    };

    window.addEventListener("focusOnStep", handleFocus);
    return () => window.removeEventListener("focusOnStep", handleFocus);
  }, []);

  // Pour fermeture sur clic en dehors du modal (overlay modal)
  const handleClose = () => {
    setSelectedStep(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative h-full" ref={mapContainerRef}>
      <div className="h-full">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={initialZoom}
            onLoad={onLoad}
            options={{
              gestureHandling: "greedy",
              disableDefaultUI: true,
              minZoom: 3,
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  west: -169,
                  east: 190,
                },
                strictBounds: false,
              },
            }}
          >
            <Polyline
              path={pathCoordinates}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Banner & Modal transitions */}
      <AnimatePresence>
        {selectedStep && !isModalOpen && (
          <motion.div
            key="banner"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute bottom-0 left-0 w-4/5 p-4 bg-transparent pointer-events-none"
          >
            <div className="pointer-events-auto">
              <StepCarousel
                voyageName={tripName || "Mon Voyage"}
                stepName={selectedStep.locationName}
                date={selectedStep.date}
                adresse={selectedStep.adresse ?? ""}
                description={selectedStep.description}
                photos={selectedStep.photos}
                isModal={false}
                onLearnMore={() => setIsModalOpen(true)}
                onClose={handleClose}
              />
            </div>
          </motion.div>
        )}
        {selectedStep && isModalOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.78)" }} // Overlay blanc translucide
            onClick={handleClose}
          >
            {/* Contenu modal */}
            <div
              className="relative bg-white rounded-lg shadow-xl w-4/5 h-4/5 overflow-auto pointer-events-auto flex"
              onClick={(e) => e.stopPropagation()}
            >
              <StepCarousel
                voyageName={tripName || "Mon Voyage"}
                stepName={selectedStep.locationName}
                date={selectedStep.date}
                adresse={selectedStep.adresse ?? ""}
                description={selectedStep.description}
                photos={selectedStep.photos}
                isModal={true}
                onClose={handleClose}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
