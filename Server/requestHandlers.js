var fs = require("fs");

function raspicontrol(response) {

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

exports.raspicontrol = raspicontrol;
