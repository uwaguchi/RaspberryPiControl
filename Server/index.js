var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/raspicontrol"] = requestHandlers.raspicontrol;
handle["/api/raspimessage/request"] = requestHandlers.api_raspimessage_request;
handle["/api/raspimessage/response"] = requestHandlers.api_raspimessage_response;

server.start(router.route, handle);
