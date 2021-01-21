var http    = require("http");              
var express = require("express");           
var serveStatic = require('serve-static');  
var socketIo = require("socket.io");
var port = process.env.PORT || 8080;
var easyrtc = require("easyrtc"); 

// process name
process.title = "node-easyrtc";

var app = express();
app.use(serveStatic('static', {'index': ['index.html']}));

var webServer = http.createServer(app);

var socketServer = socketIo.listen(webServer, {"log level":1});

easyrtc.setOption("logLevel", "debug");

//start easyrtc
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

webServer.listen(port, function () {
    console.log('listening on '+port);
});
