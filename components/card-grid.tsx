"use client";

import { useEffect, useState } from "react";
import Card from "@/components/card";

export default function CardGrid() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => setCards(data));
  }, []);

  return (
    <div className="grid">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
