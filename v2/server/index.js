const LISTEN_PORT = 9999;

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (client) => {
  console.log("client connected", client);
  client.on("disconnect", () => {
    console.log("client disconnected");
  });
});
httpServer.listen(LISTEN_PORT);

function update() {
  io.emit("onUpdate");
}

setInterval(update, 1000 / 60);
