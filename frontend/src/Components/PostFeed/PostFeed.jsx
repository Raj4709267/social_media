import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/config";
import {
  Badge,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { baseURL } from "../../Config/CommonConfig";
import { useSelector } from "react-redux";
import PostFeedItem from "../PostFeedItem/PostFeedItem";
import { useTheme } from "@emotion/react";
import { RiAttachmentLine, RiCloseLine, RiSendPlaneLine } from "react-icons/ri";
import { getFirstName } from "../../utils/commonFun/getFirstName";
import { MdSend } from "react-icons/md";
import Setting from "../../pages/Setting/Setting";
import style from "./PostFeed.module.css";

const PostFeed = () => {
  const [postText, setPostText] = useState("");
  const [imageUploading, setImageUploading] = useState(null);
  const [postItems, setPostItems] = useState([]);
  const [refetchPost, setRefetchPost] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadPercent, setUploadPercent] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // State to track image loading
  const [imageAdded, setImageAdded] = useState(false);
  const [isPostSending, setIsPostSending] = useState(false);

  const { user } = useSelector((store) => store.AuthReducer);
  const theme = useTheme();

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setImageUploading(percent);
          setUploadPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageUrl(url);
            setUploadPercent(100);
          });
        }
      );
    }
  };

  const handlePostSubmit = () => {
    const payload = { content: postText, file: imageUrl, comment: "" };
    if (!postText && !imageUrl) {
      return;
    }
    setIsPostSending(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .post(`${baseURL}/post/add`, payload, config)
      .then((res) => {
        handleGetPosts();
        setIsPostSending(false);
      })
      .catch((err) => {
        console.log(err);
        setIsPostSending(false);
      });
    setPostText("");
    setImageUrl(null);
    setImageUploading(null);
  };

  const handleGetPosts = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .get(`${baseURL}/post`, config)
      .then((res) => {
        setPostItems(res.data);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLikePost = (postId) => {
    const alreadyLiked = postItems.filter(
      (item) => item._id === postId && item.likes.includes(user.userId)
    );
    if (alreadyLiked.length === 0) {
      const newPostItems = postItems.map((item) =>
        item._id === postId
          ? { ...item, likes: [...item.likes, user.userId] }
          : item
      );
      setPostItems(newPostItems);
    } else {
      const newPostItems = postItems.map((item) =>
        item._id === postId
          ? {
              ...item,
              likes: item.likes.filter((item) => item !== user.userId),
            }
          : item
      );
      setPostItems(newPostItems);
    }
    // setRefetchPost((pre) => !pre);
  };

  const handleRemoveImage = () => {
    setOpenImageDialog(false);
    setUploadPercent(null);
    setImageUrl("");
    setIsImageLoaded(false);
    setImageAdded(false); // Reset the imageAdded state when removing the image
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setUploadPercent(null);
    setImageUrl("");
    setIsImageLoaded(false);
    if (!isPostSending) {
      setIsImageLoaded(false); // Reset the isImageLoaded state when the dialog is closed
    }
  };
  const handleAddImage = () => {
    setOpenImageDialog(false);
    setImageAdded(true);
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true); // Update state when the image is fully loaded
  };
  useEffect(() => {
    handleGetPosts();
  }, [refetchPost]);
  console.log(theme.palette);
  return (
    <>
      <Box className={style.chat_container}>
        <Box width="100%">
          <Paper
            style={{
              boxShadow: "none",
              border: theme.palette.border,
              padding: "8px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px",
                borderRadius: "8px",
                marginBottom: "16px",
                gap: "20px",
              }}
            >
              <Avatar src={user.avatar} />
              <Box
                width={"100%"}
                backgroundColor={theme.palette.background.extra}
                style={{ borderRadius: "24px", padding: "8px" }}
              >
                <InputBase
                  sx={{ flex: 1 }}
                  multiline
                  maxRows={3}
                  fullWidth
                  placeholder={`What's on your mind. ${getFirstName(
                    user.name
                  )}?`}
                  value={postText}
                  onChange={handleTextChange}
                />
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: theme.palette.border,
                paddingTop: "8px",
              }}
            >
              {/* Option to open the image picker */}
              <IconButton onClick={() => setOpenImageDialog(true)}>
                <Badge
                  badgeContent={isImageLoaded && imageAdded ? 1 : null}
                  color="error"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <RiAttachmentLine />
                </Badge>
              </IconButton>

              {/* Send button */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handlePostSubmit();
                  handleRemoveImage();
                  setPostText("");
                }}
                disabled={isPostSending}
                style={{ marginLeft: "10px" }}
              >
                {isPostSending ? (
                  <CircularProgress size={24} />
                ) : (
                  <MdSend size={"20px"} />
                )}
              </Button>
            </Box>
          </Paper>

          <Dialog open={openImageDialog} onClose={handleCloseImageDialog}>
            <DialogTitle>Select an Image</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {/* Add your image picker component or input here */}
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  gap={"20px"}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {uploadPercent && !isImageLoaded && !imageUrl && (
                    <>
                      <CircularProgress
                        variant="determinate"
                        value={uploadPercent}
                        size={30}
                      />
                      <span>{uploadPercent}%</span>
                      <span>Uploading...</span>
                    </>
                  )}

                  {uploadPercent === 100 && imageUrl && (
                    <>
                      {!isImageLoaded && (
                        <CircularProgress
                          size={30}
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          marginTop: "10px",
                          display: isImageLoaded ? "inline-block" : "none",
                        }}
                        onLoad={handleImageLoad}
                      />
                    </>
                  )}
                  {imageUrl && isImageLoaded && (
                    // Show the cross button if an image is selected
                    <IconButton
                      onClick={handleRemoveImage}
                      // style={{ marginBottom: "-28px" }}
                    >
                      <RiCloseLine />
                    </IconButton>
                  )}
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseImageDialog}>Cancel</Button>
              <Button onClick={handleAddImage} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {postItems &&
            postItems.map((post) => (
              <PostFeedItem
                key={post._id}
                post={post}
                handleLikePost={handleLikePost}
                setRefetchPost={setRefetchPost}
              />
            ))}
        </Box>
        <Box className={style.setting_component}>
          <Setting />
        </Box>
      </Box>
    </>
  );
};

export default PostFeed;
