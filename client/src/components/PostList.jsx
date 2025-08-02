import React, { useEffect, useState } from "react";
import { db,auth } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); // コンポーネントがアンマウントされたら購読解除
  }, []);

  return (
    <div>
      <h2>投稿一覧</h2>
      {posts.map((post) => (
        <div key={post.id}>{post.text}</div>
      ))}
    </div>
  );
}
