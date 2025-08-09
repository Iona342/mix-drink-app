import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // firebase設定ファイル
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function MyPost() {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const postsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((post) => post.userId === userId); // 自分の投稿だけ

        setMyPosts(postsData);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchMyPosts();
  }, []);

  return (
    <div>
      <h2>自分の投稿一覧</h2>
      {myPosts.length === 0 ? (
        <p>まだ投稿がありません。</p>
      ) : (
        myPosts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>選んだドリンク:</strong> {post.text}
            </p>
            <p>
              <strong>感想:</strong> {post.comment || "なし"}
            </p>
            <p>
              <strong>♡</strong> {post.likes || 0}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
