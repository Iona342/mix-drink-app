import React, { useState } from "react";
import { db,auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostForm() {
  const [drink, setDrink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts"), {
      text: drink,
      createdAt: serverTimestamp(),
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
