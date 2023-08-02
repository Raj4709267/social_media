import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  IconButton,
  InputBase,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FaRegCommentDots } from "react-icons/fa6";
import { getFormatedDate } from "../../utils/commonFun/getFormatedDate";
import PostFeedItem from "../PostFeedItem/PostFeedItem";
import { baseURL } from "../../Config/CommonConfig";
import { getFirstName } from "../../utils/commonFun/getFirstName";
import { AiOutlineClose } from "react-icons/ai";
import { RiSendPlaneLine } from "react-icons/ri";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const postButtonStyle = {
  marginLeft: "auto",
};

const commentStyle = {
  padding: "8px",
  borderRadius: "12px",
  width: "fit-content",
};
const commenterNameStyle = {
  fontWeight: "bold",
};

const commentDateStyle = {
  fontSize: "0.8rem",
  color: "#777",
  width: "auto",
};
const CommentModal = ({
  handleClose,
  handleOpen,
  open,
  post,
  handleLikePost,
  setRefetchPost,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const { user } = useSelector((store) => store.AuthReducer);
  const theme = useTheme();

  // Create a ref for the container that holds the comments
  const postFeedItemRef = useRef(null);

  const scrollToBottom = () => {
    if (postFeedItemRef.current) {
      postFeedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const handleCommentSubmit = () => {
    // Add logic to handle comment submission
    if (commentText.trim() === "") {
      return; // Don't add empty comments
    }

    const newComment = {
      content: commentText.trim(),
      commenterId: user.userId, // Replace with the actual user who commented
      postId: post._id,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .post(`${baseURL}/comment/add`, newComment, config)
      .then((res) => {
        getAllComments();
      })
      .catch((err) => {
        console.log(err);
      });

    setCommentText("");
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const getAllComments = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get(`${baseURL}/comment/${post._id}`, config)
      .then((res) => {
        setComments(res.data);
        scrollToBottom();
        setRefetchPost((pre) => !pre);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (open) {
      getAllComments();
    }
    return () => {
      setCommentText("");
      setComments([]);
    };
  }, [open]);

  return (
    <div>
      <Button
        variant="text"
        startIcon={<FaRegCommentDots />}
        onClick={handleOpen}
        sx={{
          color:
            theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.87)" : "#fff",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: theme.palette.background.extra,
          },
        }}
      >
        Comment
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        BackdropComponent={Backdrop} // Use Backdrop component for the blurred background
        BackdropProps={{
          // Style the Backdrop with backdropFilter to create blur effect
          sx: { backdropFilter: "blur(8px)" },
        }}
      >
        <Box sx={style}>
          {/* Top fixed section */}
          <Box
            position="sticky"
            top={0}
            zIndex={1}
            p={2}
            borderBottom={theme.palette.border}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontSize={"1.5rem"} fontWeight={"bold"}>
              {getFirstName(post.user.name)}'s post
            </Typography>
            <IconButton onClick={handleClose}>
              <AiOutlineClose />
            </IconButton>
          </Box>

          {/* Scrollable content section */}
          <Box overflow="auto" maxHeight="60vh" p={2}>
            {/* Display the post feed item once */}
            <PostFeedItem
              key={post._id}
              post={post}
              handleLikePost={handleLikePost}
              setRefetchPost={setRefetchPost}
              fromModal={true}
              ref={postFeedItemRef}
            />

            {/* Display comments */}
            {comments.length > 0 ? (
              <Box mt={2}>
                {comments &&
                  comments.map((comment) => (
                    <Box
                      key={comment._id}
                      display={"flex"}
                      gap="12px"
                      justifyContent={"flex-start"}
                      alignItems={"flex-start"}
                      marginTop="14px"
                    >
                      {/* Commenter avatar */}
                      <Avatar
                        alt={comment.commenterId.name}
                        src={comment.commenterId.avatar}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Box
                          elevation={2}
                          style={commentStyle}
                          backgroundColor={theme.palette.background.extra}
                        >
                          {/* Commenter name */}
                          <Typography
                            variant="body1"
                            style={commenterNameStyle}
                          >
                            {getFirstName(comment.commenterId.name)}
                          </Typography>

                          {/* Comment content */}
                          <Typography variant="body2">
                            {comment.content}
                          </Typography>
                        </Box>
                        {/* Comment date */}
                        <Typography variant="caption" style={commentDateStyle}>
                          {getFormatedDate(comment.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            ) : (
              <Typography textAlign={"center"} margin={"30px 0"}>
                No Comments
              </Typography>
            )}
          </Box>

          {/* Bottom fixed section */}
          <Box borderTop={theme.palette.border} p={2}>
            <Box
              display={"flex"}
              alignItems={"center"}
              backgroundColor={theme.palette.background.extra}
              padding="8px 12px"
              borderRadius={"16px"}
            >
              <Box width={"100%"}>
                <InputBase
                  fullWidth
                  placeholder="Write a comment"
                  value={commentText}
                  onChange={handleCommentChange}
                />
              </Box>

              <IconButton
                color="primary"
                style={postButtonStyle}
                onClick={handleCommentSubmit}
              >
                <RiSendPlaneLine />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CommentModal;
