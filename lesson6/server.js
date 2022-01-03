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

socket.on("connection", socket => {
    console.log('New connection');
    socket.broadcast.emit('NEW_CONN_EVENT', { msg: 'The new client connected' });

    socket.on('CLIENT_MSG', data => {
        socket.emit('SERVER_MSG', { msg: data.msg.split('').reverse().join('') });
    });
});

server.listen(port, "localhost");