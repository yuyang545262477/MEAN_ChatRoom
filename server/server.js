/*
 * Import all our dependencies
 * */

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// set serve static files

app.use(express.static(__dirname + '/public'));

//mongodb connect 
mongoose.connect("mongodb://127.0.0.1:27017/scotch-chatRoom");

//create a schema for chat
var ChatSchema = mongoose.Schema({
    created: Date,
    connect: String,
    username: String,
    room: String
});

//create a model from the chat schema

var Chat = mongoose.model('Chat', ChatSchema);

// allow CORS

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", 'Content-type,Access,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

//route

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

// this route only run on the first launch

app.post('/setup', function (req, res) {
//    set Array datas
    var chatData = [{
        created: new Date(),
        content: 'Hi',
        username: 'Chris',
        room: 'php'
    }, {
        created: new Date(),
        content: 'Hello',
        username: 'Obinna',
        room: 'laravel'
    }, {
        created: new Date(),
        content: 'Ait',
        username: 'Bill',
        room: 'angular'
    }, {
        created: new Date(),
        content: 'Amazing room',
        username: 'Patience',
        room: 'socet.io'
    }];
//    Loop through each of the chat data and insert into the database
    for (var c = 0; c < chatData.length; c++) {
        //create an instance of the chat model 
        var newChat = new Chat(chatData[c]);
        //    call save to insert the chat
        newChat.save(function (err, savedChat) {
            console.log(savedChat);
        });
        
    }
    //    Send a response so the serve would not get stuck
    res.send('created');
});

//This route produces a list of chat as filter by 'room' query

app.get('/ms', function (req, res) {
//    Find
    Chat.find({
        'room': req.query.room.toLocaleLowerCase()
    }).exec(function (err, msgs) {
        //    Send
        res.json(msgs);
    })
});


server.listen(20015);
console.log("it's going down in 20015");








    

