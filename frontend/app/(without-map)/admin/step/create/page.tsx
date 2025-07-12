"use client";
import { useEffect, useState } from "react";

interface Trip {
  id: number;
  country: string;
}

export default function StepCreateForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !date) return;

    const response = await fetch(`http://localhost:8081/api/steps/${tripId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, latitude, longitude, date, tripId }),
    });

    if (response.ok) alert("Étape créée !");
    else alert("Erreur lors de la création.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Créer une étape</h2>

      <select
        className="select select-bordered w-full"
        value={tripId ?? ""}
        onChange={(e) => setTripId(Number(e.target.value))}
        required
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

      <input
        type="text"
        placeholder="Description"
        className="input input-bordered w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Latitude"
        className="input input-bordered w-full"
        value={latitude}
        onChange={(e) => setLatitude(parseFloat(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Longitude"
        className="input input-bordered w-full"
        value={longitude}
        onChange={(e) => setLongitude(parseFloat(e.target.value))}
        required
      />
      <input
        type="date"
        className="input input-bordered w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-success">
        Créer
      </button>
    </form>
  );
}
