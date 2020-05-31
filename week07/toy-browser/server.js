const http=require('http');
//导入文件模块
const fs=require("fs");

const server=http.createServer(function(req,res){
    console.log('request recived');
    res.setHeader('Content-Type','text/html');
    res.setHeader('X-Foo','bar');
    res.writeHead(200,{'Content-Type':'text/plain'});
    fs.readFile("./index.html","utf-8",function(err,data){
        if(err) {
            console.log("index.html loading is failed :"+err);
        }
        else{
            res.end(data);
        }

    });
});
server.listen(8088);