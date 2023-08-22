import axios from "axios";
import * as types from "./actionTypes";
import { baseURL } from "../../Config/CommonConfig";
import { toast } from "react-toastify";
import { getFirstName } from "../../utils/commonFun/getFirstName";
import { getFriendDetailsFromChat } from "../../utils/commonFun/getFriendDetailsFromChat";

const setCurrentChat = (payload) => {
  return {
    type: types.SET_CURRENT_CHAT,
    payload,
  };
};

// const setCurrentMessages = (payload) => {
//   return {
//     type: types.GETCHAT_SUCCESS,
//     payload,
//   };
// };

const getChatSuccess = (payload) => {
  return {
    type: types.GETCHAT_SUCCESS,
    payload,
  };
};

const setActiveChats = (payload) => {
  return {
    type: types.SET_ACTIVE_CHATS,
    payload,
  };
};

const setMessages = (payload) => {
  return {
    type: types.GETMESSAGE_SUCCESS,
    payload,
  };
};

const clearData = () => {
  return {
    type: types.LOGOUT,
  };
};

const clearChats = () => {
  return { type: types.CLEAR_CHAT };
};

const openDrawer = () => {
  return { type: types.OPEN_DRAWER };
};
const closeDrawer = () => {
  return { type: types.CLOSE_DRAWER };
};

const createChat = (payload, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let res = await axios.post(`${baseURL}/chat/create`, payload, config);
    dispatch(setCurrentChat(res.data));
    dispatch(getAllChats(token));
  } catch (err) {
    console.log(err);
  }
};

const getAllChats = (token) => async (dispatch) => {
  dispatch({ type: types.GETCHAT_REQUEST });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let res = await axios.get(`${baseURL}/chat`, config);
    dispatch(getChatSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch({ type: types.GETCHAT_FAILURE });
  }
};

const getMessages = (token, chatId) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let res = await axios.get(`${baseURL}/message/${chatId}`, config);
    dispatch(setMessages(res.data));
  } catch (err) {
    console.log(err);
  }
};

const sendMessage = (token, payload) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let res = await axios.get(`${baseURL}/message/send`, payload, config);
    // console.log(res.data);
    console.log("message sent");
    // dispatch(getChatSuccess(res.data));
  } catch (err) {
    console.log(err);
  }
};

const showNotification = (recivedMessage) => (dispatch, getState) => {
  const state = getState();

  const currentChatId = state?.AppReducer?.currentChat?._id;
  const chatIdFromSocket = recivedMessage?.content?.chat?._id;
  const token = state?.AuthReducer?.user?.token;
  if (currentChatId === chatIdFromSocket) {
    dispatch({ type: types.RECIVED_MESSAGE, payload: recivedMessage.content });
    dispatch(getAllChats(token));
  } else {
    const user = state?.AuthReducer?.user;
    const chats = state?.AppReducer?.chats?.filter(
      (item) => item._id === chatIdFromSocket
    );

    const friendDetails = getFriendDetailsFromChat(chats[0]?.users, user);
    console.log(friendDetails);
    // console.log(state);
    dispatch(getAllChats(token));
    message(getFirstName(friendDetails?.name));
  }
};

const message = (name) => {
  toast(`🦄 Message from ${name} `, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export {
  getChatSuccess,
  setCurrentChat,
  // setCurrentMessages,
  clearChats,
  clearData,
  createChat,
  getAllChats,
  setActiveChats,
  getMessages,
  sendMessage,
  openDrawer,
  closeDrawer,
  showNotification,
};
