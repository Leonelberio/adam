"use client";

import React, { useState } from "react";

export default function SignupPopup({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", country: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, country } = formData;

    if (!name || !email || !password || !country) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur d'inscription.");
      }

      setError(null);
      alert("Inscription réussie ! Connectez-vous pour continuer.");
      onClose();
    } catch (err: any) {
      if (err.message.includes("User already exists")) {
        setError("Un compte avec cet email existe déjà.");
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4">S'inscrire</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded focus:outline-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded focus:outline-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded focus:outline-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block font-medium">Pays</label>
            <input
              type="text"
              id="country"
              name="country"
              className="w-full px-3 py-2 border rounded focus:outline-blue-500"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            S'inscrire
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Déjà inscrit ?{" "}
            <button
              onClick={onSwitch}
              className="text-blue-500 hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
