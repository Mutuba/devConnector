import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
// import axios from "axios";
const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const { name, email, password, password2 } = formData;
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      // const user = {
      //   name,
      //   email,
      //   password,
      //   password2
      // };
      // try {
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json"
      //     }
      //   };
      //   const body = JSON.stringify(user);
      //   const res = await axios.post("/api/users", body, config);
      //   console.log("from the server", res.data)
      // } catch (error) {
      //   console.error(error.response.data)
      // }
    }
  };
  return (
    <Fragment>
      <h4 className="large text-primary">Sign Up</h4>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            minLength="6"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            minLength="6"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account?<Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};
Register.propTypes = {
  setAlert:PropTypes.func.isRequired
};
//connect component to store
export default connect(
  null,
  { setAlert }
)(Register);
