import { baseURL } from "../../Config/CommonConfig";
import axios from "axios";
import * as types from "./actionTypes";

export const signupUser = (payload) => (dispatch) => {
  dispatch({ type: types.AUTH_REQUEST });
  axios
    .post(`${baseURL}/users/signup`, payload)
    .then((res) => {
      dispatch({ type: types.SIGNUP_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.AUTH_FAILIURE });
    });
};

export const signinUser = (payload) => (dispatch) => {
  dispatch({ type: types.AUTH_REQUEST });
  axios
    .post(`${baseURL}/users/login`, payload)
    .then((res) => {
      dispatch({ type: types.LOGIN_SUCCESS, payload: res.data });
      localStorage.setItem("chatapp_user_details", JSON.stringify(res.data));
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: types.AUTH_FAILIURE });
    });
};

export const userLogout = (paylaod) => (dispatch) => {
  localStorage.clear("chatapp_user_details");
  dispatch({ type: types.LOGOUT_SUCCESS });
};
