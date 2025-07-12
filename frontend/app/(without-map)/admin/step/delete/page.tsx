"use client";
import { useEffect, useState } from "react";

interface Step {
  id: number;
  description: string;
}

export default function StepDeleteForm() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8081/api/steps")
      .then((res) => res.json())
      .then(setSteps);
  }, []);

  const handleDelete = async () => {
    if (!selectedStepId) return;

    const confirm = window.confirm("Supprimer cette étape ?");
    if (!confirm) return;

    const res = await fetch(
      `http://localhost:8081/api/steps/${selectedStepId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      alert("Étape supprimée !");
      setSteps((prev) => prev.filter((s) => s.id !== selectedStepId));
      setSelectedStepId(null);
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Supprimer une étape</h2>

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

      <button
        onClick={handleDelete}
        className="btn btn-error"
        disabled={!selectedStepId}
      >
        Supprimer
      </button>
    </div>
  );
}
