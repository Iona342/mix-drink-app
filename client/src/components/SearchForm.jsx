import React, { useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown as farThumbsDown } from "@fortawesome/free-regular-svg-icons";
import "./SearchForm.css"; // スタイルシートのインポート

export default function SearchForm({ onSearchResults }) {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() =>
    JSON.parse(localStorage.getItem("likedPosts") || "[]")
  );
  const [badPosts, setBadPosts] = useState(() =>
    JSON.parse(localStorage.getItem("badPosts") || "[]")
  );

  const drinkButtons = [
    "コカ・コーラ",
    "ペプシ",
    "メロンソーダ",
    "ジンジャーエール",
    "スプライト",
    "炭酸水",
    "オレンジ",
    "山ぶどう",
    "白ブドウ",
    "リンゴ",
    "野菜ジュース",
    "カルピス",
    "カルピスソーダ",
    "ウーロン茶",
    "爽健美茶",
    "紅茶",
    "青汁",
    "アイスコーヒー",
    "カフェモカ",
    "カフェラテ",
    "ココア",
    "キャラメルマキアート",
    "抹茶ラテ",
    "ソフトクリーム",
  ];

  const handleDrinkClick = (drink) => {
    if (selectedDrinks.includes(drink)) {
      setSelectedDrinks(selectedDrinks.filter((d) => d !== drink));
    } else {
      setSelectedDrinks([...selectedDrinks, drink]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (selectedDrinks.length === 0) return;

    try {
      const postsRef = collection(db, "posts");
      const results = [];

      if (selectedDrinks.length === 1) {
        // 1つのドリンクの場合は通常の検索
        const q = query(
          postsRef,
          where("text", "array-contains", selectedDrinks[0])
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
      } else {
        // 複数のドリンクの場合は積集合（AND検索）
        // まず最初のドリンクで検索
        const q = query(
          postsRef,
          where("text", "array-contains", selectedDrinks[0])
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const postData = { id: doc.id, ...doc.data() };

          // 選択されたすべてのドリンクが含まれているかチェック
          const hasAllDrinks = selectedDrinks.every(
            (drink) => postData.text && postData.text.includes(drink)
          );
          if (hasAllDrinks) {
            results.push(postData);
          }
        });
      }

      setSearchResults(results);
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error("検索エラー:", error);
    }
  };

  const handleLikeToggle = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const hasLiked = likedPosts.includes(postId);
    const hasBad = badPosts.includes(postId);

    try {
      if (hasLiked) {
        // いいね解除
        await updateDoc(postRef, {
          likes: increment(-1),
        });
        const newLikedPosts = likedPosts.filter((id) => id !== postId);
        setLikedPosts(newLikedPosts);
        localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
      } else {
        // いいね → BADが押されてたら解除する
        await updateDoc(postRef, {
          likes: increment(1),
          bads: hasBad ? increment(-1) : increment(0),
        });
        const newLikedPosts = [...likedPosts, postId];
        setLikedPosts(newLikedPosts);

        if (hasBad) {
          const newBadPosts = badPosts.filter((id) => id !== postId);
          setBadPosts(newBadPosts);
          localStorage.setItem("badPosts", JSON.stringify(newBadPosts));
        }

        localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
      }
    } catch (error) {
      console.error("いいね更新エラー:", error);
    }
  };

  const handleBadToggle = async (postId) => {
    const postRef = doc(db, "posts", postId);
    const hasBad = badPosts.includes(postId);
    const hasLiked = likedPosts.includes(postId);

    try {
      if (hasBad) {
        // BAD解除
        await updateDoc(postRef, {
          bads: increment(-1),
        });
        const newBadPosts = badPosts.filter((id) => id !== postId);
        setBadPosts(newBadPosts);
        localStorage.setItem("badPosts", JSON.stringify(newBadPosts));
      } else {
        // BAD → いいねが押されてたら解除する
        await updateDoc(postRef, {
          bads: increment(1),
          likes: hasLiked ? increment(-1) : increment(0),
        });
        const newBadPosts = [...badPosts, postId];
        setBadPosts(newBadPosts);

        if (hasLiked) {
          const newLikedPosts = likedPosts.filter((id) => id !== postId);
          setLikedPosts(newLikedPosts);
          localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));
        }

        localStorage.setItem("badPosts", JSON.stringify(newBadPosts));
      }
    } catch (error) {
      console.error("BAD更新エラー:", error);
    }
  };

  return (
    <div className="search-form">
      {/* ドリンクボタン */}
      <div className="drink-buttons">
        {drinkButtons.map((drink, index) => (
          <button
            key={index}
            type="button"
            className={selectedDrinks.includes(drink) ? "selected" : ""}
            onClick={() => handleDrinkClick(drink)}
          >
            {drink}
          </button>
        ))}
      </div>

      {/* 検索欄 */}
      <form onSubmit={handleSearch}>
        <input
          value={selectedDrinks.map((drink) => `#${drink}`).join(" ")}
          placeholder="ドリンク名"
          readOnly
        />
        <button type="submit">検索</button>
      </form>

      {/* 検索結果表示 */}
      <div className="search-results">
        {searchResults.map((post) => {
          const hasLiked = likedPosts.includes(post.id);
          const hasBad = badPosts.includes(post.id);

          return (
            <div key={post.id} className="post-item">
              <h3>
                使用ドリンク:{" "}
                {Array.isArray(post.text) ? post.text.join(" ＋ ") : post.text}
              </h3>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="ドリンク画像"
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              )}
              <p>感想: {post.comment}</p>
              <small>投稿日: {post.createdAt?.toDate().toLocaleString()}</small>

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => handleLikeToggle(post.id)}>
                  {hasLiked ? "❤" : "♡"}
                </button>
                <span style={{ marginLeft: "8px", marginRight: "16px" }}>
                  {post.likes || 0}
                </span>

                <button onClick={() => handleBadToggle(post.id)}>
                  {hasBad ? (
                    <FontAwesomeIcon
                      icon={faThumbsDown}
                      style={{ color: "black" }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={farThumbsDown}
                      style={{ color: "black" }}
                    />
                  )}
                </button>
                <span style={{ marginLeft: "8px" }}>{post.bads || 0}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
