"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CardForm({ creatorId, countryId }: { creatorId: string; countryId: string }) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleCreateCard = async () => {
    const res = await fetch("/api/cards/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, category, creatorId, countryId }),
    });

    if (!res.ok) {
      alert("Failed to create card");
    } else {
      alert("Card created successfully!");
      setContent("");
      setCategory("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateCard();
      }}
    >
      <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" />
      <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <Button type="submit">Create Card</Button>
    </form>
  );
}
