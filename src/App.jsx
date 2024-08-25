// import { useState } from 'react'
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import reactLogo from './assets/react.svg'

// import viteLogo from '/vite.svg'
// import './App.css'
// import HomePage from './component/homePage'
// import User from './component/user'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route exact path="/" element={<HomePage />}>
//         </Route>
//         <Route path="user" element={<User />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./component/homePage";
import User from "./component/user";

function App() {
  return (
    <Router>
      <Routes>
        {/* Parent route */}
        <Route path="/" element={<HomePage />}>
          {/* Nested route */}
        </Route>
          <Route path="user" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;