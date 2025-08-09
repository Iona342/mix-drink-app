import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import "./Ranking.css"; // スタイルシートのインポート

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [sortKey, setSortKey] = useState("score"); // いいね数で並び替え
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "名無し",
            score: data.score || 0,
            trend: data.trend || 0,
            date: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : "不明",
            text: data.text || "",
          };
        })
      );
    });

    return () => unsubscribe();
  }, []);

  // 並び替え処理
  const sorted = [...posts].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return order === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return order === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <div className="ranking-container">
        <header className="ranking-header">
          <h1>人気ランキング</h1>
          <div className="filters">
            <select
              onChange={(e) => setSortKey(e.target.value)}
              value={sortKey}
            >
              <option value="score">いいね数</option>
              <option value="name">ユーザー</option>
              <option value="trend">変動</option>
            </select>

            <button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>
              {order === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </header>

        {sorted.map((user, index) => (
          <div
            key={user.id}
            className={`ranking-card ${
              index === 0
                ? "first-place"
                : index === 1
                ? "second-place"
                : index === 2
                ? "third-place"
                : ""
            }`}
          >
            <div className={`rank-badge rank-${index + 1}`}>{index + 1}</div>
            <div className="user-info">
              <div className="username">{user.name}</div>
              <div className="hart">♡{user.score}</div>
              <div className={`change ${user.trend >= 0 ? "up" : "down"}`}>
                {user.trend >= 0 ? `+${user.trend}` : user.trend}
              </div>
              <div className="timestamp">{user.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
