"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TripCreateForm() {
  const [country, setCountry] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8081/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, steps: [] }),
    });

    if (response.ok) {
      const proceed = window.confirm(
        "Voyage créé ! Souhaitez-vous ajouter une étape maintenant ?"
      );
      if (proceed) {
        router.push("/admin/step/create");
      } else {
        setCountry(""); // reset si on reste
      }
    } else {
      alert("Erreur lors de la création.");
    }
  };

  return (
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
  );
}
