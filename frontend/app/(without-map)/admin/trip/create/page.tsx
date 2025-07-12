"use client";
import { useState } from "react";

export default function TripCreateForm() {
  const [country, setCountry] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8081/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, steps: [] }),
    });

    if (response.ok) alert("Voyage créé !");
    else alert("Erreur lors de la création.");
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
