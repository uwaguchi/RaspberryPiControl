var fs = require("fs");
var exec = require('child_process').exec;
var AWS = require('aws-sdk');

// キャプチャ画像ファイル名
// [0-9A-Z]をランダムに8文字並べた文字列を生成
var randomstr = Math.random().toString(36).slice(-8);
// randonstrを付与してファイル名生成
var imagefilepath = "/tmp/capture_tmp_" + randomstr + ".jpg"

// s3バケット名
var s3bucket = "uwaguchi";
// s3オブジェクト名
// リクエストメッセージオブジェクト
var requestmessagekey = "raspimessage/requestmesssage";
// レスポンスメッセージオブジェクト
var responsemessagekey = "raspimessage/responsemesssage";
// 保存画像オブジェクト
var recentimagekey = "captureimage/recent";


// AWS credential読み込み
AWS.config.loadFromPath("credentials.json");
// s3アクセス用オブジェクト生成
var s3 = new AWS.S3({
    region: "ap-northeast-1"
});

// キャプチャ用のコマンドライン
var capturecmd = "fswebcam -q -r 1280x960 --font sans:40 " + imagefilepath;

// メッセージ取得


// キャプチャ実行
exec(capturecmd, function(err, stdout, stderr) {
    if(err){
        console.log(stderr);
    }else{
        // キャプチャ完了
        console.log("capture end");
        // キャプチャファイルを読み込み
        fs.readFile(imagefilepath, function(err, buf) {
            if(err) {
                console.log(err);
            } else {
                // キャプチャファイル読み込み完了
                console.log("read capture file end");
                // s3にput
                params = {};
                params["Bucket"] = s3bucket;
                params["Key"] = recentimagekey;
                params["ContentType"] = "image/jpeg";
                params["ACL"] = "public-read";
                params["Body"] = buf;  

                s3.putObject(params, function(err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        // put完了
                        console.log("put s3 end");

                        // 一時ファイル削除
                        fs.unlink(imagefilepath, function(err) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("tmp imagefile delete");
                            }
                        });
                    }
                });
            }
        });
    }
});

console.log("cmdexec end");

