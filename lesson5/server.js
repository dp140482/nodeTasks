const http = require("http");
const fs = require("fs");
const { join } = require("path");
const port = 5555;
const path = process.cwd();

const showFileOrDir = (path, url) => {
    if (fs.existsSync(path)) {
        if (fs.lstatSync(path).isFile()) {
            return { flag: "FILE", text: fs.readFileSync(path, "utf-8") };
        } else {
            const fileList = fs.readdirSync(path);
            let textRes = "<html>\n<body>\n<ul>\n";
            textRes += fileList.map(record => {
                const link = `<a href="${join(url, record)}">${record}</a>`;
                return "<li>" + link + "</li>";
            }).join("\n");
            textRes += "\n</ul>\n</body>\n</html>";
            return { flag: "DIR", text: textRes };
        }
    } else {
        return {
            flag: "ENOENT", text: `File not found.
        Type http://localhost:${port} for interactive browse from current folder.`
        };
    }
};

const server = http.createServer((req, res) => {
    const fsRes = showFileOrDir(join(path, req.url), req.url);
    if (fsRes.flag === "ENOENT") {
        res.writeHead(404, "File not found");
    } else if (fsRes.flag === "DIR") {
        res.writeHead(200, "OK", { "Content-Type": "text/html" });
    } else {
        res.writeHead(200, "OK");
    }
    res.end(fsRes.text);
});

server.listen(port);