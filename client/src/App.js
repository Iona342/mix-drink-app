import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import Ranking from "./components/Ranking";
import TopPage from "./components/TopPage";
import MyPost from "./components/MyPost";

function generateUserId() {
  return "user_" + Math.random().toString(36).substring(2, 15);
}

function App() {
  React.useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const newId = generateUserId();
      localStorage.setItem("userId", newId);
      console.log("新しいuserIdを保存:", newId);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header-fixed">
          <h1>Mix Drink SNS</h1>
          <nav>
            <Link to="/">トップページ</Link> |
            <Link to="/form">投稿フォーム</Link> |
            <Link to="/posts">投稿一覧</Link> |
            <Link to="/ranking">ランキング</Link> |
            <Link to="/mypost">マイ投稿</Link>
          </nav>
        </header>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/form" element={<PostForm />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/mypost" element={<MyPost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
