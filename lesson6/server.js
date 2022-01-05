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
let activeUsers = [];
let users = [];
let usersID = [];

socket.on("connection", socket => {
    console.log("New connection: " + socket.id);

    socket.on("NEW_USER", userName => {
        if (!users.includes(userName)) {
            users.push(userName);
            activeUsers.push(userName);
            usersID.push(socket.id);
            console.log("New client: " + userName + " (" + socket.id + ")");
            socket.broadcast.emit("NEW_CONN_EVENT", {
                msg: "Client " + userName + " connected",
                users: activeUsers
            });
            socket.emit("NEW_CONN_EVENT", {
                msg: "I am connected",
                users: activeUsers
            });
        } else {
            console.log("Client " + userName + " returns with id " + socket.id);
            activeUsers.push(userName);
            const index = users.indexOf(userName);
            if (socket.id !== usersID[index]) {
                socket.emit("RECONN_EVENT", {
                    msg: "Client " + userName + " reconnected",
                    users: activeUsers
                });
                socket.broadcast.emit("RECONN_EVENT", {
                    msg: "Client " + userName + " reconnected",
                    users: activeUsers
                });
                usersID[index] = socket.id;
                console.log("Client " + userName + " reconnected");
            }
        }
    });

    socket.on("CLIENT_MSG", data => {
        socket.emit("SERVER_MSG", { msg: "I wrote: " + data.msg });
        const userName = users[usersID.indexOf(socket.id)];
        socket.broadcast.emit("SERVER_MSG", { msg: userName + ": " + data.msg });
    });

    socket.on("disconnect", reason => {
        console.log("Connection " + socket.id + " finished: " + reason);
        const userName = users[usersID.indexOf(socket.id)];
        const index = activeUsers.indexOf(userName);
        activeUsers.splice(index, 1);
        if (userName) {
            socket.broadcast.emit("DISCONN_EVENT", {
                msg: "Client " + userName + " disconnected: " + reason,
                users: activeUsers
            });
            socket.emit("DISCONN_EVENT", {
                msg: "I am disconnected: " + reason,
                users: activeUsers
            });
        }
    });
});

server.listen(port, "localhost");