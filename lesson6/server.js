const http = require("http");
const fs = require("fs");
const io = require("socket.io");
const { join } = require("path");
const port = 5555;

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        const filePath = join(__dirname, "index.html");
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === "POST") {
        let data = "";
        request.on("data", chunk => {
            data += chunk;
        });
        request.on("end", () => {
            response.writeHead(200, { "Content-Type": "json" });
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

const socket = io(server);
let counter = 0;

socket.on("connection", socket => {
    console.log("New connection: " + socket.id);
    counter++;
    socket.broadcast.emit("NEW_CONN_EVENT", {
        msg: "Client " + socket.id + " connected",
        count: counter
    });
    socket.emit("NEW_CONN_EVENT", {
        msg: "I am connected",
        count: counter
    });

    socket.on("CLIENT_MSG", data => {
        socket.emit("SERVER_MSG", { msg: "I wrote: " + data.msg });
        socket.broadcast.emit("SERVER_MSG", { msg: socket.id + ": " + data.msg });
    });

    socket.on("disconnect", reason => {
        console.log("Connection " + socket.id + " finished: " + reason);
        counter--;
        socket.broadcast.emit("DISCONN_EVENT", {
            msg: "Client " + socket.id + " disconnected: " + reason,
            count: counter
        });
        socket.emit("DISCONN_EVENT", {
            msg: "I am disconnected: " + reason,
            count: counter
        });
    });
});

server.listen(port, "localhost");