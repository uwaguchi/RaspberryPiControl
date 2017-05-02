var AWS = require('aws-sdk');
var captureimage = require('./captureimage');

var request_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_request';
var response_que_url = 'https://sqs.ap-northeast-1.amazonaws.com/120143799024/raspi_response';

AWS.config.loadFromPath('credentials.json');

var sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: 'ap-northeast-1'
});

// 各処理の本体
var getCapture = function(curMessageId, curReceiptHandle) {
    captureimage.captureAndPutS3Image().then(function(data) {
        // s3urlのプリフィックス
        var s3url = "https://s3-ap-northeast-1.amazonaws.com/uwaguchi/";
        // 返ってきたキー値をURLに追加
        s3url += data;

        // ここでレスポンスを返す
        // レスポンスキューにメッセージを送信
        // メッセージ本体
        var responsemessage = {raspiresponse: 'OK', requestMessageId: curMessageId, url: s3url};

        // パラメータセット
        var responseparams = {
            QueueUrl: response_que_url,
            MessageBody: JSON.stringify( responsemessage )
        };

        // レスポンスメッセージ送信
        return sqs.sendMessage(responseparams).promise();
    }).then(function(data) {
        // 送信完了
        console.log("send response message end");

        // 処理が終わったらメッセージ削除
        var deleteparams = {
            QueueUrl: request_que_url,
            ReceiptHandle: curReceiptHandle
        };

        // メッセージ削除
        return sqs.deleteMessage(deleteparams).promise();
    }).catch(function(err) {
        // エラー発生
        console.log(err);
    });
};





var receiveMessage = function() {
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
            var curBodyData = JSON.parse(curBody);
            switch(curBodyData.raspimessage){

                // 画像取得
                case 'GetCapture':
                    console.log("GetCapture Start");
                    return getCapture(curMessageId, curReceiptHandle);
                    break;

                // リモコン操作
                case '':

                default:
                    console.log("do nothing. message:" + curBodyData.raspimessage);
                    break;
            }

        }
    }).then(function(data) {
        // 削除完了したら次のメッセージ受信処理へ
        console.log("end");
        receiveMessage();
    }).catch(function(err) {
        // エラー発生
        console.log(err);
    });
};

// メッセージ受信スタート
receiveMessage();

