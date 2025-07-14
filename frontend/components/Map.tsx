'use client';

import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import { useRef, useEffect, useState } from 'react';

const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
};

// Vue initiale centrée sur (20,30) niveau monde
const center = { lat: 20, lng: 30 };
const initialZoom = 1;

// Niveau de zoom lorsque vous « focus » sur une étape
const focusZoom = 7;

type Step = {
    id: number;
    locationName: string;
    latitude: number;
    longitude: number;
};

const STATIC_PIN_URL   = '/assets/pins/static_pin_ellipse_red.svg';
const ANIMATED_PIN_URL = '/assets/pins/animated_pin_ellipse_red.svg';
const PIN_PIXEL_WIDTH  = 36;
const PIN_PIXEL_HEIGHT = 48;
const VIEWBOX_WIDTH    = 48;
const ELLIPSE_CX       = 24;
const ELLIPSE_CY       = 50;
const scale = PIN_PIXEL_WIDTH / VIEWBOX_WIDTH;

// Icônes
function staticPin(): google.maps.Icon {
    return {
        url: STATIC_PIN_URL,
        scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
        anchor: new window.google.maps.Point(ELLIPSE_CX * scale, ELLIPSE_CY * scale),
    };
}
function animatedPin(): google.maps.Icon {
    return {
        url: ANIMATED_PIN_URL,
        scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
        anchor: new window.google.maps.Point(ELLIPSE_CX * scale, ELLIPSE_CY * scale),
    };
}

// En cas de latitudes/lng hors bornes
function normalizeCoords(lat: number, lng: number) {
    if (lat > 90 || lat < -90) {
        return { lat: lng, lng: lat };
    }
    return { lat, lng };
}

// Animation de panoramique en plusieurs frames
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
        map.panTo({
            lat: startLat + dLat * i,
            lng: startLng + dLng * i,
        });
        if (i >= frames) window.clearInterval(iv);
    }, 16);
}

export default function Map() {
    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);

    // 1) Clear markers + polyline
    useEffect(() => {
        const clearMap = () => {
            markersRef.current.forEach(m => m.setMap(null));
            markersRef.current = [];
            setPathCoordinates([]);
        };
        window.addEventListener('showMarkers', clearMap);
        return () => window.removeEventListener('showMarkers', clearMap);
    }, []);

    // 2) Quand la carte se charge, on centre et zoom monde
    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;
        map.setCenter(center);
        map.setZoom(initialZoom);
    };

    // 3) À chaque focusOnStep : marker, polyline, puis pan animé ou téléport
    useEffect(() => {
        const handleFocus = (e: Event) => {
            const step = (e as CustomEvent<Step>).detail;
            const map = mapRef.current;
            if (!map) return;

            const { lat, lng } = normalizeCoords(step.latitude, step.longitude);

            // rendre anciens markers statiques
            markersRef.current.forEach(m => m.setIcon(staticPin()));

            // ajouter marker animé
            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                title: step.locationName,
                icon: animatedPin(),
                zIndex: 999,
            });
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<b>${step.locationName}</b>`,
            });
            marker.addListener('click', () => infoWindow.open(map, marker));
            markersRef.current.push(marker);

            // étendre la polyline
            setPathCoordinates(prev => [...prev, { lat, lng }]);

            // si c'est la première étape, on téléporte + zoom
            if (markersRef.current.length === 1) {
                map.setCenter({ lat, lng });
                map.setZoom(focusZoom);
            } else {
                // sinon, on anime le pan entre l'ancienne et la nouvelle position
                animateToLocation(map, { lat, lng });
            }
        };

        window.addEventListener('focusOnStep', handleFocus);
        return () => {
            window.removeEventListener('focusOnStep', handleFocus);
            markersRef.current.forEach(m => m.setMap(null));
            markersRef.current = [];
        };
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={initialZoom}
                onLoad={onLoad}
                options={{
                    gestureHandling: 'greedy',
                    disableDefaultUI: true,
                    minZoom: 3,
                    restriction: {
                        latLngBounds: {
                            north:  85,
                            south: -85,
                            west:  -169,
                            east:   190,
                        },
                        strictBounds: false,
                    },
                }}
            >
                <Polyline
                    path={pathCoordinates}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                    }}
                />
            </GoogleMap>
        </LoadScript>
    );
}
