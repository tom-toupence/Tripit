'use client';

import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// Définir un type pour les voyages
type Trip = {
  id: number;
  name: string;
};

const trips: Trip[] = [
  { id: 1, name: 'Vietnam' },
  { id: 2, name: 'Corée' },
  { id: 3, name: 'Chine' },
  { id: 4, name: 'Japon' },
];

export default function TripBox() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  

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
                {selectedTrip ? selectedTrip.name : 'Sélectionner un pays'}
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
                            {trip.name}
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
}
