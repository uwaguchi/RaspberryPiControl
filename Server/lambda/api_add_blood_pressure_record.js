var AWS = require('aws-sdk');

// メイン処理
var add_blood_preassure_record = async function (max, min, bpm) {

  return new Promise(async function(resolve, reject) {

    // AWS credential読み込み
    AWS.config.loadFromPath("credentials.json");
    // s3アクセス用オブジェクト生成
    var s3 = new AWS.S3({
        region: "ap-northeast-1"
    });

    // s3バケット名
    var s3bucket = "uwaguchi";
    // s3オブジェクト名
    //var datakey = "blood-pressure/blood-pressure.txt";
    var datakey = "blood-pressure/blood-pressure-test.txt";

    // S3からのデータ読み込み
    params = {};
    params["Bucket"] = s3bucket;
    params["Key"] = datakey;

    var filedata= "";

    try {
        var data = await s3.getObject(params).promise();
        filedata = data.Body.toString();
    } catch(err) {
        console.log(err);
        reject("s3 getObject Error");
    }

    // タイムスタンプ取得
    curdate = new Date();
    var yy = curdate.getFullYear();
    var mm = ("0"+ (curdate.getMonth() + 1)).slice(-2);
    var dd = ("0"+curdate.getDate()).slice(-2);
    var hh = ("0"+curdate.getHours()).slice(-2);
    var mi = ("0"+curdate.getMinutes()).slice(-2);
    var ss = ("0"+curdate.getSeconds()).slice(-2);
    var datestr = yy + "/" + mm + "/" + dd;
    var timestr = hh + ":" + mi + ":" + ss;

    // レコード作成
    var recode = datestr + "\t" + timestr + "\t" + max + "\t" + min + "\t" + bpm + "\n";

    // データ追加
    filedata = filedata + recode;

    // S3のデータを更新
    params = {};
    params["Bucket"] = s3bucket;
    params["Key"] = datakey;
    params["ContentType"] = "text/plain";
    params["ACL"] = "public-read";
    params["Body"] = filedata;
    try {
        await s3.putObject(params).promise();
    } catch(err) {
        console.log(err);
        console.log("s3 putObject Error");
        reject("s3 putObject Error");
    }

    // 正常終了
    resolve("OK");
  });
};

// test
//var handler = async function(event, context) {

exports.handler = async function(event, context) {
  // パラメータ取得
  var max = event.max;
  var min = event.min;
  var bpm = event.bpm;

  console.log("max: " + max);
  console.log("mix: " + min);
  console.log("bpm: " + bpm);

  if (!max || !min || !bpm) {
    // パラメータがない場合
    console.log("parameter error");
    return JSON.stringify({response: "Error"});
  }

  // メイン処理実行
  await add_blood_preassure_record(max, min, bpm);

  // 正常終了
  return JSON.stringify({response: "OK"});
};

// test
//handler({max: "105", min: "77", bpm: "99"});
//console.log("end");
