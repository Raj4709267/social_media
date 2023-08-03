import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { getFormatedDate } from "../../utils/commonFun/getFormatedDate";
import { HiLockClosed } from "react-icons/hi2";
import { getFirstName } from "../../utils/commonFun/getFirstName";
import { getFriendDetailsFromChat } from "../../utils/commonFun/getFriendDetailsFromChat";

const ChatBox = ({ messages, typing, userTyping }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // State to track image loading

  const { user } = useSelector((store) => store.AuthReducer);
  const { currentChat } = useSelector((store) => store.AppReducer);
  const color = useTheme().palette.primary;

  const containerRef = useRef(null);
  const friendDetails = getFriendDetailsFromChat(currentChat.users, user);

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Update state when the image is fully loaded
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    // Scroll to the bottom when messages change

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    // return () => {
    //   setIsImageLoaded(false);
    // };
  }, [messages, typing]);

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowY: "auto",
        // maxHeight: "300px", // Adjust the maximum height of the chat container as needed
        // maxHeight: "calc(100% - 60px)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <Box
        backgroundColor="#fef1bd"
        color="black"
        width={"fit-content"}
        padding={"4px"}
        borderRadius={"8px"}
        margin="auto"
        marginBottom={"20px"}
      >
        <Typography>
          <span style={{ marginRight: "4px" }}>
            <HiLockClosed />
          </span>
          <span>Messages you send to this chat are secure.</span>
        </Typography>
      </Box>

      {messages.map((message, index) => (
        <Box key={index}>
          {message.image && (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender._id === user.userId
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px",
                alignItems: "flex-end",
                gap: "10px",
              }}
            >
              {!isImageLoaded && (
                <Skeleton
                  variant="rectangular"
                  width={118}
                  height={210}
                  sx={{
                    borderRadius:
                      message.sender._id === user.userId
                        ? "12px 12px 0 12px"
                        : "12px 12px 12px 0",
                  }}
                />
              )}
              <img
                src={message.image}
                alt="Uploaded"
                style={{
                  maxWidth: "200px",
                  maxHeight: "200px",
                  marginTop: "10px",
                  display: isImageLoaded ? "inline-block" : "none",
                  borderRadius:
                    message.sender._id === user.userId
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                }}
                onLoad={handleImageLoad}
              />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent:
                message.sender._id === user.userId ? "flex-end" : "flex-start",
              marginBottom: "10px",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            {message.sender._id === user.userId &&
              message._id === hoveredId && (
                <Typography fontSize={"12px"}>
                  {getFormatedDate(message.createdAt)}
                </Typography>
              )}
            {message.content && (
              <Paper
                sx={{
                  backgroundColor:
                    message.sender._id === user.userId ? color.main : "#fff",
                  padding: "8px",
                  borderRadius:
                    message.sender._id === user.userId
                      ? "12px 12px 0 12px"
                      : "12px 12px 12px 0",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  maxWidth: "60%",
                }}
                onMouseEnter={() => {
                  setHoveredId(message._id);
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                }}
              >
                <Typography
                  color={message.sender._id === user.userId ? "white" : "black"}
                  sx={{
                    wordWrap: "break-word", // Allow words to break and wrap onto the next line
                    whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
                    textAlign: "left",
                  }}
                >
                  {message.content}
                </Typography>
              </Paper>
            )}
            {message.sender._id !== user.userId &&
              message._id === hoveredId && (
                <Typography fontSize={"12px"}>
                  {getFormatedDate(message.createdAt)}
                </Typography>
              )}{" "}
          </Box>
        </Box>
      ))}
      {typing && userTyping.userId === friendDetails._id && (
        <Typography textAlign={"left"}>{`${getFirstName(
          friendDetails.name
        )} is typing...`}</Typography>
      )}
    </Box>
  );
};

export default ChatBox;
