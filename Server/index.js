var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/raspicontrol"] = requestHandlers.raspicontrol;
handle["/raspicontrol_login"] = requestHandlers.raspicontrol_login;
handle["/api/raspimessage/request"] = requestHandlers.api_raspimessage_request;
handle["/api/raspimessage/capture"] = requestHandlers.api_raspimessage_capture;
handle["/api/raspimessage/sendirkit"] = requestHandlers.api_raspimessage_sendirkit;

server.start(router.route, handle);
