import React, { useEffect, useState } from "react";
import {
  Modal,
  Backdrop,
  Box,
  Fade,
  IconButton,
  Typography,
  Avatar,
  Button,
  Skeleton,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { useTheme } from "@emotion/react";
import { getFormantedName } from "../../utils/commonFun/getFormatedName";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../Config/CommonConfig";
import style from "./ProfileModal.module.css";

const profileStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "24px",
  borderRadius: "12px",
  textAlign: "center",
};

const UserProfileModal = ({ user, open, onClose }) => {
  const [avatarImage, setAvatarImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const profileUser = useSelector((store) => store.AuthReducer.user);
  const handleImageLoad = () => {
    setImageLoaded(true);
    setShowLoading(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarImage(null);

    if (file) {
      const storageRef = ref(storage, `/avatar/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setUploadPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setAvatarImage(url);
            setImageLoaded(false);
            setShowLoading(true);
          });
        }
      );
    }
  };
  const clearData = () => {
    setAvatarImage(null);
    setImageLoaded(false);
    setUploadPercent(null);
  };
  const handleUpdateChange = () => {
    setUpdateLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const payload = { avatarUrl: avatarImage };
    axios
      .post(`${baseURL}/users/update`, payload, config)
      .then((res) => {
        console.log(res);
        const userData = JSON.parse(
          localStorage.getItem("chatapp_user_details")
        );

        // Check if userData is not null (user data exists in localStorage)
        if (userData && avatarImage) {
          // Update the avatar field with the new image URL
          userData.avatar = avatarImage;
          console.log(userData);
          dispatch({ type: "UPDATE_USER", payload: userData });
          // Store the updated user data back in localStorage
          localStorage.setItem(
            "chatapp_user_details",
            JSON.stringify(userData)
          );
        }
        setUpdateLoading(false);
        onClose();
        clearData();
      })
      .catch((err) => {
        console.log(err);
        setUpdateLoading(false);
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        clearData();
      }}
      closeAfterTransition
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropComponent={Backdrop} // Use Backdrop component for the blurred background
      BackdropProps={{
        // Style the Backdrop with backdropFilter to create blur effect
        sx: { backdropFilter: "blur(8px)" },
      }}
    >
      <Box
        // style={profileStyle}
        backgroundColor={theme.palette.background.paper}
        className={style.profile_modal_container}
      >
        {/* Close icon */}
        <IconButton
          sx={{ position: "absolute", top: 12, right: 12 }}
          onClick={() => {
            onClose();
            clearData();
          }}
        >
          <AiOutlineClose />
        </IconButton>

        <Box display={"flex"} className={style.content_container}>
          {/* Avatar */}
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRight={theme.palette.border}
            padding={"24px 24px 0 0"}
            gap={"24px"}
          >
            <img
              alt={user.name}
              src={avatarImage || user.avatar}
              style={{ width: "150px" }}
              onLoad={handleImageLoad}
              // sx={{ width: 80, height: 80, mb: 2 }}
            />
            {uploadPercent && !avatarImage ? (
              <Typography>Uploading...</Typography>
            ) : null}
            {showLoading ? <Typography>Loading...</Typography> : null}
            {/* Change avatar input */}

            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            {profileUser.userId === user.userId && (
              <label htmlFor="avatar-upload">
                <Button variant="contained" component="span">
                  Change Avatar
                </Button>
              </label>
            )}
          </Box>
          <Box
            textAlign={"left"}
            padding={"24px 0 0 24px "}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box>
              {/* User name */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                {getFormantedName(user.name)}
              </Typography>

              {/* User details */}
              <Typography variant="body1">
                <span style={{ fontWeight: "bold" }}>Email:</span> {user.email}
              </Typography>
            </Box>
            {profileUser.userId === user.userId && (
              <Box textAlign={"right"}>
                <Button
                  variant="contained"
                  disabled={uploadPercent < 100 || !avatarImage || showLoading}
                  onClick={handleUpdateChange}
                >
                  {updateLoading ? "updating..." : "update"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
