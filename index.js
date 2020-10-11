const chalk = require('chalk');

// WEB SOCKETS
const PORT_SOCKET = 9876;
const PORT_LISTEN_OSC = 10000;

const app = require("express")();
const server = app.listen(PORT_SOCKET);
const io = require("socket.io")(server);
const OscReceiver     = require('osc-receiver')

// logging
const log = (str) => {
  console.log(chalk.cyan(str));
}

const error = (str) => {
  console.log(chalk.red(str));
}

const debug = (str) => {
  console.log(chalk.yellow(str));
}


// re-dispatch event from OSC to WebSocket, keep the same event name / data
function dispatch(socket, eventName) {
  socket.on(eventName, function (o) {
    io.emit(eventName, o);
  });
}


// websocket
function _onConnected(socket) {
  debug(`A user is connected : ${socket.id}`);

  socket.on("disconnect", () => _onDisconnected());

  dispatch(socket, "onMouseMove");
}

function _onDisconnected() {
  debug("A user is disconnected");
}


// osc
const receiver = new OscReceiver();
receiver.bind(PORT_LISTEN_OSC);

receiver.on('/mousemove/1', function(x, y) { 
  io.emit('onmousemove', {x, y});
})


// logging
log(`Start Server, WebSocket at port: ${PORT_SOCKET}, OSC at port : ${PORT_LISTEN_OSC}`);


// WebSocket Client side example
/*

const io = require('socket.io-client')
const socket = io('http://localhost:9876')

socket.on('onmousemove', e => {
	console.log('on mousemove', e)
})

*/