"use client";

import React, { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(data.content);
  const [selectedCategory, setSelectedCategory] = useState(data.categoryId);
  const [bgColor, setBgColor] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const colors = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#F9A8D4", "#C4B5FD"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setBgColor(randomColor);
  }, []);

  useEffect(() => {
    setInputValue(data.content);
    setSelectedCategory(data.categoryId);
  }, [data.content, data.categoryId]);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      toast.error("Le contenu ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    try {
      await data.onUpdate(id, inputValue, selectedCategory);
      setIsEditing(false);
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setInputValue(data.content);
    setSelectedCategory(data.categoryId);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette idée ?")) {
      data.onDelete(id);
    }
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      await data.onLike(id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async () => {
    if (window.confirm("Voulez-vous vraiment signaler cette idée ?")) {
      setIsLoading(true);
      try {
        await data.onReport(id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`group relative p-4 w-64 rounded-lg shadow-md border border-gray-300 transition-all duration-300
                 ${isHovered ? "shadow-xl scale-102" : "shadow-md scale-100"}
                 ${isLoading ? "opacity-70 cursor-wait" : ""}
                 ${isEditing ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-24 border p-2 rounded bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            placeholder="Ajoute ton idée ici..."
            disabled={isLoading}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
            disabled={isLoading}
          >
            <option value="">Sélectionner une catégorie</option>
            {data.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200
                       ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="prose prose-sm">
            <p className="text-gray-900 whitespace-pre-wrap break-words">{inputValue || "Pas de contenu..."}</p>
            <p className="text-sm text-gray-500 mt-2">
              Catégorie: {data.categories.find((cat) => cat.id === selectedCategory)?.name || "Aucune"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Par: {data.author.name}</p>
          </div>

          {data.currentUserId === data.author.id && (
            <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors duration-200"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors duration-200"
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
          disabled={isLoading}
          className={`bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm 
                     flex items-center gap-1 transition-all duration-200
                     ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
        >
          👍 {data.likes}
        </button>
        <button
          onClick={handleReport}
          disabled={isLoading}
          className={`bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm 
                     flex items-center gap-1 transition-all duration-200
                     ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
        >
          🚩 {data.reports}
        </button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default CardNode;
