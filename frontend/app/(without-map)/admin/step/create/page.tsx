"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";

interface Trip {
  id: number;
  country: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function StepCreateForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  const handleSearch = async (query: string) => {
    setAddress(query);
    if (query.length < 3) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=5`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    setAddress(s.display_name);
    setLatitude(parseFloat(s.lat));
    setLongitude(parseFloat(s.lon));
    setSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !date || latitude === null || longitude === null) return;

    const response = await fetch(`http://localhost:8081/api/steps/${tripId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        latitude,
        longitude,
        date,
        tripId,
      }),
    });

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Étape créée avec succès !");
      setNotifVisible(true);
      setDescription("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);
      setDate("");
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la création de l'étape.");
      setNotifVisible(true);
    }
  };

  return (
    <>
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

        <div>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Adresse"
            value={address}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="bg-white shadow rounded mt-2">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="p-2 cursor-pointer hover:bg-green-100"
                  onClick={() => handleSelectSuggestion(s)}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

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

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
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
