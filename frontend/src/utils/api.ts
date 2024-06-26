import axios from "axios";
import store from "../store";
import { logOut } from "../store/auth";

// Create an instance of axios
const api = axios.create({
  baseURL: "https://weatherchain.ca/api",
  headers: {
    "Content-Type": "application/json",
  },
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      //   store.dispatch(logOut());
    }
    return Promise.reject(err);
  }
);

export default api;
