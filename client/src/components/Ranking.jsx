import React, { useEffect, useState } from "react"; //変化したときにやること、変化データを保存するフック
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore"; //データのグループ指定、条件付与、リアルタイムで反映
import "./Ranking.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons"; // 塗りつぶし

export default function PostList() {
  //export...で他のファイルからも使えるようにする、function..（）でコンポーネント作成（名は大文字にすること）
  const [posts, setPosts] = useState([]); //useState([])で箱作成、postsは箱の中身、setPostsはデータを更新する関数
  const [sortKey, setSortKey] = useState("score"); //sortKeyに初期値"score"を設定,setSortKeyはsortKeyを変える関数
  const [order, setOrder] = useState("desc"); //今の並びは降順（desk,昇順ならasc）という初期値を設定

  useEffect(() => {
    //この時点でリスナーが登録され、データの変更を監視する
    const q = query(collection(db, "posts")); //query()でqueryを作成、collection(db, "posts")で"posts"コレクションを指定
    const unsubscribe = onSnapshot(q, (snapshot) => {
      //onSnapshot()でリアルタイム更新を監視、qの内容が変わったら()の中の関数が実行される、onsubscribe()でunsubscribeを返す
      setPosts(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.userId ?? "名無し",
            score: data.likes ?? 0,
            bads: data.bads ?? 0,
            trend: data.trend ?? 0,
            date: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : "不明",
            text: Array.isArray(data.text)
              ? data.text.join("×")
              : data.text ?? "",
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
              <option value="bads">低評価数</option>
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
              <div className="like">
                <FontAwesomeIcon
                  icon={fasHeart}
                  style={{ marginRight: "4px", color: "#e0245e" }}
                />
                {user.score}
              </div>
              <div className="bad">
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  style={{ marginRight: "4px", color: "#555" }}
                />
                {user.bads}
              </div>
              <div className="text">{user.text}</div>
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
