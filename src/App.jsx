import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/homePage";
// import UsernameForm from "./component/UsernameForm";
import UsernameForm from "./component/userNameForm";
// import UserDetails from "./component/UserDetails";
import UserDetails from "./component/userDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Home Page */}
        <Route path="/" element={<HomePage />} />  
        {/* Route for Username Form */}
        <Route path="/user" element={<UsernameForm />} />
        {/* Route for User Details, includes username parameter */}
        <Route path="/user/:username" element={<UserDetails />} />
        </Routes>
    </Router>
  );
}

export default App;
