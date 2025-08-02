import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import Ranking from "./components/Ranking";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Mix Drink SNS</h1>
        <nav>
          <Link to="/form">投稿フォーム</Link> | <Link to="/posts">投稿一覧</Link> | <Link to="/ranking">ランキング</Link>
        </nav>
        <Routes>
          <Route path="/form" element={<PostForm />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
