import axios from "axios";
import * as types from "./actionTypes";
import { baseURL } from "../../Config/CommonConfig";

const setCurrentChat = (payload) => {
  return {
    type: types.SET_CURRENT_CHAT,
    payload,
  };
};

const setCurrentMessages = (payload) => {
  return {
    type: types.GETCHAT_SUCCESS,
    payload,
  };
};

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

const createChat = (payload, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    let res = await axios.post(`${baseURL}/chat/create`, payload, config);
    dispatch(getAllChats(token));
  } catch (err) {
    console.log(err);
  }
};

const getAllChats = (token) => async (dispatch) => {
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
    console.log(res.data);
    // dispatch(getChatSuccess(res.data));
  } catch (err) {
    console.log(err);
  }
};

export {
  getChatSuccess,
  setCurrentChat,
  setCurrentMessages,
  clearChats,
  clearData,
  createChat,
  getAllChats,
  setActiveChats,
  getMessages,
  sendMessage,
};
