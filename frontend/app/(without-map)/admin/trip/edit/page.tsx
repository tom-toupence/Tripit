"use client";
import { useEffect, useState } from "react";

interface Trip {
  id: number;
  country: string;
}

export default function TripEditForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [country, setCountry] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  useEffect(() => {
    const trip = trips.find((t) => t.id === selectedTripId);
    if (trip) {
      setCountry(trip.country);
    }
  }, [selectedTripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;

    const response = await fetch(
      `http://localhost:8081/api/trips/${selectedTripId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTripId, country }),
      }
    );

    if (response.ok) alert("Voyage modifié !");
    else alert("Erreur lors de la modification.");
  };

  return (
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
  );
}
