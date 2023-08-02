import React, { useEffect } from "react";
import socket, { logoutAndReconnect } from "../../Config/socketio";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChats } from "../../Redux/AppReducer/action";

const Welcome = () => {
  const { user } = useSelector((store) => store.AuthReducer);
  const dispatch = useDispatch();
  console.log(user);
  useEffect(() => {
    console.log("seggingglksdl");
    console.log(socket.connected);
    socket.emit("setup", user);

    // socket.on("recived message", (kk) => {
    //   console.log("message");
    // });

    socket.on("getActiveUsers", (activeUsers) => {
      console.log(user.userId);
      console.log("activeUsers", activeUsers);
      const activeIds = activeUsers.map((item) => item.userId);
      dispatch(setActiveChats(activeIds));
    });
  }, []);

  return <div>Welcome</div>;
};

export default Welcome;
