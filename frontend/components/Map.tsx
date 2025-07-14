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

const STATIC_PIN_URL   = '/assets/pins/static_pin_ellipse_red.svg';
const ANIMATED_PIN_URL = '/assets/pins/animated_pin_ellipse_red.svg';

// On agrandit à 36px de large, ce qui donne 48px de haut (64×0.75)
const PIN_PIXEL_WIDTH  = 36;
const PIN_PIXEL_HEIGHT = 48;
const VIEWBOX_WIDTH    = 48;
// L’ellipse de pied est centrée en (24,50) dans le SVG
const ELLIPSE_CX       = 24;
const ELLIPSE_CY       = 50;
// Calcul de l’échelle
const scale = PIN_PIXEL_WIDTH / VIEWBOX_WIDTH;

function staticPin(): google.maps.Icon {
    return {
        url: STATIC_PIN_URL,
        scaledSize: new window.google.maps.Size(
            PIN_PIXEL_WIDTH,
            PIN_PIXEL_HEIGHT
        ),
        anchor: new window.google.maps.Point(
            ELLIPSE_CX * scale,
            ELLIPSE_CY * scale
        ),
    };
}

function animatedPin(): google.maps.Icon {
    return {
        url: ANIMATED_PIN_URL,
        scaledSize: new window.google.maps.Size(
            PIN_PIXEL_WIDTH,
            PIN_PIXEL_HEIGHT
        ),
        anchor: new window.google.maps.Point(
            ELLIPSE_CX * scale,
            ELLIPSE_CY * scale
        ),
    };
}

export default function Map() {
    const mapRef = useRef<google.maps.Map|null>(null);
    // stocke tous les markers pour les passer en statique
    const markersRef = useRef<google.maps.Marker[]>([]);
    const [pathCoordinates, setPathCoordinates] = useState<{lat:number;lng:number}[]>([]);

    useEffect(() => {
        const clearMap = () => {
            markersRef.current.forEach(m => m.setMap(null));
            markersRef.current = [];
            setPathCoordinates([]);
        };
        window.addEventListener('showMarkers', clearMap);
        return () => {
            window.removeEventListener('showMarkers', clearMap);
        };
    }, []);

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const animateToLocation = (step: Step) => {
        if (!mapRef.current) return;
        const map = mapRef.current;
        const frames = 60;
        const start = map.getCenter()!;
        const startLat = start.lat();
        const startLng = start.lng();
        const dLat = (step.latitude - startLat) / frames;
        const dLng = (step.longitude - startLng) / frames;
        map.setZoom(7);

        let i = 0;
        const iv = window.setInterval(() => {
            i++;
            map.panTo({
                lat: startLat + dLat * i,
                lng: startLng + dLng * i,
            });
            if (i >= frames) window.clearInterval(iv);
        }, 16);
    };

    useEffect(() => {
        const handleFocus = (e: Event) => {
            const step = (e as CustomEvent).detail as Step;
            if (!mapRef.current) return;

            // 1) tous les anciens markers deviennent statiques
            markersRef.current.forEach(m => m.setIcon(staticPin()));

            // 2) on crée le nouveau marker animé
            const animated = new window.google.maps.Marker({
                position: { lat: step.latitude, lng: step.longitude },
                map: mapRef.current,
                title: step.locationName,
                icon: animatedPin(),
                zIndex: 999,
            });
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<b>${step.locationName}</b>`,
            });
            animated.addListener('click', () => {
                infoWindow.open(mapRef.current!, animated);
            });

            // on stocke pour les prochaines itérations
            markersRef.current.push(animated);

            // 3) on étend la polyline
            setPathCoordinates(prev => [
                ...prev,
                { lat: step.latitude, lng: step.longitude },
            ]);

            animateToLocation(step);
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
                zoom={6}
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
                        strictBounds: true,
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
