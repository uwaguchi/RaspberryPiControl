var AWS = require('aws-sdk');

var request_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_request';
var response_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_response';


AWS.config.loadFromPath('credentials.json');

var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'ap-northeast-1'
});

// メッセージ本体
var message = {raspimessage: 'GetCapture'};

// パラメータセット
var params = {
    QueueUrl: request_que_url,
    MessageBody: JSON.stringify( message )
};

// 送信したリクエストのメッセージID
var requestid = '';

// メッセージ送信
sqs.sendMessage(params).promise().then(function(data) {
    // 送信完了
    console.log("send message end");
    console.log(data.MessageId);
    // メッセージIDを保存
    requestid = data.MessageId;
}).catch(function(err) {
    // エラー発生
    console.log(err);
});

// レスポンスメッセージ受信
// パラメータセット
var receiveparams = {
    QueueUrl: response_que_url,
    MaxNumberOfMessages: 1
};

// メッセージ受信
sqs.receiveMessage(receiveparams).promise().then(function(data) {
    // 完了
    console.log("receive response message end");
    console.log(JSON.stringify(data));

    if(typeof data.Messages != 'undefined') {
        // メッセージが受信できた場合
        var curReceiptHandle = data.Messages[0].ReceiptHandle;
        var curBody = JSON.parse(data.Messages[0].Body);

        if(curBody.requestMessageId === requestid) {
            // 自身が送ったメッセージへのレスポンスの場合
            console.log("my receive response message found");




            // 処理が終わったらメッセージ削除
            var deleteparams = {
                QueueUrl: response_que_url,
                ReceiptHandle: curReceiptHandle
            };
            return sqs.deleteMessage(deleteparams).promise();
        }
    } else {
        // レスポンスがない場合はエラー扱い
        console.log("no response");
    }
}).then(function(data) {
    // 削除完了
    console.log("end");
}).catch(function(err) {
    // エラー発生
    console.log(err);
});

