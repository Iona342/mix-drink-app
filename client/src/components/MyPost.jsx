import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./MyPost.css";

export default function MyPost() {
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const postsData = querySnapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        .filter((post) => post.userId === userId);

      setMyPosts(postsData);
    } catch (error) {
      console.error("データ取得エラー:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      setMyPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  return (
    <div>
      <h2 className="your-post">あなたの投稿</h2>
      {myPosts.length === 0 ? (
        <p className="none-post">投稿しましょう！</p>
      ) : (
        <div className="results">
          {myPosts.map((post) => (
            <div key={post.id} className="post-item">
              <button
                className="delete-btn"
                onClick={() => handleDelete(post.id)}
              >
                <FontAwesomeIcon icon={faTrash} /> 削除
              </button>
              <div className="post-content">
                <div className="post-drink">
                  <strong>選んだドリンク:</strong>{" "}
                  {Array.isArray(post.text)
                    ? post.text.join(" ＋ ")
                    : post.text}
                </div>
                <div>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="ドリンク画像"
                      style={{ maxWidth: "200px", height: "auto" }}
                    />
                  )}
                </div>
                <div>
                  <strong>感想:</strong> {post.comment}
                </div>
                <div>
                  ♥ {post.likes || 0} <FontAwesomeIcon icon={faThumbsDown} />{" "}
                  {post.bads || 0}
                </div>
                <small>
                  投稿日: {post.createdAt?.toDate().toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
