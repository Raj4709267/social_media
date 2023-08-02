import React from "react";
import {
  Modal,
  Backdrop,
  Box,
  Fade,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { useTheme } from "@emotion/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "300px",
  bgcolor: "background.paper",
  boxShadow: 24,
  display: "flex",
};

const DeleteConfirmationModal = ({ open, onClose, onDelete }) => {
  const theme = useTheme();

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: { backdropFilter: "blur(8px)" },
      }}
    >
      <Box sx={style} textAlign={"center"} padding={"16px 24px"}>
        <Box>
          <Box marginBottom={"20px"} textAlign={"right"}>
            <IconButton onClick={onClose}>
              <AiOutlineClose />
            </IconButton>
          </Box>
          <Typography variant="h5" gutterBottom>
            Are you sure you want to delete?
          </Typography>
          <Box mt={3} display={"flex"} justifyContent={"flex-end"} gap="16px">
            <Button variant="contained" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" variant="contained" onClick={handleDelete}>
              {" "}
              {/* Use the 'deleteButton' class from the CSS module */}
              Delete
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
