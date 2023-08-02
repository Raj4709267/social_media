import * as types from "./actionTypes";

const userDetails =
  JSON.parse(localStorage.getItem("chatapp_user_details")) || false;

const initState = {
  isAuth: userDetails ? true : false,
  isLoading: false,
  user: userDetails || {},
  errorMessage: "",
};

function AuthReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.AUTH_REQUEST: {
      return { ...state, isLoading: true, isAuth: false };
    }
    case types.SIGNUP_SUCCESS: {
      return { ...state, isLoading: false, isAuth: false };
    }
    case types.AUTH_FAILIURE: {
      return { ...state, isLoading: false, isAuth: false };
    }
    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAuth: true,
        user: payload,
      };
    }
    case types.LOGOUT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isAuth: false,
        user: {},
      };
    }
    case types.UPDATE_USER: {
      console.log(payload);
      return {
        ...state,
        user: payload,
      };
    }

    default:
      return state;
  }
}
export { AuthReducer };
