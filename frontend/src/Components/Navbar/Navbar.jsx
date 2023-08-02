import React, { useState } from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import { IoCaretDownOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import SearchModal from "../SearchModal/SearchModal";
import { userLogout } from "../../Redux/AuthReducer/action";
import socket from "../../Config/socketio";
import { clearData } from "../../Redux/AppReducer/action";
import MenuDrawer from "../Drawer/MenuDrawer";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@emotion/react";
import { getFormantedName } from "../../utils/commonFun/getFormatedName";
import UserProfileModal from "../ProfileModal/ProfileModal";

const styles = {
  navbarContainer: {
    backgroundColor: "#ffffff",
    boxShadow: "none",
    borderBottom: "1px solid #e0e0e0",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
    position: "sticky",
    top: 0,
    zIndex: "9",
  },
  navbarSearchContainer: {
    display: "flex",
    alignItems: "center",
  },
  navbarContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  icon: {
    fontSize: "24px",
    cursor: "pointer",
  },
};

const Navbar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { user } = useSelector((store) => store.AuthReducer);
  const dispatch = useDispatch();
  const theme = useTheme();

  // State to manage the open state of the menu
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    window.location.reload();
    socket.emit("logout");
    socket.disconnect();
    dispatch(userLogout());
    dispatch(clearData());
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    // Show the user profile modal
    setShowProfileModal(true);
  };

  const handleProfileModalClose = () => {
    // Hide the user profile modal
    setShowProfileModal(false);
    setAnchorEl(null);
  };

  return (
    <Paper
      style={{
        ...styles.navbarContainer,
        backgroundColor: theme.palette.background.paper,
        borderBottom: theme.palette.border,
      }}
    >
      <Box style={styles.navbarSearchContainer}>
        {/* <MenuDrawer /> */}
        <SearchModal />
        <p>Find Friends</p>
      </Box>
      <Box style={styles.navbarContent}>
        <img
          src={user.avatar}
          alt="Display icon"
          style={{ borderRadius: "50%", height: "50px", width: "50px" }}
        />
        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
          {getFormantedName(user.name)}
        </Typography>
        {/* IoCaretDownOutline Icon with onClick to open the menu */}
        <IoCaretDownOutline style={styles.icon} onClick={handleMenuOpen} />

        {/* Menu component */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* Menu items */}
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <UserProfileModal
          user={user}
          open={showProfileModal}
          onClose={handleProfileModalClose}
        />
      </Box>
    </Paper>
  );
};

export default Navbar;
