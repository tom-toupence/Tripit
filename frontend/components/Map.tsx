import { GoogleMap, Polyline } from '@react-google-maps/api';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';

const containerStyle = { width: '100%', height: '100%', display: 'flex' };
const center = { lat: 20, lng: 30 };
const initialZoom = 1;
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

function normalizeCoords(lat: number, lng: number) {
    if (lat > 90 || lat < -90) {
        return { lat: lng, lng: lat };
    }
    return { lat, lng };
}

function Map() {
    // ⚠️ Typage any sinon bug SSR/hydratation Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markersRef = useRef<any[]>([]);
    const [pathCoordinates, setPathCoordinates] = useState<{ lat: number; lng: number }[]>([]);
    const [googleLoaded, setGoogleLoaded] = useState(false);

    // Pas de typage google.maps ici !
    const mapOptions = useMemo(() => ({
        center,
        zoom: initialZoom,
        gestureHandling: 'greedy',
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
    }), []);

    // Icons: safe to call ONLY when googleLoaded === true
    const staticPin = useCallback(() => {
        if (!googleLoaded || !window.google?.maps) return undefined;
        return {
            url: STATIC_PIN_URL,
            scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
            anchor: new window.google.maps.Point(ELLIPSE_CX * scale, ELLIPSE_CY * scale),
        };
    }, [googleLoaded]);

    const animatedPin = useCallback(() => {
        if (!googleLoaded || !window.google?.maps) return undefined;
        return {
            url: ANIMATED_PIN_URL,
            scaledSize: new window.google.maps.Size(PIN_PIXEL_WIDTH, PIN_PIXEL_HEIGHT),
            anchor: new window.google.maps.Point(ELLIPSE_CX * scale, ELLIPSE_CY * scale),
        };
    }, [googleLoaded]);

    useEffect(() => {
        const clearMap = () => {
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
            setPathCoordinates([]);
        };
        window.addEventListener('showMarkers', clearMap);
        return () => window.removeEventListener('showMarkers', clearMap);
    }, []);

    // On ne typE PAS map en google.maps.Map ici, c'est fourni par @react-google-maps/api
    const onLoad = (map: any) => {
        mapRef.current = map;
        setGoogleLoaded(true);
    };

    useEffect(() => {
        if (!googleLoaded) return;

        const handleFocus = (e: Event) => {
            const step = (e as CustomEvent<Step>).detail;
            const map = mapRef.current;
            if (!map) return;

            const { lat, lng } = normalizeCoords(step.latitude, step.longitude);

            markersRef.current.forEach((m) => {
                const icon = staticPin();
                if (icon) m.setIcon(icon);
            });

            const icon = animatedPin();
            if (!icon) return;

            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map,
                title: step.locationName,
                icon: icon,
                zIndex: 999,
            });
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<b>${step.locationName}</b>`,
            });
            marker.addListener('click', () => infoWindow.open(map, marker));
            markersRef.current.push(marker);

            setPathCoordinates((prev) => [...prev, { lat, lng }]);

            if (markersRef.current.length === 1) {
                map.setZoom(focusZoom);
                map.setCenter({ lat, lng });
            } else {
                // Petite animation de pan
                const frames = 60;
                const start = map.getCenter()!;
                const startLat = start.lat();
                const startLng = start.lng();
                const dLat = (lat - startLat) / frames;
                const dLng = (lng - startLng) / frames;
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
        };

        window.addEventListener('focusOnStep', handleFocus);
        return () => {
            window.removeEventListener('focusOnStep', handleFocus);
            markersRef.current.forEach((m) => m.setMap(null));
            markersRef.current = [];
        };
    }, [googleLoaded, staticPin, animatedPin]);

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            options={mapOptions}
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
    );
}

export default Map;
