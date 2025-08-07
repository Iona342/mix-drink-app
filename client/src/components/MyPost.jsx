import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function MyPost() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userId = localStorage.getItem("userId");
      const myPosts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((post) => post.userId === userId);

      setPosts(myPosts);
    });

    return () => unsubscribe();
  }, []);

  // 🔻 削除処理関数
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("この投稿を削除しますか？");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("削除に失敗しました:", error);
    }
  };

  return (
    <div>
      <h2>マイ投稿</h2>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "1rem" }}>
          <div>{post.text}</div>
          {/* 🔻 削除ボタンを投稿ごとに表示 */}
          <button onClick={() => handleDelete(post.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
