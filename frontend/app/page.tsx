'use client';
import dynamic from 'next/dynamic';
import NavButton from '../components/NavButton';


const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
}); 

export default function Home() {
  return (
    <main className="flex-1 h-full">
      <div className="relative w-full h-full flex-1">
          <Map />
          <NavButton />
      </div>
    </main>
  );
}

