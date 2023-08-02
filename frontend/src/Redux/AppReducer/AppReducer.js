import * as types from "./actionTypes";

const initState = {
  currentChat: "",
  chats: [],
  activeChats: [],
  messages: [],
  isOpenDrawer: false,
};

function AppReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case types.GETCHAT_SUCCESS: {
      return {
        ...state,
        chats: payload,
      };
    }
    case types.SET_CURRENT_CHAT: {
      return {
        ...state,
        currentChat: payload,
      };
    }

    case types.CLEAR_CHAT: {
      return { ...state, currentChat: {} };
    }

    case types.SET_ACTIVE_CHATS: {
      return {
        ...state,
        activeChats: payload,
      };
    }
    case types.GETMESSAGE_SUCCESS: {
      return {
        ...state,
        messages: payload,
      };
    }
    case types.LOGOUT: {
      return {
        currentChat: "",
        chats: [],
        activeChats: [],
        messages: [],
      };
    }
    case types.OPEN_DRAWER: {
      return {
        ...state,
        isOpenDrawer: true,
      };
    }
    case types.CLOSE_DRAWER: {
      return {
        ...state,
        isOpenDrawer: false,
      };
    }
    default:
      return state;
  }
}

export { AppReducer };
