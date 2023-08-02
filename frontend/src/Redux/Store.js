import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import { AppReducer } from "./AppReducer/AppReducer";
import { AuthReducer } from "./AuthReducer/AuthReducer";
import thunk from "redux-thunk";

const store = legacy_createStore(
  combineReducers({ AppReducer, AuthReducer }),
  applyMiddleware(thunk)
);

export default store;
