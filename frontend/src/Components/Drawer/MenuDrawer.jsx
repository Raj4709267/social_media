import { Button, Drawer } from "@mui/material";
import React from "react";
import Sidebar from "../Sidebar/Sidebar";

const MenuDrawer = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (value) => {
    setOpen(value);
  };
  return (
    <div>
      <Button onClick={() => toggleDrawer(true)}>drawer</Button>
      <Drawer anchor={"left"} open={open} onClose={() => toggleDrawer(false)}>
        okkk
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
