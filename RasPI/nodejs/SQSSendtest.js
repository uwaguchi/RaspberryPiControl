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
    MaxNumberOfMessages: 10
};

// メッセージ受信
var maxreceivecount = 10;
var receivecount = 0;
var receiveend = false;

var receiveMessage = function() {
    sqs.receiveMessage(receiveparams).promise().then(function(data) {
        // 完了
        console.log("receive response message end");
        console.log(JSON.stringify(data));

        if(typeof data.Messages != 'undefined') {
            // メッセージが受信できた場合
            for( var i = 0; i < data.Messages.length; i++ ) {
                var curReceiptHandle = data.Messages[i].ReceiptHandle;
                var curBody = JSON.parse(data.Messages[i].Body);

                if(curBody.requestMessageId === requestid) {
                    // 自身が送ったメッセージへのレスポンスの場合
                    console.log("my receive response message found");



                    // 受信処理完了フラグ
                    receiveend = true;

                    // 処理が終わったらメッセージ削除
                    var deleteparams = {
                        QueueUrl: response_que_url,
                        ReceiptHandle: curReceiptHandle
                    };
                    // 処理できた時点でリターン
                    return sqs.deleteMessage(deleteparams).promise();
                }
                console.log("get next message");
            }
        } else {
            // レスポンスがない場合はエラー扱い
            console.log("no response");
        }
    }).then(function(data) {
        // 1リクエストの処理完了
        console.log("request end");

        // 受信処理が完了してない場合はリトライ
        if( receiveend == false ) {
            // リクエスト数カウンタインクリメント
            receivecount++;
            // 最大値までいっていなければ再度受信処理へ
            if( receivecount < maxreceivecount ) {
                receiveMessage();
            }
        }
    }).catch(function(err) {
        // エラー発生
        console.log(err);
    });
    console.log("----------end");
}

// レスポンス受信処理実行
receiveMessage();


