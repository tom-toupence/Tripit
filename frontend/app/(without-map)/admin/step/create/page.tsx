"use client";
import { useEffect, useState } from "react";
import NotificationToast from "@/components/NotificationToast";
import { API_BASE_URL } from "@/lib/config";
import { Input } from "@/components/ui/input"

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);


  useEffect(() => {
    fetch(API_BASE_URL + "/trips")
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
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

    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", String(latitude));
    formData.append("longitude", String(longitude));
    formData.append("date", date);
    formData.append("tripId", String(tripId));
    images.forEach((img) => formData.append("file", img)); // "file" correspond au backend

    const response = await fetch(API_BASE_URL + `/steps/${tripId}`, {
      method: "POST",
      body: formData,
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
                  onChange={handleImageChange}
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
