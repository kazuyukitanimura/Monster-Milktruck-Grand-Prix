var connect = require('connect'),
  fs = require('fs'),
  socketIO = require('socket.io'),
  jspack = require('./lib/node-jspack/jspack').jspack,
  express = require('express'),
  osc = require('./lib/osc')
  
// handle regular http stuff
var app = express.createServer();
  
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express['static'](__dirname + '/static'));
});

app.get('/', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.readFile('./views/homepage.html', 'utf8', function (err, html) {
    res.end(html);
  });
});

app.get('/index.txt', function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text' });
  fs.readFile('./views/index.txt', 'utf8', function (err, text) {
    res.end(text);
  });
});

app.listen(8090);

var io = socketIO.listen(app);

// socket.io, I choose you
//io.sockets.on('connection', function(socket) {
//  
//  // prepare listening socket
//  var dgram = require('dgram'),
//    osc_serv = dgram.createSocket('udp4')
//
//  // parse the message from Osculator client
//  // not really doing any determination via OSC spec
//  // just dumb-parsing the buffer
//  osc_serv.on('message', function (msg, a) {
//    var val = osc.decode(msg);
//    json = JSON.stringify(val);
//    socket.send(json);
//  })
//
//  // listen for incoming messages from Osculator client
//  // be sure to set port and IP address to where your
//  // Osculator client routes OSC messages.
//  // Don't use default values.
//  osc_serv.bind(60000, '10.22.35.95')
//
//});
MAXRACEUSER = 4;
gUserIDCounter = 0;
gRaceIDCounter = 0;
gRaceArray = [[]]; // array of array of sid
gUserTable = {};
INIT_DEPART = {lat: 37.423378, lon: -122.072825, name: "LinkedIn"};
INIT_DESTINATION = {lat: 7.331641, lon: -122.03008237.735189, name: "Apple"};
io.sockets.on('connection', function(socket) {
  socket.json.emit('uuid', {userID:gUserIDCounter++});

  socket.on('join', function(data){
    var sid = socket.id;
    gUserTable[sid] = data;
    var raceObj = gRaceArray[gRaceIDCounter];
    if(! Array.isArray(raceObj)) {
      console.err("What!!!");
      exit();
    }
    raceObj.push(sid);
    gRaceArray[gRaceIDCounter] = raceObj;
    if(raceObj.length === MAXRACEUSER){
      var depart = INIT_DEPART;
      var destination = INIT_DESTINATION;
      var raceID = gRaceIDCounter;
      var users = [];
      for(var i=raceObj.length; i--;){
        users.push(gUserTable[raceObj[i]]);
      }
      for(var i=raceObj.length; i--;){
        io.sockets.sockets[raceObj[i]].json.emit('startRace', {raceID: raceID, depart: depart, destination: destination, users: users});
      }
      gRaceArray[++gRaceIDCounter] = [];
    }
  });
  socket.on('location', function(data){
    var raceID = data.raceID;
    var latD = data.lat - INIT_DESTINATION.lat;
    var lonD = data.lon - INIT_DESTINATION.lon;
    var distance = latD*latD + lonD*lonD
    var sid = socket.id;
    if(raceID>=0){
      var raceObj = gRaceArray[raceID];
      for(var i=raceObj.length; i--;){
        var tosid = raceObj[i];
        if(sid!==tosid){
          io.sockets.sockets[tosid].json.emit('control', data);
        }
      }
      if(distance < 0.01){
        for(var i=raceObj.length; i--;){
          var tosid = raceObj[i];
          if(sid===tosid){
            io.sockets.sockets[raceObj[i]].json.emit('endRace', {raceID:raceID, result:"win"});
          }else{
            io.sockets.sockets[raceObj[i]].json.emit('endRace', {raceID:raceID, result:"lose"});
          }
        }
      }
    }
  });
  
});
