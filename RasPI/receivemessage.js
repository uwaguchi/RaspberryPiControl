var fs = require("fs");
var exec = require('child_process').exec;

// キャプチャ用のコマンドライン
// そのうち保存ファイルは一時ファイル名をつかいたい
var capturecmd = "fswebcam -q -r 1280x960 --font sans:40 /var/www/html/img/test.jpg";

// キャプチャ実行
exec(capturecmd, function(err, stdout, stderr) {
  if(err){
    console.log(stderr);
  }else{
    console.log("success");
  }
});


console.log("cmdexec end");

