import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PostForm from "./components/PostForm";
import Ranking from "./components/Ranking";
import TopPage from "./components/TopPage";
import SearchForm from "./components/SearchForm";
import MyPost from "./components/MyPost";
import "./App.css";

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
          <h1>Drink Master</h1>
          <nav>
            <Link to="/">トップページ</Link>
            <Link to="/form">投稿フォーム</Link>
            <Link to="/ranking">ランキング</Link>
            <Link to="/search">検索</Link>
            <Link to="/mypost">あなたの投稿</Link>
          </nav>
        </header>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/form" element={<PostForm />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/search" element={<SearchForm />} />
            <Route path="/mypost" element={<MyPost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;