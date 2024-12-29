"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import africanCountries from "@/utils/africanCountries";
import { signIn, signOut } from "next-auth/react";

interface CardData {
  id: string;
  positionX: number;
  positionY: number;
  content: string;
  category: { id: string; name: string };
  author: { id: string; name: string; country: string };
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  country: string;
  cardsCount: number;
}

export default function Board() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      }).catch((error) => console.error("Error recording visitor:", error));
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count || 0))
      .catch((error) => console.error("Error fetching visitors count:", error));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    fetchCards();
    fetchCategories();
  }, [search, selectedCategory, selectedCountry]);

  const fetchCards = async () => {
    const query = new URLSearchParams({
      search,
      category: selectedCategory || "",
      country: selectedCountry || "",
    }).toString();

    try {
      const res = await fetch(`/api/cards?${query}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCard = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    const newCard: CardData = {
      id: String(Date.now()),
      positionX: window.innerWidth / 2 - 100,
      positionY: window.innerHeight / 2 - 50,
      content: "",
      category: { id: categories[0]?.id || "", name: categories[0]?.name || "" }, // Default to first category
      author: { id: user.id, name: user.name, country: user.country },
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [...prev, newCard]);

    fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    }).catch((error) => console.error("Error saving card:", error));
  };

  const handleLogin = async (email: string, password: string) => {
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoginOpen(false);
    } else {
      alert("Login failed. Please check your email and password.");
    }
  };

  const handleSignup = async (name: string, email: string, password: string, country: string) => {
    const newUser = { name, email, password, country };
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to sign up");

      const createdUser = await res.json();
      setUser(createdUser);
      localStorage.setItem("user", JSON.stringify(createdUser));
      setIsSignupOpen(false);
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  const closePopup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 w-full bg-slate-50 p-4 z-10">
        <div className="flex justify-between items-center">
          {/* Title and Visitor Count */}
          <div className="text-black flex flex-col items-start">
            <span className="text-2xl font-bold">Adam - le tableau géant de vos idées</span>
            <div className="text-sm flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
              </div>
              {visitorCount} penseurs en ligne
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher dans le contenu ou par nom..."
              className="px-3 py-2 border rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 border rounded"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Pays</option>
              {africanCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Login/Logout Button */}
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Se déconnecter
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="relative w-full h-full bg-dotted pt-20">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            x={card.positionX}
            y={card.positionY}
            content={card.content}
            category={card.category} // Pass category
            author={card.author}
            createdAt={card.createdAt}
            currentUserId={user?.id || ""}
            onUpdate={(id, content, categoryId, x, y) => {
              setCards((prevCards) =>
                prevCards.map((c) =>
                  c.id === id ? { ...c, content, category: { id: categoryId, name: categories.find(cat => cat.id === categoryId)?.name || "" }, positionX: x, positionY: y } : c
                )
              );
            }}
            categories={categories} // Pass available categories
          />
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={handleAddCard}
        className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <span className="text-2xl font-bold">+</span>
        <span>Ajoute ton idée</span>
      </button>
  


      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button onClick={closePopup} className="absolute top-2 right-2 text-gray-500">
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Se connecter</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                const password = (e.target as any).password.value;
                handleLogin(email, password);
              }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Se connecter
              </button>
            </form>
            <p className="mt-4 text-center">
              Pas de compte ?{" "}
              <button onClick={() => setIsSignupOpen(true)} className="text-blue-500 underline">
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      )}

      {isSignupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button onClick={closePopup} className="absolute top-2 right-2 text-gray-500">
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">S'inscrire</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const name = (e.target as any).name.value;
                const email = (e.target as any).email.value;
                const password = (e.target as any).password.value;
                const country = (e.target as any).country.value;
                handleSignup(name, email, password, country);
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block font-medium">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block font-medium">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="block font-medium">
                  Pays
                </label>
                <select
                  name="country"
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Sélectionnez un pays</option>
                  {africanCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                S'inscrire
              </button>
            </form>
            <p className="mt-4 text-center">
              Déjà un compte ?{" "}
              <button onClick={() => setIsLoginOpen(true)} className="text-blue-500 underline">
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}
    </div>



  );

  
}
