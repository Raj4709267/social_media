import React, { useState, useEffect, useRef } from "react";
import { baseURL } from "../../Config/CommonConfig";
import { useDispatch, useSelector } from "react-redux";

import { getAllChats, setActiveChats } from "../../Redux/AppReducer/action";
import socket from "../../Config/socketio";
import { getFriendDetailsFromChat } from "../../utils/commonFun/getFriendDetailsFromChat";
import axios from "axios";
import ChatBox from "../../Components/ChatBox/ChatBox";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { getFormantedName } from "../../utils/commonFun/getFormatedName";
import style from "./Chat.module.css";
import { useTheme } from "@emotion/react";
import ChatUI from "../../Components/ChatInput/ChatInput";
import UserProfileModal from "../../Components/ProfileModal/ProfileModal";

const Chat = () => {
  // const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { currentChat, activeChats } = useSelector((store) => store.AppReducer);
  const { user } = useSelector((store) => store.AuthReducer);
  const dispatch = useDispatch();
  const currentChatIdRef = useRef(currentChat._id);
  const friendDetails = getFriendDetailsFromChat(currentChat.users, user);
  const theme = useTheme();
  const timeoutRef = useRef(null);

  // const currentChatId = useParams().id;

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSendMessage = async (message, imageUrl) => {
    // event.preventDefault();
    if (message.trim() === "" && !imageUrl) {
      return;
    }
    setIsMessageSending(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const payload = {
      chatId: currentChat._id,
      content: message,
      image: imageUrl,
    };
    try {
      let res = await axios.post(`${baseURL}/message/send`, payload, config);
      socket.emit("new message", {
        content: res.data,
        userId: getFriendDetailsFromChat(currentChat.users, user)._id,
      });
      console.log("sending to", {
        content: res.data,
        userId: getFriendDetailsFromChat(currentChat.users, user)._id,
      });
      getMessages(user.token, currentChat._id);
      setIsMessageSending(false);

      // dispatch(getChatSuccess(res.data));
    } catch (err) {
      console.log(err);
      setIsMessageSending(false);
    }
  };

  const getMessages = async (token, chatId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      let res = await axios.get(`${baseURL}/message/${chatId}`, config);
      dispatch(getAllChats(user.token));
      setMessages(res.data);
      setIsMessageSending(false);
    } catch (err) {
      console.log(err);
      setIsMessageSending(false);
    }
  };

  const handleTyping = () => {
    if (!typing) {
      socket.emit("typing", {
        friendId: friendDetails._id,
        userId: user.userId,
      });
    }
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      socket.emit("stoppedTyping", {
        friendId: friendDetails._id,
        userId: user.userId,
      });
    }, 1000);
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
  };

  const handleProfileModalOpen = () => {
    setShowProfileModal(true);
  };

  // useEffect(() => {
  //   socket.on("getActiveUsers", (activeUsers) => {
  //     setSocketConnected(true);
  //     console.log(activeUsers);
  //     const activeIds = activeUsers.map((item) => item);
  //     dispatch(setActiveChats(activeIds));
  //   });
  // }, [socket]);

  useEffect(() => {
    console.log("seggingglksdl");
    console.log(socket.connected);
    socket.emit("setup", user);

    // socket.on("recived message", (kk) => {
    //   console.log("message");
    // });

    socket.on("getActiveUsers", (activeUsers) => {
      console.log(user.userId);
      console.log("activeUsers", activeUsers);
      const activeIds = activeUsers.map((item) => item.userId);
      dispatch(setActiveChats(activeIds));
    });
  }, []);

  useEffect(() => {
    currentChatIdRef.current = currentChat._id;
  }, [currentChat]);

  useEffect(() => {
    socket.on("recived message", (messageFromS) => {
      console.log("from message", currentChatIdRef.current);

      if (currentChatIdRef.current === messageFromS?.content?.chat?._id) {
        console.log("onw");
        getMessages(user.token, messageFromS.content.chat._id);
      } else {
        console.log("two");
        dispatch(getAllChats(user.token));
      }
    });

    socket.on("userTyping", (toUserId) => {
      console.log("typing");
      setTyping(true);
      setUserTyping(toUserId);
    });

    socket.on("userStoppedTyping", (toUserId) => {
      setTyping(false);
      setUserTyping(toUserId);
    });
  }, [socket]);

  useEffect(() => {
    if (currentChat._id) {
      console.log(activeChats.includes(friendDetails._id));
      getMessages(user.token, currentChat._id);
    }
  }, [currentChat]);

  return (
    <div>
      {currentChat._id ? (
        <>
          <Box className={style.chat_container_main}>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                height: "50px",
                borderBottom: theme.palette.border,
                paddingBottom: "16px",
              }}
            >
              <Avatar
                src={friendDetails.avatar}
                sx={{ width: 48, height: 48, cursor: "pointer" }}
                onClick={handleProfileModalOpen}
              />
              <Typography fontSize={"20px"} fontWeight={"bold"}>
                {getFormantedName(friendDetails.name)}
              </Typography>
              {activeChats.includes(friendDetails._id) && (
                <div
                  style={{
                    borderRadius: "50%",
                    height: ".7rem",
                    width: ".7rem",
                    background: "#43c651",
                    marginLeft: "-5px",
                  }}
                ></div>
              )}
            </Box>
            <Box
              height={"calc(100% - 60px)"}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <ChatBox
                messages={messages}
                typing={typing}
                userTyping={userTyping}
              />

              <Box
                style={{
                  borderTop: theme.palette.border,
                  paddingTop: "8px",
                }}
              >
                <Paper
                  style={{
                    boxShadow: "none",
                    background: theme.palette.mode === "light" ? "white" : "",
                  }}
                  className={style.chat_input_box}
                >
                  <ChatUI
                    handleSendMessage={handleSendMessage}
                    isMessageSending={isMessageSending}
                    handleTyping={handleTyping}
                  />
                </Paper>
              </Box>
            </Box>
          </Box>
          <UserProfileModal
            user={friendDetails}
            open={showProfileModal}
            onClose={handleProfileModalClose}
          />
        </>
      ) : (
        <div>select any chat</div>
      )}
    </div>
  );
};

export default Chat;
