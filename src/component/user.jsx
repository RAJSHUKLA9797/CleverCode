import React from "react";
import { Link, Outlet } from "react-router-dom";

const User = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Home Page</h1>
      <p>This page contains some basic information.</p>

      {/* Link to the nested User route */}
      <button>
        <Link to="/user/profile">Go to User profile</Link>
      </button>

      {/* The nested route content will be rendered here */}
      <Outlet />
    </div>
  );
};
export default User;