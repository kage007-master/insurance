import React from "react";
import socketio from "socket.io-client";

const socket = socketio.connect("http://195.201.163.171:8001/");

export { socket };
export const SocketContext = React.createContext();
