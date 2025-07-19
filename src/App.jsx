import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./HomePage";
import HomePage from "./pages/HomePage"
import UsernameForm from "./pages/UserNameForm";
import UserDetails from "./pages/UserDetails";
import Problems from "./pages/Problems";
import Wrapped from "./pages/Wrapped";
import SmartRecommendations from "./pages/SmartRecommendations";
import TopicMastery from "./pages/TopicMastery";
function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Home Page */}
        <Route path="/" element={<HomePage />} />
        {/* Route for Username Form */}
        <Route path="/user" element={<UsernameForm />} />
        <Route path="/user/:username" element={<UserDetails />} />
        <Route path="/problems/:username/:tag" element={<Problems />} />
        <Route path="/user/:handle/wrapped" element={<Wrapped />} />
        <Route
          path="/user/:handle/recommendations"
          element={<SmartRecommendations />}
        />
        <Route path="/user/:handle/topic-mastery" element={<TopicMastery />} />
      </Routes>
    </Router>
  );
}

export default App;
