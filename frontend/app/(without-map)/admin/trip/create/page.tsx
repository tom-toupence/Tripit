"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationToast from "@/components/NotificationToast";
import ConfirmationModal from "@/components/ConfirmationModal";
import { API_BASE_URL } from "@/lib/config";

interface Trip {
  id: number;
  country: string;
}

export default function TripCreateForm() {
  const [country, setCountry] = useState("");
  const [existingTrips, setExistingTrips] = useState<Trip[]>([]);
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(API_BASE_URL + "/trips")
      .then((res) => res.json())
      .then(setExistingTrips);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const exists = existingTrips.some(
      (t) => t.country.trim().toLowerCase() === country.trim().toLowerCase()
    );

    if (exists) {
      setNotifType("error");
      setNotifMsg(
        "Ce pays existe déjà. Veuillez entrer un autre nom de voyage."
      );
      setNotifVisible(true);
      return;
    }

    setShowModal(true);
  };

  const confirmCreate = async () => {
    const response = await fetch(API_BASE_URL + "/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, steps: [] }),
    });

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Voyage créé avec succès !");
      setNotifVisible(true);
      setShowStepModal(true);
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la création du voyage.");
      setNotifVisible(true);
    }

    setShowModal(false);
  };

  const confirmRedirect = () => {
    setShowStepModal(false);
    router.push("/admin/step/create");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">Créer un voyage</h2>

        <input
          type="text"
          placeholder="Pays"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="input input-bordered w-full"
          required
        />

        <button type="submit" className="btn btn-success">
          Créer
        </button>
      </form>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={confirmCreate}
        onCancel={() => setShowModal(false)}
        title="Confirmation"
        message="Voulez-vous vraiment créer ce voyage ?"
      />

      <ConfirmationModal
        isOpen={showStepModal}
        onConfirm={confirmRedirect}
        onCancel={() => {
          setCountry("");
          setShowStepModal(false);
        }}
        title="Ajout d'étape"
        message="Voyage créé ! Souhaitez-vous ajouter une étape maintenant ?"
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
