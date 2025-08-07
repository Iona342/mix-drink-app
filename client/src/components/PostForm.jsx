import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostForm() {
  const [drink, setDrink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    await addDoc(collection(db, "posts"), {
      text: drink,
      createdAt: serverTimestamp(),
      userId: userId,
    });

    setDrink("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={drink}
        onChange={(e) => setDrink(e.target.value)}
        placeholder="ドリンク名"
      />
      <button type="submit">投稿</button>
    </form>
  );
}
