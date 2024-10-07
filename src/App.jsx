import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes
import { LazyPostsUnwrapUseEffect } from "./features/posts/LazyPostsUnwrapUseEffect";
import { Navbar } from "./app/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<LazyPostsUnwrapUseEffect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
