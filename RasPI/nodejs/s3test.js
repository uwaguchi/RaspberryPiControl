var fs = require('fs');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('credentials.json');

var s3 = new AWS.S3({
    region: 'ap-northeast-1'
});

buf = fs.readFileSync('test.jpg');

var bucket = 'uwaguchi';
var key = 'test/test.jpg';

params = {Bucket: bucket, Key: key, ContentType: 'image/jpeg', ACL: 'public-read', Body: buf};

s3.putObject(params, function(err, data) {

    if (err) {
        console.log(err)

    } else {

        console.log("Successfully uploaded data to myBucket/myKey");

    }

});


