import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
// import HomePage from "./HomePage";
import HomePage from "./pages/HomePage"
import UsernameForm from "./pages/UserNameForm";
import UserDetails from "./pages/UserDetails";
import Problems from "./pages/Problems";
import Wrapped from "./pages/Wrapped";
import SmartRecommendations from "./pages/SmartRecommendations";
import TopicMastery from "./pages/TopicMastery";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <ThemeToggle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UsernameForm />} />
          <Route path="/user/:username" element={<UserDetails />} />
          <Route path="/problems/:username/:tag" element={<Problems />} />
          <Route path="/user/:handle/wrapped" element={<Wrapped />} />
          <Route path="/user/:handle/recommendations" element={<SmartRecommendations />} />
          <Route path="/user/:handle/topic-mastery" element={<TopicMastery />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
