var send2Raspi = require('./sendMessage2Raspi');

exports.handler = function(event, context, callback) {
  // パラメータ取得
  var action = event.action;
  console.log("action: "+action);
  if (!action) {
    // パラメータがない場合
    console.log("parameter(action) is empty.");
    callback(null, {raspiresponse: 'Error'});
  }

  // IRKitへのコマンド送信
  send2Raspi.sendMessage2Raspi('SendIRKit', action).then(function(res) {
    // レスポンス生成
    callback(null, res);
  }).catch(function(err) {
    // エラー発生
    console.log(err);
    callback(null, {raspiresponse: 'Error'});
  });

};

