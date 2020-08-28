const http = require("http");
const fs = require("fs");
const unzip = require("unzipper");
const https = require("https");

const server = http.createServer((req, res) => {
  const matched = req.url.match(/^\/auth/);

  if (matched) {
    return auth(req, res);
  }

  if (!req.url.match(/^\/?/)) {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });
    res.end("not found");
    return;
  }

  const options = {
    hostname: "api.github.com",
    port: 443,
    path: `/user`,
    method: "GET",
    headers: {
      Authorization: "token " + req.headers.token,
      "User-Agent": "toy-publish-server",
    },
  };

  const request = https.request(options, (response) => {
    let body = "";
    response.on("data", (re) => {
      body += re.toString();
    });
    response.on("end", () => {
      const user = JSON.parse(body);
      
      // 权限检查
      let writeStream = unzip.Extract({ path: "../server/public" });
      req.pipe(writeStream);

      // // 等同于  req.pipe
      // req.on("data", (trunk) => {
      //   writeStream.write(trunk);
      // });
      // req.on("end", (trunk) => {
      //   writeStream.end(trunk);
      // });

      res.on("end", () => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("okay");
      });
    });
  });

  request.on("error", (e) => {
    console.log(e);
  });

  request.end();
});

function auth(req, res) {
  const code = req.url.match(/code=([^&]+)/)[1];
  const state = "123abc";
  const client_secret = "e0406553fd6e84108cc05b52b3cf6b055f9987e1";
  const client_id = "Iv1.45f562f3911a075e";
  const redirect_uri = encodeURIComponent("http://localhost:3001/auth");
  const params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  const url = `https://github.com/login/oauth/access_token?${params}`;

  const options = {
    hostname: "github.com",
    port: 443,
    path: `/login/oauth/access_token?${params}`,
    method: "POST",
  };

  const request = https.request(options, (response) => {
    response.on("data", (re) => {
      const result = re.toString().match(/access_token=([^&]+)/);
      if (result) {
        const token = result && result[1];
        res.writeHead(200, {
          access_token: token,
          "Content-Type": "text/html",
        });
        const target = `http://localhost:3000/publish?token=${token}`;
        res.end(`<a href="${target}">publish</a>`);
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end("error");
      }
    });
  });

  request.on("error", (e) => {
    console.log(e);
  });

  request.end();

  // res.writeHead(200, { "Content-Type": "text/plain" });
  // res.end("okay");
}

server.listen(3001);
