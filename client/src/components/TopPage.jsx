import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

export default function TopPage() {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    // 初期値はローカルストレージから取得
    return JSON.parse(localStorage.getItem("likedPosts") || "[]");
  });

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  const handleLikeToggle = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const hasLiked = likedPosts.includes(postId);

    try {
      if (hasLiked) {
        // いいね取り消し
        await updateDoc(postRef, {
          likes: increment(-1),
        });
        const newLikedPosts = likedPosts.filter((id) => id !== postId);
        setLikedPosts(newLikedPosts);
        localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
      } else {
        // いいね
        await updateDoc(postRef, {
          likes: increment(1),
        });
        const newLikedPosts = [...likedPosts, postId];
        setLikedPosts(newLikedPosts);
        localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
      }
    } catch (error) {
      console.error("いいね更新エラー:", error);
    }
  };

  return (
    <div>
      <h2>最近の投稿</h2>
      {posts.map((post) => {
        const hasLiked = likedPosts.includes(post.id);

        return (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
            }}
          >
            <div>
              <strong>選んだドリンク:</strong>
              {Array.isArray(post.text) ? post.text.join(" ＋ ") : post.text}
            </div>
            <div>
              <strong>感想:</strong> {post.comment}
            </div>
            {post.imageUrl && (
              <div>
                <img
                  src={post.imageUrl}
                  alt="投稿画像"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
            <div style={{ marginTop: "8px" }}>
              <button onClick={() => handleLikeToggle(post.id)}>
                {hasLiked ? "❤" : "♡"}
              </button>
              <span style={{ marginLeft: "8px" }}>{post.likes || 0}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
