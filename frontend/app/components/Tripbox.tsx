'use client';

import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';


type Trip = {
  id: number;
  country: string;
};



export default function TripBox() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);

  
  useEffect(() => {
    fetch('http://localhost:8081/api/trips')
      .then(res => res.json())
      .then((data: unknown) => {
        const tripsData = data as Trip[];
        const uniqueCountries: Trip[] = Array.from(
          new Map(tripsData.map((trip: Trip) => [trip.country, trip])).values()
        );
        setTrips(uniqueCountries);
      })
      .catch(err => console.error("Erreur lors du chargement des pays :", err));
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      showMarkers(selectedTrip);
    }
  }, [selectedTrip]);

  return (
    <div className="absolute top-4 left-4 z-10 w-48 text-sm">
      <Listbox as="div" value={selectedTrip} onChange={setSelectedTrip}>
        {({ open }) => (
          <>
           <Listbox.Button
            className="w-full px-4 py-2 bg-white border border-green-300 text-green-600 rounded-md shadow-sm flex justify-between items-center hover:shadow-md transition-all duration-150"
            >
            <span className={clsx(
                !selectedTrip && 'italic text-gray-400'
            )}>
                {selectedTrip ? selectedTrip.country : 'Sélectionner un pays'}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-green-500 ml-2" />
            </Listbox.Button>

            <AnimatePresence>
              {open && (
                <Listbox.Options static>
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50"
                  >
                    {trips.map((trip) => (
                      <Listbox.Option key={trip.id} value={trip}>
                        {({ selected, active }) => (
                          <li
                            className={clsx(
                              'cursor-pointer px-4 py-2 flex items-center justify-between transition-colors',
                              active ? 'bg-green-50 text-green-700' : 'text-gray-800',
                              selected && 'font-semibold'
                            )}
                          >
                            {trip.country}
                            {selected && (
                              <CheckIcon className="w-4 h-4 text-green-500" />
                            )}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </motion.ul>
                </Listbox.Options>
              )}
            </AnimatePresence>
          </>
        )}
      </Listbox>
    </div>
  );

  function showMarkers(trip: Trip) {
    const event = new CustomEvent('showMarkers', { detail: trip });
    const jsonStep = fetch(`http://localhost:8081/api/trips/${trip.id}`)
      .then(res => res.json())
      .then((data: any) => {
        const steps = data.steps;
        if (!steps || steps.length === 0) {
          console.warn("Aucune étape trouvée pour ce voyage.");
        }
        const firstStep = steps[0];
        const eventFocus = new CustomEvent('focusOnStep', { detail: firstStep });
        window.dispatchEvent(eventFocus);

        const eventSteps = new CustomEvent('setSteps', { detail: steps });
        window.dispatchEvent(eventSteps);

      })
      .catch(err => console.error("Erreur lors du chargement des étapes :", err));
    
    window.dispatchEvent(event);
  }
}
