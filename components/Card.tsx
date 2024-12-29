"use client";

import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

interface CardProps {
  id: string;
  x: number;
  y: number;
  content: string;
  author: { id: string; name: string };
  createdAt: string;
  currentUserId: string;
  onUpdate: (id: string, content: string, categoryId: string, x: number, y: number) => void;
  placeholder?: string;
  categories: { id: string; name: string }[]; // Add categories as a prop
  initialCategoryId: string; // Add initial category ID
}

const Card: React.FC<CardProps> = ({
  id,
  x,
  y,
  content,
  author,
  currentUserId,
  onUpdate,
  placeholder = "Ajoute ton idée ici...",
  categories,
  initialCategoryId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(content);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [bgColor, setBgColor] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const nodeRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    const colors = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#F9A8D4", "#C4B5FD"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);

  const handleStop = (e: any, data: any) => {
    setHasChanges(true);
    onUpdate(id, inputValue, selectedCategory, data.x, data.y);
  };

  const handleBlur = () => {
    if (currentUserId !== author.id) return;
    setIsEditing(false);
    setHasChanges(true);
    onUpdate(id, inputValue, selectedCategory, x, y);
  };

  const handleSave = async () => {
    if (currentUserId !== author.id) return;

    try {
      const response = await fetch(`/api/cards/${id}`, { method: "GET" });

      if (response.ok) {
        await fetch(`/api/cards/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, content: inputValue, categoryId: selectedCategory, positionX: x, positionY: y }),
        });
      } else if (response.status === 404) {
        await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            content: inputValue,
            categoryId: selectedCategory,
            positionX: x,
            positionY: y,
            authorId: author.id,
          }),
        });
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x, y }}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className={`absolute p-4 w-48 h-64 rounded-lg shadow-md flex flex-col justify-between cursor-pointer`}
        style={{ backgroundColor: bgColor }}
      >
        {isEditing && currentUserId === author.id ? (
          <>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              onBlur={handleBlur}
              autoFocus
              className="w-full h-24 border-none bg-transparent focus:outline-none text-black"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1 mt-2 border rounded text-sm"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div
            onClick={() =>
              currentUserId === author.id ? setIsEditing(true) : null
            }
            className="flex-grow"
          >
            <p className="text-gray-900">{inputValue || placeholder}</p>
            <p className="text-sm text-gray-500 mt-2">
              Catégorie: {categories.find((cat) => cat.id === selectedCategory)?.name || "Aucune"}
            </p>
          </div>
        )}

        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm text-gray-600">Par: {author.name}</span>
          {currentUserId === author.id && hasChanges && (
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
            >
              Enregistrer
            </button>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Card;
