"use client";
import { useEffect, useState } from "react";

interface Step {
  id: number;
  description: string;
  latitude: number;
  longitude: number;
  date: string;
  tripId: number;
}

export default function StepEditForm() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:8081/api/steps")
      .then((res) => res.json())
      .then(setSteps);
  }, []);

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
        }),
      }
    );

    if (response.ok) alert("Étape modifiée !");
    else alert("Erreur lors de la modification.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Modifier une étape</h2>

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

      {selectedStepId && (
        <>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            className="input input-bordered w-full"
            required
          />
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            className="input input-bordered w-full"
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
  );
}
