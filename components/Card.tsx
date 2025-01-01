"use client";

import React, { useState, useEffect, useRef } from "react";

interface CardProps {
  id: string;
  x: number;
  y: number;
  content: string;
  author: { id: string; name: string };
  createdAt: string;
  currentUserId: string;
  categories: { id: string; name: string }[];
  initialCategoryId: string;
  onUpdate: (id: string, content: string, categoryId: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  x,
  y,
  content,
  author,
  currentUserId,
  categories,
  initialCategoryId,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(content);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [bgColor, setBgColor] = useState("");
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#F9A8D4", "#C4B5FD"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);

  const handleStop = (e: any, data: any) => {
    onUpdate(id, inputValue, selectedCategory, data.x, data.y);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(id, inputValue, selectedCategory, x, y);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
      <div
        className="absolute p-4 w-48 h-64 rounded-lg shadow-md flex flex-col justify-between"
        style={{ backgroundColor: bgColor }}
      >
        {isEditing ? (
          <>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full h-24 border-none bg-transparent focus:outline-none"
              placeholder="Ajoute ton idée ici..."
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 mt-2 border rounded"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button onClick={handleSave} className="bg-blue-500 text-white px-2 py-1 mt-2 rounded">
              Enregistrer
            </button>
          </>
        ) : (
          <div onClick={() => currentUserId === author.id && setIsEditing(true)}>
            <p className="text-gray-900">{content || "Ajoute ton idée ici..."}</p>
            <p className="text-sm text-gray-500 mt-2">
              Catégorie: {categories.find((cat) => cat.id === selectedCategory)?.name || "Aucune"}
            </p>
          </div>
        )}
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">Par: {author.name}</span>
          {currentUserId === author.id && (
            <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 text-xs rounded">
              Supprimer
            </button>
          )}
        </div>
      </div>
  );
};

export default Card;
