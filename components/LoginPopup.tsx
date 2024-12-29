"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";

export default function LoginPopup({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const res = await signIn("credentials", { ...formData, redirect: false });
    if (!res?.ok) {
      setError("Email ou mot de passe incorrect.");
    } else {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4">Se connecter</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Se connecter
          </button>
        </form>
        <div className="text-center mt-4">
          <p>
            Pas de compte ?{" "}
            <button
              onClick={onSwitch}
              className="text-blue-500 hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
