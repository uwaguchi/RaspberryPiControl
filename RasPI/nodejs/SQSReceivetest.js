var AWS = require('aws-sdk');

var request_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_request';
var response_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_response';

AWS.config.loadFromPath('credentials.json');

var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'ap-northeast-1'
});

// パラメータセット
var receiveparams = {
    QueueUrl: request_que_url,
    MaxNumberOfMessages: 1
};

// メッセージ受信
sqs.receiveMessage(receiveparams).promise().then(function(data) {
    // 完了
    console.log("receive message end");
    console.log(JSON.stringify(data));

    if(typeof data.Messages != 'undefined') {
        // メッセージが受信できた場合
        var curMessageId = data.Messages[0].MessageId;
        var curReceiptHandle = data.Messages[0].ReceiptHandle;
        var curBody = data.Messages[0].Body;

        // ここで受信したメッセージの内容に従って処理




        // ここでレスポンスを返す
        // レスポンスキューにメッセージを送信
        // メッセージ本体
        var responsemessage = {raspiresponse: 'OK', requestMessageId: curMessageId};

        // パラメータセット
        var responseparams = {
            QueueUrl: response_que_url,
            MessageBody: JSON.stringify( responsemessage )
        };

        // レスポンスメッセージ送信
        sqs.sendMessage(responseparams).promise().then(function(data) {
            // 送信完了
            console.log("send response message end");
        }).catch(function(err) {
            // エラー発生
            console.log(err);
        });

        // 処理が終わったらメッセージ削除
        var deleteparams = {
            QueueUrl: request_que_url,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        return sqs.deleteMessage(deleteparams).promise();
    }
}).then(function(data) {
    // 削除完了
    console.log("end");
}).catch(function(err) {
    // エラー発生
    console.log(err);
});




