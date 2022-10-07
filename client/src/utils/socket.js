const { io } = require("socket.io-client");

export const socket = io(process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : `http://${window.location.hostname}:3000`);