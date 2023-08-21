import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getFormatedDate } from "../../utils/commonFun/getFormatedDate";
import { baseURL } from "../../Config/CommonConfig";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa"; // Import additional icons
import { PiThumbsUpLight, PiThumbsUpFill } from "react-icons/pi";
import { Box, Paper, Menu, MenuItem, IconButton } from "@mui/material";
import { useTheme } from "@emotion/react";
import CommentModal from "../CommentModal/CommentModal";
import { getFirstName } from "../../utils/commonFun/getFirstName";
import DeleteConfirmationModal from "../DeleteModal/DeleteModal";
import styles from "./PostFeedItem.module.css";

const postHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "8px",
  width: "100%",
};

const postAvatarStyle = {
  marginRight: "8px",
  maxHight: "200px",
};

const PostFeedItem = ({ post, handleLikePost, setRefetchPost, fromModal }) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useSelector((store) => store.AuthReducer);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLike = () => {
    // Add logic to handle like
    handleLikePost(post._id);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const payload = { postId: post._id };
    axios
      .post(`${baseURL}/post/like`, payload, config)
      .then((res) => {
        console.log("post liked");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePostDelete = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const payload = { postId: post._id };
    axios
      .post(`${baseURL}/post/delete`, payload, config)
      .then((res) => {
        console.log("post deleted");
        setRefetchPost((pre) => !pre);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    handleCloseMenu();
    handlePostDelete();
  };

  return (
    <Paper
      style={{
        boxShadow: "none",
        border: !fromModal ? theme.palette.border : null,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "8px",
        borderRadius: !fromModal ? "8px" : "",
        marginBottom: "16px",
      }}
    >
      <div style={postHeaderStyle}>
        <Box display={"flex"} alignItems={"center"}>
          <Avatar style={postAvatarStyle} src={post.user.avatar} />
          <Box textAlign={"left"}>
            <Typography
              variant="subtitle1"
              fontSize={"18px"}
              style={{ marginBottom: "-8px", textAlign: "left" }}
            >
              {getFirstName(post.user.name)}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {getFormatedDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>
        {!fromModal && (
          <div style={{ marginLeft: "auto" }}>
            <IconButton
              onClick={handleClick}
              disabled={post.user._id !== user.userId}
            >
              <FaEllipsisV size={".9rem"} /> {/* Use the FaEllipsisV icon */}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </MenuItem>
              {/* You can add more menu items here if needed */}
            </Menu>
            <DeleteConfirmationModal
              open={showDeleteModal}
              onClose={() => {
                setShowDeleteModal(false);
                setAnchorEl(null);
              }}
              onDelete={handleDeletePost}
            />
          </div>
        )}
      </div>
      {post.content && (
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>
      )}
      {post.file && (
        <Box
          width={"100%"}
          // height={fromModal ? "300px" : "400px"}
          style={{ borderRadius: "8px" }}
          className={
            fromModal
              ? styles.post_file_container_modal
              : styles.post_file_container
          }
        >
          <img
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            src={post.file}
            alt="Post"
          />
          {/* <LazyLoadImage
            // effect="blur"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
            alt={post.file}
            height="200px"
            src={post.file} // use normal <img> attributes as props
            width={"200px"}
          /> */}
        </Box>
      )}

      <Box
        display="flex"
        flexDirection={"column"}
        justifyContent="center"
        width={"100%"}
        height={"100%"}
        marginTop="16px"
      >
        {/* Like and comment count Secition */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
          padding="0 4px 0"
        >
          <Typography
            variant="body2"
            gutterBottom
            style={{ marginLeft: "8px" }}
          >
            {post.likes.length} Likes
          </Typography>

          <Typography
            variant="body2"
            gutterBottom
            style={{ marginLeft: "8px" }}
          >
            {post.comment_count} Comments
          </Typography>
        </Box>

        {/* likes and comment button Section  */}
        <Box
          display="flex"
          alignItems="center"
          borderTop={theme.palette.border}
          justifyContent={"space-between"}
          marginTop={"4px"}
          padding={"4px 20px 0"}
        >
          <Button
            variant="text"
            startIcon={
              post.likes.includes(user.userId) ? (
                <PiThumbsUpFill />
              ) : (
                <PiThumbsUpLight />
              )
            } // Use the FaThumbsUp icon as the start icon
            onClick={handleLike}
            disabled={likeLoading}
            sx={{
              color: post.likes.includes(user.userId)
                ? "primary"
                : theme.palette.mode === "light"
                ? "black"
                : "white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: theme.palette.background.extra,
              },
            }}
          >
            {post.likes.includes(user.userId) ? "Liked" : "Like"}
          </Button>
          <CommentModal
            handleClose={handleClose}
            handleOpen={!fromModal ? handleOpen : () => {}}
            open={open}
            post={post}
            handleLikePost={handleLikePost}
            setRefetchPost={setRefetchPost}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default PostFeedItem;
