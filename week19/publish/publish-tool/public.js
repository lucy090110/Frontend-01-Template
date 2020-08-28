const http = require("http");
const querystring = require("querystring");
const fs = require("fs");
const archiver = require("archiver");
const child_process = require("child_process");

const packname = "./package";

const redirect_uri = encodeURIComponent("http://localhost:3001/auth?id=123");
child_process.exec(
  `open https://github.com/login/oauth/authorize?client_id=Iv1.45f562f3911a075e&redirect_uri=${redirect_uri}&user=read:%3Auser&state=123abc`
);

const server = http.createServer((request, res) => {
  const matched = request.url.match(/token=([^&]+)/);
  const token = matched && matched[1];
  console.log("real publish", token);
  const options = {
    host: "localhost" || "127.0.0.1",
    port: 3001,
    path: "/?filename=" + "package.zip",
    method: "POST",
    headers: {
      token: token,
      "Content-Type": "application/octet-stream",
    },
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
  });

  req.on("error", (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.directory(packname, false);
  archive.finalize();

  archive.pipe(req);

  archive.on("end", () => {
    req.end();
    console.log("publish success!!");
    res.end("publish success!!");
    server.close();
  });
});

server.listen(3000);

// 将数据写入请求主体。
// const readStream = fs.createReadStream("./cat.jpg");
// readStream.pipe(req);
// readStream.on("end", () => {
//   req.end();
// });
