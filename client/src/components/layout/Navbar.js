import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <Link to="/">
        <h1>
          <i className="fas fa-code" /> DevConnector
        </h1>
      </Link>

      <ul>
        <li>
          <Link to='/profiles'>Developers</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to='/login'>login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
