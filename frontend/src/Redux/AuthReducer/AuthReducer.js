import * as types from "./actionTypes";

const userDetails =
  JSON.parse(localStorage.getItem("chatapp_user_details")) || false;

const initState = {
  isAuth: userDetails ? true : false,
  isLoading: false,
  user: userDetails || {},
  errorMessage: "",
  message: "",
};

function AuthReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.AUTH_REQUEST: {
      return { ...state, isLoading: true, isAuth: false, message: "" };
    }
    case types.SIGNUP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        message: "Signup successful. Go to login.",
      };
    }
    case types.AUTH_FAILIURE: {
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        errorMessage: payload,
        message: "",
      };
    }
    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        user: payload,
        message: "",
      };
    }
    case types.LOGOUT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        user: {},
        message: "",
      };
    }
    case types.UPDATE_USER: {
      return {
        ...state,
        user: payload,
      };
    }
    case types.CLEAR_MESSAGES: {
      return {
        ...state,
        message: "",
        errorMessage: "",
      };
    }
    default:
      return state;
  }
}
export { AuthReducer };
