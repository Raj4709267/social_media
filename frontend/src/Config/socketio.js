// src/socket.js
import io from "socket.io-client";
import { baseURL } from "./CommonConfig";

const socket = io(baseURL); // Replace with your server URL

export default socket;
