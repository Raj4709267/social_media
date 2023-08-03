import { Button, Drawer, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import style from "./MenuDrawer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer, openDrawer } from "../../Redux/AppReducer/action";
import { RxHamburgerMenu } from "react-icons/rx";

const MenuDrawer = () => {
  // const [open, setOpen] = React.useState(false);

  // const toggleDrawer = (value) => {
  //   setOpen(value);
  // };\
  useEffect(() => {
    console.log("collingina df");
  }, []);
  const dispatch = useDispatch();
  const { isOpenDrawer } = useSelector((store) => store.AppReducer);
  return (
    <div className={style.menu_drawer}>
      <IconButton onClick={() => dispatch(openDrawer())}>
        <RxHamburgerMenu />
      </IconButton>
      <Drawer
        anchor={"left"}
        open={isOpenDrawer}
        onClose={() => dispatch(closeDrawer())}
      >
        <Sidebar fromDrawer={true} />
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
