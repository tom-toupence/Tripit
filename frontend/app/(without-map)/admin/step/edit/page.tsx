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
  images: {
    id: number;
    filename: string;
    url?: string; // Optionnel : mets ici l'url Cloudflare R2/S3 si tu la stockes côté back
  }[];
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

  // Gestion des images
  const [existingImages, setExistingImages] = useState<Step["images"]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Notification et modal
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Load trips on mount
  useEffect(() => {
    fetch(API_BASE_URL + "/trips")
        .then((res) => res.json())
        .then(setTrips);
  }, []);

  // Load steps when tripId changes
  useEffect(() => {
    if (!tripId) return;
    fetch(API_BASE_URL + `/steps/trips/${tripId}/steps`)
        .then((res) => res.json())
        .then(setSteps);
    setSelectedStepId(null);
    setExistingImages([]);
    setImagesToRemove([]);
    setNewImages([]);
    setNewImagePreviews([]);
  }, [tripId]);

  // Load step data when selectedStepId changes
  useEffect(() => {
    const step = steps.find((s) => s.id === selectedStepId);
    if (step) {
      setDescription(step.description);
      setLatitude(step.latitude);
      setLongitude(step.longitude);
      setDate(step.date);
      setExistingImages(step.images ?? []);
      setImagesToRemove([]);
      setNewImages([]);
      setNewImagePreviews([]);
      fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${step.latitude}&lon=${step.longitude}&format=json`
      )
          .then((res) => res.json())
          .then((data) => setAddress(data.display_name || ""));
    }
  }, [selectedStepId, steps]);

  // Preview new images
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // Remove an existing image from the list
  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToRemove([...imagesToRemove, imageId]);
  };

  // Address suggestion search
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

  // Confirmation modal before update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStepId) return;
    setShowModal(true);
  };

  // Actually update the step
  const confirmUpdate = async () => {
    if (!selectedStepId) return;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("date", date);
    formData.append("tripId", String(tripId));

    // Existing images to keep (not removed)
    const existingImageIds = existingImages
        .filter((img) => !imagesToRemove.includes(img.id))
        .map((img) => img.id);

    existingImageIds.forEach((id) =>
        formData.append("existingImageIds", String(id))
    );

    // New images
    newImages.forEach((img) => formData.append("file", img));

    // Envoi PUT (multipart/form-data)
    const response = await fetch(API_BASE_URL + `/steps/${selectedStepId}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      setNotifType("success");
      setNotifMsg("Étape modifiée avec succès !");
      // Optionnel: reload steps/trip data
    } else {
      setNotifType("error");
      setNotifMsg("Erreur lors de la modification de l'étape.");
    }
    setNotifVisible(true);
    setShowModal(false);
  };

  return (
      <>
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-4">

          <h2 className="text-2xl font-bold mb-4 text-center">Modifier une étape</h2>

          {/* Sélecteur de voyage */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
            <label className="block mb-1 font-semibold">Voyage</label>
            <select
                className="input input-bordered w-full"
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
          </div>

          {/* Sélecteur d'étape */}
          {tripId && (
              <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                <label className="block mb-1 font-semibold">Étape</label>
                <select
                    className="input input-bordered w-full"
                    value={selectedStepId ?? ""}
                    onChange={(e) => setSelectedStepId(Number(e.target.value))}
                    required
                >
                  <option value="" disabled>
                    Choisir une étape
                  </option>
                  {steps.map((step) => (
                      <option key={step.id} value={step.id}>
                        {step.description} - {new Date(step.date).toLocaleDateString("fr-FR")}
                      </option>
                  ))}
                </select>
              </div>
          )}

          {/* Formulaire de modification */}
          {selectedStepId && (
              <>
                <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                  <label className="block mb-1 font-semibold">Description</label>
                  <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input input-bordered w-full"
                      placeholder="Description"
                      required
                  />
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                  <label className="block mb-1 font-semibold">Images existantes</label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {existingImages.filter(img => !imagesToRemove.includes(img.id)).length === 0 && (
                        <div className="italic text-gray-400">Aucune image</div>
                    )}
                    {existingImages.filter(img => !imagesToRemove.includes(img.id)).map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                              src={img.url || `/api/images/${img.id}`} // adapte selon ton backend pour l'URL
                              alt={img.filename}
                              className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                              onClick={() => handleRemoveExistingImage(img.id)}
                              title="Supprimer l'image"
                          >
                            ×
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                  <label className="block mb-1 font-semibold">Ajouter des images</label>
                  <input
                      id="newImages"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewImageChange}
                      className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newImagePreviews.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Aperçu nouveau ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                        />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                  <label className="block mb-1 font-semibold">Adresse</label>
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

                <div className="p-4 rounded-xl bg-white border border-gray-200 mb-4">
                  <label className="block mb-1 font-semibold">Date</label>
                  <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input input-bordered w-full"
                      required
                  />
                </div>

                <div className="flex justify-center">
                  <button type="submit" className="btn btn-warning w-40 rounded-xl text-lg font-semibold">
                    Modifier
                  </button>
                </div>
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
