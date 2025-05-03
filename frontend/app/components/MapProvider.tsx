
'use client';

import { LoadScript } from "@react-google-maps/api";

export default function MapProvider({ children }: { children: React.ReactNode }) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {children}
    </LoadScript>
  );
}
