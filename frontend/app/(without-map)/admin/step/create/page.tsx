'use client';
import { useEffect, useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import NotificationToast from "@/components/NotificationToast";
import { API_BASE_URL } from "@/lib/config";
import { Input } from "@/components/ui/input";

interface Trip {
  id: number;
  country: string;
}

export default function StepCreateForm() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripId, setTripId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [notifVisible, setNotifVisible] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMsg, setNotifMsg] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);

  // Google Autocomplete ref
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    fetch(API_BASE_URL + "/trips")
      .then((res) => res.json())
      .then(setTrips);
  }, []);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // ----- AUTOCOMPLETE GOOGLE -----
  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (
      place &&
      place.formatted_address &&
      place.geometry &&
      place.geometry.location
    ) {
      setAddress(place.formatted_address);
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !date || latitude === null || longitude === null) return;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("date", date);
    formData.append("tripId", String(tripId));
    images.forEach((img) => formData.append("file", img));

    console.log("Submitting step with data:", {
      description,
      latitude,
      longitude,
      date,
      tripId,
      images,
    });

    const response = await fetch(API_BASE_URL + `/steps/${tripId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
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
      setImages([]);
      setImagePreviews([]);
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

        {tripId && (
          <>
            <input
              type="text"
              placeholder="Description"
              className="input input-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid w-full max-w-sm items-center gap-3 ">
              <Input
                  id="picture"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageChange}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Aperçu ${idx + 1}`}
                        className="w-40 h-40 object-cover rounded border"
                    />
                ))}
              </div>
            </div>

            {/* Autocomplete Google */}
            <div className="mb-2">
              <label className="block mb-1 font-semibold">Adresse</label>
              <Autocomplete
                onLoad={autocomplete => (autocompleteRef.current = autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Adresse"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={addressLoading}
                  autoComplete="off"
                  required
                />
              </Autocomplete>
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
          </>
        )}
      </form>

      {notifVisible && (
        <div className="fixed bottom-30 left-1/2 transform -translate-x-1/2 z-50 ">
          <NotificationToast
            message={notifMsg}
            type={notifType}
            isVisible={notifVisible}
            onClose={() => setNotifVisible(false)}
          />
        </div>
      )}
    </>
  );
}
