import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./HomePage";
import HomePage from "./component/homePage"
import UsernameForm from "./component/userNameForm";
import UserDetails from "./component/userDetails";
import Problems from "./component/problems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UsernameForm />} />
        <Route path="/user/:username" element={<UserDetails />} />
        <Route path="/problems/:username/:tag" element={<Problems />} />
      </Routes>
    </Router>
  );
}

export default App;
