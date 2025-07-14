"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import ConfirmationModal from "@/components/ConfirmationModal";
import { API_BASE_URL } from "@/lib/config";

interface Trip {
  id: number;
  country: string;
}

interface Step {
  id: number;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  tripId: number;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function StepEditForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(API_BASE_URL + "/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  useEffect(() => {
    if (!tripId) return;
    fetch(API_BASE_URL + `/steps/trips/${tripId}/steps`)
      .then((res) => res.json())
      .then(setSteps);
    setSelectedStepId(null);
  }, [tripId]);

  useEffect(() => {
    const step = steps.find((s) => s.id === selectedStepId);
    if (step) {
      setDescription(step.description);
      setLatitude(step.latitude);
      setLongitude(step.longitude);
      setDate(step.date);
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${step.latitude}&lon=${step.longitude}&format=json`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name || "");
        });
    }
  }, [selectedStepId]);

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
    if (!selectedStepId) return;
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!selectedStepId) return;

    const response = await fetch(API_BASE_URL + `/steps/${selectedStepId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedStepId,
        description,
        latitude,
        longitude,
        date,
        tripId,
      }),
    });

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Étape modifiée avec succès !");
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la modification de l'étape.");
    }
    setNotifVisible(true);
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">Modifier une étape</h2>

        <select
          className="select select-bordered w-full"
          value={tripId ?? ""}
          onChange={(e) => setTripId(Number(e.target.value))}
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

        {tripId && (
          <select
            className="select select-bordered w-full"
            value={selectedStepId ?? ""}
            onChange={(e) => setSelectedStepId(Number(e.target.value))}
          >
            <option value="" disabled>
              Choisir une étape
            </option>
            {steps.map((step) => (
              <option key={step.id} value={step.id}>
                {step.description} -{" "}
                {new Date(step.date).toLocaleDateString("fr-FR")}
              </option>
            ))}
          </select>
        )}

        {selectedStepId && (
          <>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Description"
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
        message="Confirmez-vous la modification de cette étape ?"
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
