var url = `https://github.com/login/oauth/authorize?client_id=Iv1.45f562f3911a075e&redirect_uri=${encodeURIComponent(
  "http://localhost:8000"
)}&user=read:%3Auser&state=123abc`;
console.log(url);

const code = "3fc22251019513bbcf65";
const state = "123abc";
const client_secret = "e0406553fd6e84108cc05b52b3cf6b055f9987e1";
const client_id = "Iv1.45f562f3911a075e";
const redirect_uri = encodeURIComponent("http://localhost:8000");
const params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
const request_url = `https://github.com/login/oauth/access_token?${params}`;

function request(url, method) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest();
  } else {
    // IE6, IE5 浏览器执行代码
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("===响应===", xmlhttp.responseText);
    }
  };
  
  xmlhttp.open(method, url, true);
  xmlhttp.setRequestHeader("Authorization","")
  xmlhttp.send();
}

function request(url, method) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
    //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest();
  } else {
    // IE6, IE5 浏览器执行代码
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log("===响应===", xmlhttp.responseText);
    }
  };
  
  xmlhttp.open(method, url, true);
  xmlhttp.setRequestHeader("Authorization","token d00bdd5d3f1605db80460a0747f07284850d1e40")
  xmlhttp.send();
}

request("https://api.github.com/user", "GET");
