import axios from "axios";
const setAuthToken = token => {
  if (token) {
    //set the token headers as per api expectations
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    //delete headers if no token
    delete axios.defaults.headers.common["x-auth-token"];
  }
};
export default setAuthToken;
