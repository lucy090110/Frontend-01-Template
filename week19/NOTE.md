# 每周总结可以写在这里

## 工具链

### 安装yeoman

```bash
npm install -g yo
```

### 安装yeoman-generator

```bash
npm i yeoman-generator
```

>
  复制文件以及安装相关依赖

```js
  writing() {
    // 复制文件
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { title: this.answers.title } // user answer `title` used
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc")
    );
    this.fs.copyTpl(
      this.templatePath(".babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copyTpl(
      this.templatePath("util.js"),
      this.destinationPath("src/lib/util.js")
    );
    this.fs.copyTpl(
      this.templatePath("gesture.js"),
      this.destinationPath("src/lib/gesture.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.js"),
      this.destinationPath("src/index.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.test.js"),
      this.destinationPath("test/index.test.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: this.answers.title } // user answer `title` used
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("config/webpack.config.js")
    );

    // 安装依赖
    this.npmInstall(
      [
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@babel/core",
        "@babel/preset-env",
        "@babel/plugin-transform-react-jsx",
        "babel-loader",
        "clean-webpack-plugin",
        "html-webpack-plugin",
        "mocha",
        "nyc",
        "babel-plugin-istanbul",
        "@istanbuljs/nyc-config-babel",
        "@babel/register",
      ],
      {
        "save-dev": true,
      }
    );
  }
```

### 新建文件夹tool-example,在当前文件夹执行

```bash
yo generator-tool
```

## 发布系统

### 打包上传

```js
const http = require("http");
const querystring = require("querystring");
const archiver = require("archiver");

const packname = "./package";

const options = {
  host: "localhost" || "127.0.0.1",
  port: 3001,
  path: "/?filename=" + "package.zip",
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream", // 流式传输
  },
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
});

req.on("error", (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 进行文件压缩
const archive = archiver("zip", {
  zlib: { level: 9 },
});

archive.directory(packname, false);
archive.finalize();

archive.pipe(req);

archive.on("end", () => {
  req.end();
});
```

### 接收文件并进行解压

```js
const http = require("http");
const fs = require("fs");
const unzip = require("unzipper");

const server = http.createServer((req, res) => {

  // 将文件加压到指定目录
  let writeStream = unzip.Extract({ path: "../server/public" });

  // 等同于  req.pipe
  req.on("data", (trunk) => {
    writeStream.write(trunk);
  });
  req.on("end",(trunk) => {
    writeStream.end(trunk);
  })

  res.on("end", () => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("okay");
  });
});

server.listen(3001);
```