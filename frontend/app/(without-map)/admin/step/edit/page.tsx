"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import ConfirmationModal from "@/components/ConfirmationModal";

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

export default function StepEditForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState("");

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  useEffect(() => {
    if (!tripId) return;
    fetch(`http://localhost:8081/api/steps/trips/${tripId}/steps`)
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
    }
  }, [selectedStepId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStepId) return;
    setShowModal(true);
  };

  const confirmUpdate = async () => {
    if (!selectedStepId) return;

    const response = await fetch(
      `http://localhost:8081/api/steps/${selectedStepId}`,
      {
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
      }
    );

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
                {step.description} ({step.date})
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
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="input input-bordered w-full"
              placeholder="Latitude"
              required
            />
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="input input-bordered w-full"
              placeholder="Longitude"
              required
            />
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
