'use client';

import dynamic from 'next/dynamic';
import TripBox from './components/Tripbox';

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
}); 

export default function Home() {
  return (
    <main className="flex-1 h-full">
      <div className="relative w-full h-full flex-1">
        <TripBox />
        <Map />
      </div>
    </main>
  );
}

