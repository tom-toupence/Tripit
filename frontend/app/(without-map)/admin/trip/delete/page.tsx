"use client";
import { useEffect, useState } from "react";

interface Trip {
  id: number;
  country: string;
}

export default function TripDeleteForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  const handleDelete = async () => {
    if (!selectedTripId) return;
    const confirm = window.confirm("Supprimer ce voyage ?");
    if (!confirm) return;

    const response = await fetch(
      `http://localhost:8081/api/trips/${selectedTripId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Voyage supprimé !");
      setTrips((prev) => prev.filter((t) => t.id !== selectedTripId));
      setSelectedTripId(null);
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Supprimer un voyage</h2>

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

      <button
        onClick={handleDelete}
        className="btn btn-error"
        disabled={!selectedTripId}
      >
        Supprimer
      </button>
    </div>
  );
}
