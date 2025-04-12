'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import clsx from 'clsx';

const containerStyle = {
  width: '100%',
  height: '600px',
};

const center = {
  lat: 14.0583,  // Latitude approximative du Vietnam
  lng: 108.2772, // Longitude approximative du Vietnam
};

const people = [
  { id: 1, name: 'Vietnam' },
  { id: 2, name: 'Corée' },
  { id: 3, name: 'Chine' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
];

function TripBox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 w-72 z-50">
      <Listbox value={selectedPerson} onChange={setSelectedPerson}>
        <ListboxButton 
          className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedPerson.name}
          <span className="ml-2 text-gray-500">&#9660;</span>
        </ListboxButton>
        
        {/* Liste d'options avec transition fluide */}
        <ListboxOptions 
          className={clsx(
            "absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md z-50 overflow-hidden",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0", // Transition de la hauteur et de l'opacité
            "transition-all duration-300 ease-in-out"
          )}
        >
          {people.map((person) => (
            <ListboxOption key={person.id} value={person}>
              {({ focus, selected }) => (
                <div
                  className={clsx(
                    'flex items-center p-2 cursor-pointer',
                    focus && 'bg-blue-100',
                    selected && 'bg-blue-200'
                  )}
                >
                  <CheckIcon className={clsx('w-5 h-5 mr-2', !selected && 'invisible')} />
                  {person.name}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className="relative" style={{ width: '100%', height: '600px' }}>
          {/* Carte Google Maps */}
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={6}
            options={{
              gestureHandling: 'greedy',
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Tu peux ajouter d'autres éléments ou marqueurs ici */}
          </GoogleMap>

          {/* TripBox superposé */}
          <TripBox />
        </div>
      </LoadScript>
    </main>
  );
}
