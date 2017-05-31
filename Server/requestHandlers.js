var fs = require("fs");
var send2Raspi = require('./sendMessage2Raspi');

function raspicontrol(query, response) {

  function writeHTMLFile(err, html) {
    if(err) {
      response.writeHead(404, {"Content-type": "text/plain"});
      response.write("File not found.");
      response.end();
    } else {
      response.writeHead(200, {"Content-type": "text/html"});
      response.write(html);
      response.end();
    }
  }

  console.log("Request handler 'raspicontrol' was called.");
  fs.readFile("/home/uwaguchi/RaspberryPiControl/Server/raspicontrol.html", "utf8", writeHTMLFile);
}

function raspicontrol_login(query, response) {

  function writeHTMLFile(err, html) {
    if(err) {
      response.writeHead(404, {"Content-type": "text/plain"});
      response.write("File not found.");
      response.end();
    } else {
      response.writeHead(200, {"Content-type": "text/html"});
      response.write(html);
      response.end();
    }
  }

  console.log("Request handler 'raspicontrol' was called.");
  fs.readFile("/home/uwaguchi/RaspberryPiControl/Server/raspicontrol_login.html", "utf8", writeHTMLFile);
}

function api_raspimessage_request(query, response) {
  // とりあえずテスト
  response.writeHead(200, {"Content-type": "text/plain"});
  response.write("raspimessage_request api was called.");
  response.write(JSON.stringify(query));
  response.end();
}


function api_raspimessage_capture(query, response) {
  // 画像キャプチャー
  send2Raspi.sendMessage2Raspi('GetCapture', null).then(function(res) {

    response.writeHead(200, {"Content-type": "text/plain"});
    response.write("raspimessage_capture api was called.");
    response.write(JSON.stringify(res));
    response.end();
  }).catch(function(err) {
    // エラー発生
    console.log(err);
    response.writeHead(500, {"Content-type": "text/plain"});
    response.write("api internal error.");
    response.end();
  });
}

function api_raspimessage_sendirkit(query, response) {
  // IRKitへのコマンド送信
  send2Raspi.sendMessage2Raspi('SendIRKit', query['action']).then(function(res) {

    response.writeHead(200, {"Content-type": "text/plain"});
    response.write("raspimessage_sendirkit api was called.");
    response.write(JSON.stringify(res));
    response.end();
  }).catch(function(err) {
    // エラー発生
    console.log(err);
    response.writeHead(500, {"Content-type": "text/plain"});
    response.write("api internal error.");
    response.end();
  });
}

// エクスポート
exports.raspicontrol = raspicontrol;
exports.raspicontrol_login = raspicontrol_login;
exports.api_raspimessage_request = api_raspimessage_request;
exports.api_raspimessage_capture = api_raspimessage_capture;
exports.api_raspimessage_sendirkit = api_raspimessage_sendirkit;
