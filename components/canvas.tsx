"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "reactflow";

import { useSession } from "next-auth/react";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { AuthButton } from "./auth/auth-button";
import CardNode from "./card-node";
import FloatingActionButton from "./ui/floating-action-button";

interface CardData {
  content: string;
  author: { id: string; name: string };
  categories: Category[];
  categoryId: string;
  countryId: string;
  currentUserId: string;
  likes: number;
  reports: number;
  onUpdate: (id: string, content: string, categoryId: string) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onReport: (id: string) => void;
}

interface Category {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

interface Thinker {
  id: string;
  name: string;
  cardCount: number;
}

interface CountryStats {
  id: string;
  name: string;
  cardCount: number;
}

type CardNode = Node<CardData>;

const nodeTypes = {
  card: CardNode,
};

const Canvas = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name;

  const [allNodes, setAllNodes] = useState<CardNode[]>([]);
  const [nodes, setNodes] = useState<CardNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [onlineVisitors, setOnlineVisitors] = useState(0);
  const [topThinkers, setTopThinkers] = useState<Thinker[]>([]);
  const [topCountries, setTopCountries] = useState<CountryStats[]>([]);
  const [statsVisible, setStatsVisible] = useState(true);

  const handleLikeCard = useCallback(
    async (id: string) => {
      if (!session?.user) {
        toast.error("Veuillez vous connecter pour aimer une idée");
        return;
      }

      try {
        await fetch(`/api/cards/${id}/like`, { method: "POST" });
        setAllNodes((prev) =>
          prev.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    likes: node.data.likes + 1,
                  },
                }
              : node
          )
        );
        toast.success("Merci pour votre like!");
      } catch (error) {
        console.error("Failed to like card:", error);
        toast.error("Erreur lors du like");
      }
    },
    [session]
  );

  const handleReportCard = useCallback(
    async (id: string) => {
      if (!session?.user) {
        toast.error("Veuillez vous connecter pour signaler une idée");
        return;
      }

      try {
        await fetch(`/api/cards/${id}/report`, { method: "POST" });
        setAllNodes((prev) =>
          prev.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    reports: node.data.reports + 1,
                  },
                }
              : node
          )
        );
        toast.success("Merci pour votre signalement");
      } catch (error) {
        console.error("Failed to report card:", error);
        toast.error("Erreur lors du signalement");
      }
    },
    [session]
  );

  const handleUpdateNode = useCallback(
    async (id: string, content: string, categoryId: string) => {
      if (!session?.user) {
        toast.error("Veuillez vous connecter pour modifier une idée");
        return;
      }

      try {
        await fetch(`/api/cards/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, categoryId }),
        });

        setAllNodes((prev) =>
          prev.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    content,
                    categoryId,
                  },
                }
              : node
          )
        );
        toast.success("Idée mise à jour avec succès!");
      } catch (error) {
        console.error("Failed to update card:", error);
        toast.error("Erreur lors de la mise à jour");
      }
    },
    [session]
  );

  const handleDeleteNode = useCallback(
    async (id: string) => {
      if (!session?.user) {
        toast.error("Veuillez vous connecter pour supprimer une idée");
        return;
      }

      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette idée?")) {
        return;
      }

      try {
        await fetch(`/api/cards/${id}`, { method: "DELETE" });
        setAllNodes((prev) => prev.filter((node) => node.id !== id));
        toast.success("Idée supprimée avec succès!");
      } catch (error) {
        console.error("Failed to delete card:", error);
        toast.error("Erreur lors de la suppression");
      }
    },
    [session]
  );

  const handleCreateCard = useCallback(() => {
    if (!session?.user?.id || !session?.user?.name) {
      toast.error("Veuillez vous connecter pour créer une idée");
      return;
    }

    setIsCreating(true);
    const newPosition = {
      x: Math.random() * (window.innerWidth - 300) + 150,
      y: Math.random() * (window.innerHeight - 300) + 150,
    };

    const newNode: CardNode = {
      id: Date.now().toString(),
      type: "card",
      position: newPosition,
      data: {
        content: "",
        author: {
          id: session.user.id,
          name: session.user.name,
        },
        categories,
        categoryId: "",
        countryId: "",
        currentUserId: session.user.id,
        likes: 0,
        reports: 0,
        onUpdate: handleUpdateNode,
        onDelete: handleDeleteNode,
        onLike: handleLikeCard,
        onReport: handleReportCard,
      },
    };

    setAllNodes((prev) => [...prev, newNode]);
    setIsCreating(false);
    toast.success("Nouvelle idée créée! Commencez à écrire...");
  }, [session, categories, handleUpdateNode, handleDeleteNode, handleLikeCard, handleReportCard]);

  // Record visitor
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      }).catch((error) => console.error("Error recording visitor:", error));
    }
  }, [session]);

  // Fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoryRes, countryRes] = await Promise.all([fetch("/api/categories"), fetch("/api/countries")]);

        const fetchedCategories = await categoryRes.json();
        const fetchedCountries = await countryRes.json();

        setCategories(fetchedCategories);
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
        toast.error("Erreur lors du chargement des filtres");
      }
    };

    fetchFilters();
  }, []);

  // Filter nodes
  useEffect(() => {
    const filterNodes = () => {
      const filteredNodes = allNodes.filter((node) => {
        const matchesSearch = node.data.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || node.data.categoryId === selectedCategory;
        const matchesCountry = !selectedCountry || node.data.countryId === selectedCountry;

        return matchesSearch && matchesCategory && matchesCountry;
      });

      setNodes(filteredNodes);
    };

    filterNodes();
  }, [searchQuery, selectedCategory, selectedCountry, allNodes]);

  // Fetch initial cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/api/cards");
        const cards: any[] = await response.json();

        const initialNodes: CardNode[] = cards.map((card) => ({
          id: card.id,
          type: "card",
          position: { x: card.positionX || 100, y: card.positionY || 100 },
          data: {
            content: card.content,
            author: { id: card.creator.id, name: card.creator.name },
            categories: categories,
            categoryId: card.categoryId || "",
            countryId: card.countryId || "",
            currentUserId: session?.user?.id || "",
            likes: card.likes,
            reports: card.reports,
            onUpdate: handleUpdateNode,
            onDelete: handleDeleteNode,
            onLike: handleLikeCard,
            onReport: handleReportCard,
          },
        }));

        setAllNodes(initialNodes);
        setNodes(initialNodes);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
        toast.error("Erreur lors du chargement des idées");
      }
    };

    fetchCards();
  }, [categories, session?.user?.id, handleUpdateNode, handleDeleteNode, handleLikeCard, handleReportCard]);

  // Fetch statistics
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("/api/visitors");
        const data = await response.json();
        setOnlineVisitors(data.count);
      } catch (error) {
        console.error("Failed to fetch visitors:", error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        setTopThinkers(data.topThinkers);
        setTopCountries(data.topCountries);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchVisitors();
    fetchStatistics();

    const visitorsInterval = setInterval(fetchVisitors, 5000);
    const statsInterval = setInterval(fetchStatistics, 10000);

    return () => {
      clearInterval(visitorsInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-sm shadow-md z-10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">{onlineVisitors} penseurs en ligne</span>
          </div>
          {userName && <span className="text-sm font-medium text-gray-700">Bienvenue, {userName}!</span>}
        </div>

        <div className="flex items-center gap-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Rechercher une idée..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
            >
              <option value="">Tous les pays</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <AuthButton />
        </div>
      </div>

      {/* Collapsible Statistics Panel */}
      <div
        className={`absolute right-4 top-24 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg w-64 border border-gray-200 
                   transition-all duration-300 transform ${statsVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setStatsVisible(!statsVisible)}
          className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform duration-200 ${statsVisible ? "rotate-0" : "rotate-180"}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <h3 className="text-lg font-bold mb-4 text-center">Statistiques</h3>
        <div className="mb-6">
          <h4 className="text-md font-semibold text-blue-600">Top Penseurs</h4>
          <ul className="list-none mt-2 space-y-2">
            {topThinkers.map((thinker) => (
              <li
                key={thinker.id}
                className="flex justify-between items-center border-b pb-1 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>{thinker.name}</span>
                <span className="text-sm text-gray-500">{thinker.cardCount} idées</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold text-green-600">Top Pays Penseurs</h4>
          <ul className="list-none mt-2 space-y-2">
            {topCountries.map((country) => (
              <li
                key={country.id}
                className="flex justify-between items-center border-b pb-1 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>{country.name}</span>
                <span className="text-sm text-gray-500">{country.cardCount} idées</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleCreateCard} label="Ajouter une idée" />

      {/* Flow Chart */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Canvas;
