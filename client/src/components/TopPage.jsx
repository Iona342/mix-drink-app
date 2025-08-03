import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export default function TopPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Mix Drink SNS へようこそ！</h2>
      <p>ここでは、MIXしたドリンクを投稿したり、他の人の投稿を閲覧したりできます。</p>
      <hr />
      <h2>最近の投稿</h2>
      {posts.map((post) => (
        <div key={post.id}>{post.text}</div>
      ))}
    </div>
  );
}