"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import ConfirmationModal from "@/components/ConfirmationModal";
import {API_BASE_URL} from "@/lib/config";

interface Trip {
  id: number;
  country: string;
}

export default function TripEditForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [country, setCountry] = useState("");

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/trips`)
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  useEffect(() => {
    const trip = trips.find((t) => t.id === selectedTripId);
    if (trip) {
      setCountry(trip.country);
    }
  }, [selectedTripId, trips]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;

    const exists = trips.some(
      (t) =>
        t.id !== selectedTripId &&
        t.country.trim().toLowerCase() === country.trim().toLowerCase()
    );

    if (exists) {
      setNotifType("error");
      setNotifMsg("Ce pays existe déjà parmi les voyages.");
      setNotifVisible(true);
      return;
    }

    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!selectedTripId) return;

    const response = await fetch(
      `http://localhost:8081/api/trips/${selectedTripId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTripId, country }),
      }
    );

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Voyage modifié avec succès !");
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la modification du voyage.");
    }
    setNotifVisible(true);
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">Modifier un voyage</h2>

        <select
          className="select select-bordered w-full"
          value={selectedTripId ?? ""}
          onChange={(e) => setSelectedTripId(Number(e.target.value))}
        >
          <option value="" disabled>
            Choisir un voyage
          </option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.country}
            </option>
          ))}
        </select>

        {selectedTripId && (
          <>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input input-bordered w-full"
              required
            />

            <button type="submit" className="btn btn-warning">
              Modifier
            </button>
          </>
        )}
      </form>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={confirmUpdate}
        onCancel={() => setShowModal(false)}
        title="Confirmation"
        message="Voulez-vous vraiment modifier ce voyage ?"
      />

      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
        <NotificationToast
          message={notifMsg}
          type={notifType}
          isVisible={notifVisible}
          onClose={() => setNotifVisible(false)}
        />
      </div>
    </>
  );
}
