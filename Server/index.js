var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/raspicontrol"] = requestHandlers.raspicontrol;
handle["/api/raspimessage/request"] = requestHandlers.api_raspimessage_request;
handle["/api/raspimessage/capture"] = requestHandlers.api_raspimessage_capture;

server.start(router.route, handle);
