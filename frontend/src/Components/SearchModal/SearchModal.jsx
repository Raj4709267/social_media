import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { IoSearch, IoCloseOutline } from "react-icons/io5";
import { Backdrop, IconButton, TextField } from "@mui/material";
import "./SearchModal.css";
import { useDispatch, useSelector } from "react-redux";
import { baseURL } from "../../Config/CommonConfig";
import axios from "axios";
import { createChat } from "../../Redux/AppReducer/action";
import { useTheme } from "@emotion/react";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const { user } = useSelector((store) => store.AuthReducer);
  const [resultUsers, setResultUsers] = React.useState([]);
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSearchText("");
    setResultUsers([]);
  };

  const handleInput = (e) => {
    setSearchText(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = async (query) => {
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      let res = await axios.get(`${baseURL}/users?search=${query}`, config);
      setResultUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateChat = (id) => {
    dispatch(createChat({ friendUserId: id, userId: user.userId }, user.token));
    handleClose();
  };

  React.useEffect(() => {
    if (open) {
      handleSearch();
    }
  }, [open]);
  return (
    <div>
      <div onClick={handleOpen}>
        <IconButton>
          <IoSearch color={theme.palette.primary.main} />
        </IconButton>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropComponent={Backdrop} // Use Backdrop component for the blurred background
        BackdropProps={{
          // Style the Backdrop with backdropFilter to create blur effect
          sx: { backdropFilter: "blur(8px)" },
        }}
      >
        <Box sx={style}>
          <Typography textAlign={"right"}>
            <IoCloseOutline
              fontSize={"2rem"}
              cursor={"pointer"}
              onClick={handleClose}
            />
          </Typography>
          <Box>
            <TextField
              type="text"
              label="Search Friends"
              value={searchText}
              onChange={(e) => {
                handleInput(e);
              }}
              fullWidth
              margin="normal"
              required={true}
              placeholder="Enter email or name"
            />

            <div className="search-result-container">
              {resultUsers?.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="single-result-box"
                    onClick={() => handleCreateChat(item._id)}
                  >
                    <img src={item.avatar} alt="Display icon" />
                    {item.name}
                  </div>
                );
              })}
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
