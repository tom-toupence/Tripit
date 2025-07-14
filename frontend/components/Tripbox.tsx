'use client';

import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { API_BASE_URL } from "@/lib/config";

type Trip = {
  id: number;
  country: string;
};

type Step = {
  id?: number;
  date: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function TripBox() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // 1) Charger la liste des trips au montage
  useEffect(() => {
    fetch(`${API_BASE_URL}/trips`)
        .then((res) => res.json())
        .then((data: Trip[]) => {
          // supprimer les doublons de country
          const unique = Array.from(
              new Map(data.map((t) => [t.country, t])).values()
          );
          setTrips(unique);
        })
        .catch((err) => console.error("Erreur chargement trips :", err));
  }, []);

  // 2) À chaque changement de selectedTrip, on déclenche showMarkers + setSteps/focusOnStep
  useEffect(() => {
    if (!selectedTrip) return;

    // demande d'effacement + rechargement sur Map.tsx
    window.dispatchEvent(
        new CustomEvent("showMarkers", { detail: selectedTrip })
    );

    // on récupère les étapes et on les dispatch
    fetch(`${API_BASE_URL}/trips/${selectedTrip.id}`)
        .then((res) => res.json())
        .then((data: { steps: Step[] }) => {
          const steps = data.steps || [];
          if (steps.length > 0) {
            window.dispatchEvent(
                new CustomEvent("focusOnStep", { detail: steps[0] })
            );
            window.dispatchEvent(
                new CustomEvent("setSteps", { detail: steps })
            );
          }
        })
        .catch((err) => console.error("Erreur chargement étapes :", err));
  }, [selectedTrip]);

  return (
      <div className="absolute right-4 z-20 w-56 text-sm select-none">
        <Listbox value={selectedTrip} onChange={setSelectedTrip}>
          {({ open }) => (
              <div className="relative">
                {/* Bouton de sélection */}
                <Listbox.Button
                    className={clsx(
                        "w-full px-4 py-2.5 rounded-xl bg-white/90 dark:bg-black/60 shadow-xl border-2",
                        open
                            ? "border-green-700 ring-2 ring-green-700"
                            : "border-green-200 hover:shadow-2xl",
                        "flex justify-between items-center font-semibold text-green-800 dark:text-green-300 transition-all duration-150"
                    )}
                >
              <span
                  className={clsx(
                      !selectedTrip && "italic text-gray-400 dark:text-gray-500"
                  )}
              >
                {selectedTrip?.country ?? "Sélectionner un voyage"}
              </span>
                  <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="w-5 h-5 text-green-500" />
                  </motion.span>
                </Listbox.Button>

                {/* Liste déroulante */}
                <AnimatePresence>
                  {open && (
                      <Listbox.Options className="absolute mt-2 w-full">
                        <motion.ul
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.17 }}
                            className="rounded-xl shadow-xl bg-white dark:bg-black/80 border border-green-200 ring-1 ring-black/5 z-50 max-h-72 overflow-auto"
                        >
                          {trips.map((trip) => (
                              <Listbox.Option key={trip.id} value={trip}>
                                {({ selected, active }) => (
                                    <li
                                        className={clsx(
                                            "cursor-pointer px-4 py-2 flex items-center justify-between rounded-lg transition-colors",
                                            active
                                                ? "bg-green-100 text-green-700"
                                                : "text-gray-800 dark:text-gray-100",
                                            selected && "font-bold bg-green-50 dark:bg-green-900/30"
                                        )}
                                    >
                                      <span>{trip.country}</span>
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
}
