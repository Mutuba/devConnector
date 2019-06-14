import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../util/setAuthToken";

//load user
export const loadUser = () => async dispatch => {
  //register or login sets a token in the local storage
  // checking if there is and calling setAuthToken to set the headers with our token to conform
  //to api expectation that a requeat to auth should have a token makes sense
  //tjhe api parses the token and if valod returns a user based on the token's user id
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    // valid token's response is user data as per the token
    //hence the dispatch of USER_LOADED with payload as res.data
    const res = await axios.get("api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};
//register user
const registerSuccess = data => ({ type: REGISTER_SUCCESS, payload: data });

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    dispatch(registerSuccess(res.data));
  } catch (error) {
    //alert component is actively watching for errors and
    //whenever set alert is triggered the alerts will show
    // console.log(error.response.data.errors);
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};
