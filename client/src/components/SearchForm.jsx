import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./SearchForm.css"; // スタイルシートのインポート
export default function SearchForm({ onSearchResults }) {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

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
        const q = query(postsRef, where("text", "array-contains", selectedDrinks[0]));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
      } else {
        // 複数のドリンクの場合は積集合（AND検索）
        // まず最初のドリンクで検索
        const q = query(postsRef, where("text", "array-contains", selectedDrinks[0]));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          const postData = { id: doc.id, ...doc.data() };
          
          // 選択されたすべてのドリンクが含まれているかチェック
          const hasAllDrinks = selectedDrinks.every(drink => 
            postData.text && postData.text.includes(drink)
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

  return (
    <div className="search-form">
      {/* ドリンクボタン */}
      <div className="drink-buttons">
        {drinkButtons.map((drink, index) => (
          <button
            key={index}
            type="button"
            className={selectedDrinks.includes(drink) ? "selected" : ""}　//selectedの状態＝CSSのbutton.selectedを適用
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
        {searchResults.map((post) => (
          <div key={post.id} className="post-item">
            <h3>使用ドリンク: {post.text?.join(", ")}</h3>
            {post.imageUrl && (
              <img 
                src={post.imageUrl} 
                alt="ドリンク画像" 
                style={{ maxWidth: "200px", height: "auto" }}
              />
            )}
            <p>感想: {post.comment}</p>
            <small>投稿日: {post.createdAt?.toDate().toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}