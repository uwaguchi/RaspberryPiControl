var fs = require("fs-promise");
var exec = require('child-process-promise').exec;
var AWS = require('aws-sdk');


var captureAndPutS3Image = function() {

    return new Promise(function(resolve, reject) {

        // キャプチャ画像ファイル名
        // [0-9A-Z]をランダムに8文字並べた文字列を生成
        var randomstr = Math.random().toString(36).slice(-8);
        // randonstrを付与してファイル名生成
        var imagefilepath = "/tmp/capture_tmp_" + randomstr + ".jpg"

        // s3バケット名
        var s3bucket = "uwaguchi";
        // s3オブジェクト名
        var recentimagekey = "captureimage/recent";

        // AWS credential読み込み
        AWS.config.loadFromPath("credentials.json");
        // s3アクセス用オブジェクト生成
        var s3 = new AWS.S3({
            region: "ap-northeast-1"
        });

        // キャプチャ用のコマンドライン
        var capturecmd = "fswebcam -q -r 1280x960 --font sans:40 " + imagefilepath;

        // キャプチャ実行
        exec(capturecmd).then(function(result) {
            var stdout = result.stdout;
            var stderr = result.stderr;

            // キャプチャ完了
            console.log("capture end");
            // キャプチャファイルを読み込み
            return fs.readFile(imagefilepath);
        }).then(function(buf) {
            // キャプチャファイル読み込み完了
            console.log("read capture file end");

            // s3にput
            params = {};
            params["Bucket"] = s3bucket;
            params["Key"] = recentimagekey;
            params["ContentType"] = "image/jpeg";
            params["ACL"] = "public-read";
            params["Body"] = buf;
            return s3.putObject(params).promise();
        }).then(function(data) {
            // put完了
            console.log("put s3 end");

            // 一時ファイル削除
            return fs.unlink(imagefilepath);
        }).then(function() {
            // 削除完了
            console.log("tmp imagefile delete");
            // 正常終了
            // S3のキーを返す
            resolve(recentimagekey);
        }).catch(function(err) {
            // エラー発生
            console.log(err);
            // エラー終了
            reject(err);
        });

    });
}

// エクスポート
exports.captureAndPutS3Image = captureAndPutS3Image;

