import SocketIO from "socket.io";

class Socket {
  private socket!: SocketIO.Server;
  init(httpServer: any) {
    this.socket = new SocketIO.Server(httpServer, {
      cors: { methods: ["GET", "POST"] },
    });
  }
  broadcast() {
    this.socket.emit("notification");
  }
}

const socket = new Socket();

export default socket;
