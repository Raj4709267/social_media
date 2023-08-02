import { useNavigate, useParams } from "react-router-dom";
import {
  IoHomeSharp,
  IoChatbubbleEllipsesSharp,
  IoSettingsSharp,
  IoEllipse,
} from "react-icons/io5";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Divider, Paper, Typography } from "@mui/material";
import {
  clearChats,
  getAllChats,
  setCurrentChat,
} from "../../Redux/AppReducer/action";
import { getFriendDetailsFromChat } from "../../utils/commonFun/getFriendDetailsFromChat";
import { useTheme } from "@emotion/react";
import { getFormantedName } from "../../utils/commonFun/getFormatedName";
import { getLimitedText } from "../../utils/commonFun/getLimitedText";
import socket from "../../Config/socketio";

const Sidebar = () => {
  const [selectedMenu, setSelectedMenu] = useState("");

  const { user } = useSelector((store) => store.AuthReducer);
  const { chats, activeChats, currentChat } = useSelector(
    (store) => store.AppReducer
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const optionsMenus = [
    {
      name: "Feed",
      path: "/feed",
      icon: (
        <IoHomeSharp
          color={selectedMenu === "Feed" ? theme.palette.primary.main : ""}
        />
      ),
    },
    {
      name: "Settings",
      path: "/settings",
      icon: (
        <IoSettingsSharp
          color={selectedMenu === "Settings" ? theme.palette.primary.main : ""}
        />
      ),
    },
  ];

  const handleSingleChat = (item) => {
    // socket.emit("open chat", item._id, user.userId);
    dispatch(setCurrentChat(item));
    navigate(`/chat/${item._id}`);
  };

  useEffect(() => {
    dispatch(getAllChats(user.token));
  }, [activeChats]);

  return (
    <Paper
      className="sidebar-container"
      style={{ boxShadow: "none", borderRight: theme.palette.border }}
    >
      <div>
        <div className="sidebar-logo-container">
          <img src="/logo.png" />
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
                  handleSingleChat(item);
                  setSelectedMenu("");
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
                    {getLimitedText(item.latestMessage?.content, 20)}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <div>No Chats</div>
        )}
      </div>

      <div className="sidebar-menus-container">
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
