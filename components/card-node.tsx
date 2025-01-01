import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";

interface CardNodeProps {
  id: string;
  data: {
    content: string;
    author: { id: string; name: string };
    categories: { id: string; name: string }[];
    categoryId: string;
    currentUserId: string;
    likes: number;
    reports: number;
    onUpdate: (id: string, content: string, categoryId: string) => void;
    onDelete: (id: string) => void;
    onLike: (id: string) => void;
    onReport: (id: string) => void;
  };

}

const CardNode: React.FC<CardNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(data.content);
  const [selectedCategory, setSelectedCategory] = useState(data.categoryId);
  const [bgColor, setBgColor] = useState<string>("");

  useEffect(() => {
    const colors = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#F9A8D4", "#C4B5FD"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);


  
  const handleSave = () => {
    data.onUpdate(id, inputValue, selectedCategory);
    setIsEditing(false);
  };

  const handleDelete = () => {
    data.onDelete(id);
  };

  const handleLike = () => {
    data.onLike(id);
  };

  const handleReport = () => {
    data.onReport(id);
  };

  return (
    <div
      className="p-4 w-64 h-auto rounded-lg shadow-md border border-gray-300"
      style={{ backgroundColor: bgColor }}
    >
      {isEditing ? (
        <>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-24 border p-2 rounded"
            placeholder="Ajoute ton idée ici..."
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 mt-2 border rounded"
          >
            <option value="">Sélectionner une catégorie</option>
            {data.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-900">{inputValue || "Pas de contenu..."}</p>
          <p className="text-sm text-gray-500 mt-2">
            Catégorie:{" "}
            {data.categories.find((cat) => cat.id === selectedCategory)?.name ||
              "Aucune"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Par: {data.author.name}
          </p>
          {data.currentUserId === data.author.id && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          )}
        </>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handleLike}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1"
        >
          👍 {data.likes}
        </button>
        <button
          onClick={handleReport}
          className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm flex items-center gap-1"
        >
          🚩 {data.reports}
        </button>
      </div>
    </div>
  );
};

export default CardNode;
