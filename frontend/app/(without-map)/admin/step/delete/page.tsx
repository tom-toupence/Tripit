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
}

export default function StepDeleteForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");

  const [showModal, setShowModal] = useState(false);

  // Charger les trips
  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  // Charger les steps du trip sélectionné
  useEffect(() => {
    if (!tripId) {
      setSteps([]);
      setSelectedStepId(null);
      return;
    }
    fetch(`http://localhost:8081/api/steps/trips/${tripId}/steps`)
      .then((res) => res.json())
      .then(setSteps);
  }, [tripId]);

  const confirmDelete = () => {
    if (!selectedStepId) return;
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedStepId) return;

    const res = await fetch(
      `http://localhost:8081/api/steps/${selectedStepId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setNotifType("success");
      setNotifMsg("Étape supprimée !");
      setSteps((prev) => prev.filter((s) => s.id !== selectedStepId));
      setSelectedStepId(null);
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la suppression.");
    }

    setNotifVisible(true);
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Supprimer une étape</h2>

      {/* Sélecteur de Trip */}
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

      {/* Sélecteur de Step */}
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
              {step.description}
            </option>
          ))}
        </select>
      )}

      {/* Bouton suppression */}
      {selectedStepId && (
        <button
          onClick={confirmDelete}
          className="btn btn-error"
          disabled={!selectedStepId}
        >
          Supprimer
        </button>
      )}

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        title="Confirmation"
        message="Supprimer cette étape ?"
      />

      {/* Toast de notification */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg">
        <NotificationToast
          message={notifMsg}
          type={notifType}
          isVisible={notifVisible}
          onClose={() => setNotifVisible(false)}
        />
      </div>
    </div>
  );
}
