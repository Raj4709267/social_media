import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  InputBase,
  CircularProgress,
  Badge,
} from "@mui/material";
import {
  RiEmotionHappyLine,
  RiAttachmentLine,
  RiSendPlaneFill,
  RiSendPlaneLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { MdSend } from "react-icons/md";
import { useSelector } from "react-redux";

const ChatUI = ({ handleSendMessage, isMessageSending, handleTyping }) => {
  const [message, setMessage] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadPercent, setUploadPercent] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // State to track image loading
  const [imageAdded, setImageAdded] = useState(false);

  const { currentChat } = useSelector((store) => store.AppReducer);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `/messagePhoto/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setUploadPercent(percent); // Update the upload percentage
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageUrl(url); // Store the image URL in the state
            setUploadPercent(100); // Set the upload percentage to 100 when completed
          });
        }
      );
    }
    // Do not close the modal or clear selected image when an image is selected
    setIsImageLoaded(false); // Reset the isImageLoaded state when a new image is selected
    setOpenImageDialog(true);
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
    if (!isMessageSending) {
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
    setMessage("");
    handleRemoveImage();
  }, [currentChat]);
  return (
    <>
      {/* Input field for text message */}
      <Box>
        <InputBase
          sx={{ flex: 1 }}
          multiline
          maxRows={3}
          fullWidth
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
        />
      </Box>
      <Box>
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
            handleSendMessage(message, imageUrl);
            handleRemoveImage();
            setMessage("");
          }}
          disabled={isMessageSending}
          style={{ marginLeft: "10px" }}
        >
          {isMessageSending ? (
            <CircularProgress size={24} />
          ) : (
            <MdSend size={"20px"} />
          )}
        </Button>
      </Box>

      {/* Image picker dialog */}
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
                onChange={handleImageSelect}
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
    </>
  );
};

export default ChatUI;
