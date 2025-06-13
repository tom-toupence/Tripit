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

type Step = {
    id: number;
    name: string;
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
        <div className="absolute right-4 z-20 w-56 text-sm select-none">
            <Listbox as="div" value={selectedTrip} onChange={setSelectedTrip}>
                {({ open }) => (
                    <div className="relative">
                        <Listbox.Button
                            className={clsx(
                                "w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-black/60 shadow-xl border-2 border-green-200",
                                "flex justify-between items-center font-semibold text-green-800 dark:text-green-300",
                                "transition-all duration-150 hover:shadow-2xl hover:border-green-700 focus:ring-2 focus:ring-green-700",
                                open && "ring-2 ring-green-700"
                            )}
                        >
              <span className={clsx(!selectedTrip && "italic text-gray-400 dark:text-gray-500")}>
                {selectedTrip ? selectedTrip.country : 'Sélectionner un pays'}
              </span>
                            <motion.span
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2"
                            >
                                <ChevronDownIcon className="w-5 h-5 text-green-500" />
                            </motion.span>
                        </Listbox.Button>

                        <AnimatePresence>
                            {open && (
                                <Listbox.Options static>
                                    <motion.ul
                                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                                        transition={{ duration: 0.17 }}
                                        className="absolute mt-2 w-full rounded-xl shadow-xl bg-white dark:bg-black/80 border border-green-200 ring-1 ring-black/5 z-50 max-h-72 overflow-auto"
                                    >
                                        {trips.length === 0 && (
                                            <li className="px-4 py-2 text-gray-400 italic">
                                                Aucun pays trouvé
                                            </li>
                                        )}
                                        {trips.map((trip) => (
                                            <Listbox.Option key={trip.id} value={trip}>
                                                {({ selected, active }) => (
                                                    <li
                                                        className={clsx(
                                                            "cursor-pointer px-4 py-2 flex items-center justify-between rounded-lg transition-colors",
                                                            active ? "bg-green-100 text-green-700" : "text-gray-800 dark:text-gray-100",
                                                            selected && "font-bold bg-green-50 dark:bg-green-900/30"
                                                        )}
                                                    >
                                                        <span>{trip.country}</span>
                                                        <AnimatePresence>
                                                            {selected && (
                                                                <motion.span
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    exit={{ scale: 0, opacity: 0 }}
                                                                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                                                                >
                                                                    <CheckIcon className="w-4 h-4 text-green-500 ml-2" />
                                                                </motion.span>
                                                            )}
                                                        </AnimatePresence>
                                                    </li>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </motion.ul>
                                </Listbox.Options>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </Listbox>
        </div>
    );

    function showMarkers(trip: Trip) {
        const event = new CustomEvent('showMarkers', { detail: trip });
        fetch(`http://localhost:8081/api/trips/${trip.id}`)
            .then(res => res.json())
            .then((data: { steps: Step[] }) => {
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