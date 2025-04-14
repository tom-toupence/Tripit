'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
  };

const center = {
  lat: 14.0583,
  lng: 108.2772,
};



export default function Map() {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
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
            keyboardShortcuts: false,  }}
      >
        {/* Ajoute des marqueurs ici si besoin */}
      </GoogleMap>
    </LoadScript>
  );
}
