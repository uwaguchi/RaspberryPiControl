var fs = require("fs");
var send2Raspi = require('./sendMessage2Raspi');

exports.handler = function(event, context, callback) {
  // 画像キャプチャー処理
  send2Raspi.sendMessage2Raspi('GetCapture', null).then(function(res) {
    // レスポンス生成
    callback(null, res);
  }).catch(function(err) {
    // エラー発生
    console.log(err);
    callback(null, {raspiresponse: 'Error'});
  });
};

