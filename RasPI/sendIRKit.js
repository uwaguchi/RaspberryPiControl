var fs = require("fs");
var rp = require("request-promise");

// 送信するホスト
var irkithost = fs.readFileSync("IRKit_host.dat");
// リクエストurl
var requrl = "http://" + irkithost + "/messages";

var request_irkit = function(jsondat) {

    return new Promise(function(resolve, reject) {

        // リクエストオプション
        var options = {
            method: 'POST',
            url: requrl,
            body: jsondat,
            headers: {
                'X-Requested-With': 'curl'
            }
        };
        // リクエスト実行
        rp(options).then(function(res) {
            // 正常終了
            resolve();
        }).catch(function(err) {
            // エラー発生
            reject();
        });
    });
}


var tv_3ch = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("tv_3ch.json");

    // リクエスト
    return request_irkit(jsondat);
};

var tv_9ch = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("tv_9ch.json");

    // リクエスト
    return request_irkit(jsondat);
};

var tv_power = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("tv_power.json");

    // リクエスト
    return request_irkit(jsondat);
};

var aircon_cooler = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("aircon_cooler.json");

    // リクエスト
    return request_irkit(jsondat);
};

var aircon_heater = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("aircon_heater.json");

    // リクエスト
    return request_irkit(jsondat);
};

var aircon_off = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("aircon_off.json");

    // リクエスト
    return request_irkit(jsondat);
};

var light1 = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("light.json");

    // リクエスト
    return request_irkit(jsondat);
};

var light3 = function() {
    // 送信するJSON
    var jsondat = fs.readFileSync("light.json");

    return new Promise(function(resolve, reject) {

        // 2秒おきに3回コール
        // 1回目
        console.log("first light3 request");
        request_irkit(jsondat).then(function(res) {
            // 2秒待つ
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, 2000);
            });
        }).then(function(res) {
            // 2回目
            console.log("second light3 request");
            return request_irkit(jsondat);
        }).then(function(res) {
            // 2秒待つ
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, 2000);
            });
        }).then(function(res) {
            // 3回目
            console.log("third light3 request");
            return request_irkit(jsondat);
        }).then(function(res) {
            // 全部成功したら完了
            console.log("all light3 request done");
            resolve();
        }).catch(function(err) {
            // エラー発生
            console.log("light3 request error.");
            reject();
        });
    });
};

// エクスポート
exports.tv_3ch = tv_3ch;
exports.tv_9ch = tv_9ch;
exports.tv_power = tv_power;
exports.aircon_cooler= aircon_cooler;
exports.aircon_heater= aircon_heater;
exports.aircon_off= aircon_off;
exports.light1= light1;
exports.light3= light3;

