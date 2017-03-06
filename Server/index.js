var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/raspicontrol"] = requestHandlers.raspicontrol;

server.start(router.route, handle);
