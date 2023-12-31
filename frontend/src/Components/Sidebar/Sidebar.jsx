import { useNavigate, useParams } from "react-router-dom";
import {
  IoHomeSharp,
  IoChatbubbleEllipsesSharp,
  IoSettingsSharp,
  IoEllipse,
  IoImages,
} from "react-icons/io5";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import {
  clearChats,
  closeDrawer,
  getAllChats,
  setCurrentChat,
} from "../../Redux/AppReducer/action";
import { getFriendDetailsFromChat } from "../../utils/commonFun/getFriendDetailsFromChat";
import { useTheme } from "@emotion/react";
import { getFormantedName } from "../../utils/commonFun/getFormatedName";
import { getLimitedText } from "../../utils/commonFun/getLimitedText";
import socket from "../../Config/socketio";
import Logo from "../Logo/Logo";

const Sidebar = ({ fromDrawer }) => {
  const [selectedMenu, setSelectedMenu] = useState("");

  const { user } = useSelector((store) => store.AuthReducer);
  const { chats, activeChats, currentChat, hasDataLoaded, isChatsLoading } =
    useSelector((store) => store.AppReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  useEffect(() => {
    console.log(chats);
  }, [chats]);
  const optionsMenus = [
    {
      name: "Feed",
      path: "/feed",
      className: "feed",
      icon: (
        <IoHomeSharp
          color={selectedMenu === "Feed" ? theme.palette.primary.main : ""}
        />
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      className: "setting",
      icon: (
        <IoSettingsSharp
          color={selectedMenu === "Settings" ? theme.palette.primary.main : ""}
        />
      ),
    },
  ];

  const handleSingleChat = (item) => {
    if (item._id === currentChat._id) {
      return;
    }
    const newChats = chats.map((chat) => ({
      ...chat,
      unreadCount: chat._id === item._id ? 0 : chat.unreadCount,
    }));
    dispatch({ type: "GETCHAT_SUCCESS", payload: newChats });
    socket.emit("open chat", item._id, user.userId);
    dispatch(setCurrentChat(item));
    navigate(`/chat/${item._id}`);
  };

  useEffect(() => {
    if (!fromDrawer) {
      dispatch(getAllChats(user.token));
    }
  }, [activeChats]);

  return (
    <Paper
      className="sidebar-container"
      style={{ boxShadow: "none", borderRight: theme.palette.border }}
    >
      <div>
        <div
          className="sidebar-logo-container"
          style={{ borderBottom: theme.palette.border }}
        >
          <Logo />
        </div>
      </div>
      <Divider />
      <div className="sidebar-message-container">
        {chats.length !== 0 ? (
          chats.map((item) => {
            return (
              <Box
                className={
                  currentChat._id === item._id
                    ? "single-message-box-selected"
                    : "single-message-box"
                }
                onClick={() => {
                  // socket.emit("open chat");
                  handleSingleChat(item);
                  setSelectedMenu("");
                  dispatch(closeDrawer());
                }}
                key={item._id}
                backgroundColor={
                  currentChat._id === item._id ? theme.palette.primary.main : ""
                }
                color={currentChat._id === item._id ? "white" : ""}
              >
                <Box position={"relative"} borderRadius={"50%"}>
                  <Avatar
                    src={getFriendDetailsFromChat(item?.users, user).avatar}
                  />
                  <Box position={"absolute"} right={"1%"} bottom={"1px"}>
                    {activeChats.includes(
                      getFriendDetailsFromChat(item?.users, user)._id
                    ) ? (
                      <div
                        style={{
                          borderRadius: "50%",
                          border: "3px solid white",
                          height: ".8rem",
                          width: ".8rem",
                          background: "#43c651",
                        }}
                      ></div>
                    ) : (
                      <div
                        style={{
                          borderRadius: "50%",
                          border: "3px solid white",
                          height: ".8rem",
                          width: ".8rem",
                          background: "#b9b9b9",
                        }}
                      ></div>
                    )}
                  </Box>
                </Box>
                <Box textAlign={"left"} width={"100%"}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography>
                      {item?.users &&
                        getFormantedName(
                          getFriendDetailsFromChat(item?.users, user).name
                        )}
                    </Typography>
                    {/* {item.latestMessage?.unRead && (
                      <Typography
                        borderRadius={"50%"}
                        // height={"10px"}
                        // width={"10px"}
                        backgroundColor="red"
                      >
                        New
                      </Typography>
                    )} */}
                  </Box>
                  <Typography fontSize={"12px"}>
                    {/* {item?.latestMessage?.sender?._id === user.userId && "You-"} */}
                    {!item?.latestMessage?.content &&
                    item?.latestMessage?.image ? (
                      <>
                        <IoImages /> <span>Photo</span>
                      </>
                    ) : (
                      getLimitedText(item.latestMessage?.content, 20)
                    )}
                  </Typography>
                </Box>
                {item.unreadCount &&
                item?.latestMessage?.sender?._id !== user.userId ? (
                  // <IoEllipse color="#ff0808" size={"1.3rem"} />
                  <Box>
                    <div
                      style={{
                        borderRadius: "50%",
                        height: "1.15rem",
                        width: "1.15rem",
                        background: "#ff0808",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      {item.unreadCount > 9 ? "9+" : item.unreadCount}
                    </div>
                  </Box>
                ) : null}
                {/* {!item.latestMessage && (
                  <Box>
                    <div
                      style={{
                        borderRadius: "50%",
                        // height: "1.15rem",
                        // width: "1.15rem",
                        color: "#ff0808",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // color: "white",
                      }}
                    >
                      New
                    </div>
                  </Box>
                )} */}
              </Box>
            );
          })
        ) : isChatsLoading ? (
          <Box textAlign="center">
            <CircularProgress size={24} />
            <Typography width={"80%"} margin={"auto"}>
              It may take few seconds to load for the first time.
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography textAlign={"center"} fontWeight={"bold"}>
              No Chats
            </Typography>
          </Box>
        )}
      </div>

      <div
        className="sidebar-menus-container"
        style={{
          borderTop: theme.palette.border,
        }}
      >
        {optionsMenus?.map((item, i) => {
          return (
            <Link
              key={i}
              className={`sidebar-link-container`}
              style={{
                borderRight:
                  selectedMenu === item.name
                    ? `4px solid ${theme.palette.primary.main}`
                    : "",
                background:
                  selectedMenu === item.name
                    ? `${theme.palette.primary.lighter}`
                    : "",
                color: selectedMenu === item.name ? `black` : "",
              }}
              to={item.path}
              onClick={() => {
                setSelectedMenu(item.name, user);
                dispatch(clearChats());
                dispatch(closeDrawer());
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>
    </Paper>
  );
};

export default Sidebar;
