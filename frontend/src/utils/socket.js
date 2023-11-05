import React from "react";
import socketio from "socket.io-client";

const socket = socketio.connect("https://weatherchain.ca/");

export { socket };
export const SocketContext = React.createContext();
