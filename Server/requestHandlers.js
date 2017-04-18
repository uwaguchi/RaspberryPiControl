var fs = require("fs");

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

function api_raspimessage_request(query, response) {
  // とりあえずテスト
  response.writeHead(200, {"Content-type": "text/plain"});
  response.write("raspimessage_request api was called.");
  response.write(JSON.stringify(query));
  response.end();
}

exports.raspicontrol = raspicontrol;
exports.api_raspimessage_request = api_raspimessage_request;
