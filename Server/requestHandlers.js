var exec = require("child_process").exec;

function raspicontrol(response) {
  console.log("Request handler 'raspicontrol' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<h3>いろいろコントロールページ</h3>'+
    '<h4>いまの様子</h4>'+
    '<p><input type="button" value="いまの様子をみる"></p>'+
    '<h4>テレビ</h4>'+
    '<p><input type="button" value="Eテレをつける"></p>'+
    '<p><input type="button" value="NHKをつける"></p>'+
    '<p><input type="button" value="テレビを消す"></p>'+
    '<h4>エアコン</h4>'+
    '<p><input type="button" value="冷房をつける"></p>'+
    '<p><input type="button" value="暖房をつける"></p>'+
    '<p><input type="button" value="エアコンを消す"></p>'+
    '</body>'+
    '</html>';


  response.write(body);
  response.end();
}

exports.raspicontrol = raspicontrol;
