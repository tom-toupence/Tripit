'use client';

import GoogleMapsProvider from './components/MapProvider';

export default function mapLayout({ children }: { children: React.ReactNode }) {
  return <GoogleMapsProvider>{children}</GoogleMapsProvider>;
}