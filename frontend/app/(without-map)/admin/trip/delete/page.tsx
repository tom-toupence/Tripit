"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Trip {
  id: number;
  country: string;
}

export default function TripDeleteForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8081/api/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  const confirmDelete = () => {
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTripId) return;

    const response = await fetch(
      `http://localhost:8081/api/trips/${selectedTripId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Voyage supprimé avec succès !");
      setTrips((prev) => prev.filter((t) => t.id !== selectedTripId));
      setSelectedTripId(null);
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la suppression du voyage.");
    }
    setNotifVisible(true);
    setShowModal(false);
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
        onClick={confirmDelete}
        className="btn btn-error"
        disabled={!selectedTripId}
      >
        Supprimer
      </button>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        title="Confirmation"
        message="Voulez-vous vraiment supprimer ce voyage ?"
      />

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
