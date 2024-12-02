import Express from "express";
import http from "http";
import startSocketServer from "./socket.js";

const app = Express();
const server = http.createServer(app);
const port = 5000;

app.use("/", Express.static("client"));
server.listen(port, () => console.log("Server running on port " + port));
startSocketServer(server);