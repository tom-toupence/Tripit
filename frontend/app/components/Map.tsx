'use client';

import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { useRef, useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
};

const center = {
  lat: 14.0583,
  lng: 108.2772,
};

type Step = {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
};

export default function Map() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [pathCoordinates, setPathCoordinates] = useState<{ lat: number, lng: number }[]>([]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const animateToLocation = (step: Step) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const animationFrames = 60; // Number of animation frames
    const currentCenter = map.getCenter();
    const currentLat = currentCenter?.lat() ?? 0;
    const currentLng = currentCenter?.lng() ?? 0;

    const deltaLat = (step.latitude - currentLat) / animationFrames;
    const deltaLng = (step.longitude - currentLng) / animationFrames;
    map.setZoom(7);

    let frame = 0;

    // Smoothly pan to the new location
    const moveInterval = setInterval(() => {
      frame++;

      const nextLat = currentLat + deltaLat * frame;
      const nextLng = currentLng + deltaLng * frame;

      map.panTo({ lat: nextLat, lng: nextLng });

      if (frame >= animationFrames) {
        clearInterval(moveInterval);
      }
    }, 16); // ~60 FPS
  };

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const customEvent = e as CustomEvent;
      const step = customEvent.detail as Step;

      if (mapRef.current) {
        const marker = new google.maps.Marker({
          position: { lat: step.latitude, lng: step.longitude },
          map: mapRef.current,
          title: step.locationName,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<b>${step.locationName}</b>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapRef.current!, marker);
        });

        setMarkers([marker]);

        setPathCoordinates(prev => [...prev, { lat: step.latitude, lng: step.longitude }]);
    

        animateToLocation(step);
      } 
    };

    window.addEventListener('focusOnStep', handleFocus);

    return () => {
      window.removeEventListener('focusOnStep', handleFocus);
    };
  }, []);

  useEffect(() => {
    console.log('Markers updated:', markers);
  }, [markers]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        options={{
          gestureHandling: 'greedy',
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          rotateControl: false,
          scaleControl: false,
          disableDefaultUI: true,
          panControl: false,
          keyboardShortcuts: false,
        }}
      >
        {}
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            geodesic: true,
            clickable: false,
            draggable: false,
            editable: false,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 4,
              },
              offset: '0',
              repeat: '20px',
            }],
          }}
        />
        {}
      </GoogleMap>
    </LoadScript>
  );
}
