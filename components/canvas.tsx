import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
} from "reactflow";

import CardNode from "./card-node";
import "reactflow/dist/style.css";

const nodeTypes = {
  card: CardNode,
};

const Canvas = () => {
  const [allNodes, setAllNodes] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [onlineVisitors, setOnlineVisitors] = useState(0);
  const [topThinkers, setTopThinkers] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const user = { id: "userId" }; // Replace with actual logged-in user object

  useEffect(() => {
    if (user) {
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      }).catch((error) => console.error("Error recording visitor:", error));
    }
  }, [user]);


  // Fetch categories and countries for filters
useEffect(() => {
  const fetchFilters = async () => {
    try {
      const [categoryRes, countryRes] = await Promise.all([
        fetch("/api/categories"), // Replace with the actual endpoint for categories
        fetch("/api/countries"), // Replace with the actual endpoint for countries
      ]);

      const fetchedCategories = await categoryRes.json();
      const fetchedCountries = await countryRes.json();

      setCategories(fetchedCategories);
      setCountries(fetchedCountries);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  fetchFilters();
}, []);



  useEffect(() => {
    const filterNodes = () => {
      const filteredNodes = allNodes.filter((node) => {
        const matchesSearch = node.data.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          !selectedCategory || node.data.categoryId === selectedCategory;
        const matchesCountry =
          !selectedCountry || node.data.countryId === selectedCountry;
  
        return matchesSearch && matchesCategory && matchesCountry;
      });
  
      setNodes(filteredNodes);
    };
  
    filterNodes();
  }, [searchQuery, selectedCategory, selectedCountry, allNodes]);
  

  // Fetch initial cards (nodes) from the database
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/api/cards");
        const cards = await response.json();

        const initialNodes = cards.map((card) => ({
          id: card.id,
          type: "card",
          position: { x: card.positionX || 100, y: card.positionY || 100 },
          data: {
            content: card.content,
            author: { id: card.creator.id, name: card.creator.name },
            categories: categories || [],
            categoryId: card.categoryId || "",
            countryId: card.countryId || "",
            currentUserId: "currentUserId", // Replace with actual logged-in user ID
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
      }
    };

    fetchCards();
  }, [categories]);

  // Fetch online visitors
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("/api/visitors");
        const data = await response.json();
        setOnlineVisitors(data.count); // Assuming API returns { count: number }
      } catch (error) {
        console.error("Failed to fetch visitors:", error);
      }
    };

    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch top thinkers and countries
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        setTopThinkers(data.topThinkers); // Assuming API returns { topThinkers: [], topCountries: [] }
        setTopCountries(data.topCountries);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStatistics();
    const interval = setInterval(fetchStatistics, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLikeCard = async (id) => {
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
    } catch (error) {
      console.error("Failed to like card:", error);
    }
  };

  const handleReportCard = async (id) => {
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
    } catch (error) {
      console.error("Failed to report card:", error);
    }
  };

  const handleUpdateNode = async (id, content, categoryId) => {
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
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };

  const handleDeleteNode = async (id) => {
    try {
      await fetch(`/api/cards/${id}`, { method: "DELETE" });
      setAllNodes((prev) => prev.filter((node) => node.id !== id));
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-screen">
      {/* Floating Visitors Count */}
      <div className="absolute top-4 left-4 p-2 rounded flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-blink"></div>
        <span>{onlineVisitors} penseurs en ligne</span>
      </div>

      {/* Top Thinkers and Countries */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg w-64 border border-gray-300">
    <h3 className="text-lg font-bold mb-4 text-center">Statistiques</h3>
    <div className="mb-6">
      <h4 className="text-md font-semibold text-blue-600">Top Penseurs</h4>
      <ul className="list-none mt-2 space-y-2">
        {topThinkers.map((thinker) => (
          <li
            key={thinker.id}
            className="flex justify-between items-center border-b pb-1"
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
            className="flex justify-between items-center border-b pb-1"
          >
            <span>{country.name}</span>
            <span className="text-sm text-gray-500">{country.cardCount} idées</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
      {/* Floating Search Bar */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg flex gap-4 items-center z-10 p-8 border-s-gray-400">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Canvas;