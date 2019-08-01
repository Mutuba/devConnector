import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  return (
    <nav className="navbar bg-dark">
      <Link to="/">
        <h1>
          <i className="fas fa-code" /> DevConnector
        </h1>
      </Link>

      <ul>
        <li>
          <Link to="/profiles">Developers</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
      </ul>
    </nav>
  );
};
Navbar.propTypes = {
  logout: PropTypes.func,
  auth: PropTypes.func
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
