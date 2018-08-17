/**
 * Created by chith on 2018/06/22.
 */
let path = require('path');
let fs = require('fs');
let express = require('express');
let https = require('https');
let http = require('http');
let ejs = require('ejs');
var cookieParser = require("cookie-parser");
let PORT = process.env.PORT || 80;

var certOptions = {
    key: fs.readFileSync('https_pem/shou.key'),
    cert: fs.readFileSync('https_pem/shou.crt'),
};
var app = express();
//var httpsServer = https.createServer(certOptions, app);
var httpServer = http.createServer(app);
//var io = require('socket.io')(httpsServer);
var io = require('socket.io')(httpServer);

//db設定
//test comment
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : process.env.PORT ? 'db4free.net' : 'shou.nodejs',
    database : process.env.PORT ? 'thangtran_db' : 'nodejs',
    port     : '3306',
    user     : process.env.PORT ? 'thangtran' : 'user',
    password : process.env.PORT ? '123456' : 'password',
});

connection.connect(function(err) {
    if (err) throw 'exception' + err;
    console.log('Connection Successful');
});

//appの設定
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'source')));
//トップページ

app.get('/',function(req, res){
    res.redirect('/login');
});
app.get('/index' , function (req, res) {
    console.log(req.cookies.SNJ_SSID);
    if(req.cookies.SNJ_SSID){
        res.render('template', {title: 'タイトル1', head: 'head', body: req.url});
    }else{
        res.redirect('/login');
    }
});

app.get('/login' , function (req, res) {
    res.render('template', {title: 'ログイン', head: 'login', body: req.url});
});

app.get('/room' , function (req, res) {
    res.render('template', {title: 'ルーム' + req.query.roomId, head: 'head', body: req.baseUrl + req.path});
});

io.sockets.on('connection', function(socket) {
    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }
    log('Connected');
    socket.emit('load room');

    socket.on('get list room',()=>{
        connection.query('SELECT * FROM room', function (err, rows) {
        if (err) throw err;
        log('Server said: ', 'Data received from Db:');
        log(rows);
        io.emit('show room', rows);
    });
});

    socket.on('join room',(room)=>{
        log('room-' + room);
        var url = '/room?roomId='+ room;
        socket.emit('redirect', url);
    });

    socket.on('Add room',(room)=>{
        log('room-' + room);
        var date =Date.now() / 1000;
        var sql = "INSERT INTO room (room_name, created_at,room_master_id) VALUES ('" + room + "', "+ date +",1)";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            log("Created room");
            socket.emit('load room');
        });
    });

    socket.on('loading room',(roomId)=>{
        log(roomId);
        var room = 'room-' + roomId;
        socket.join(room);
        io.to(room).emit('connectToRoom', room);
        io.in(room).clients((err, clients) => {
            console.log(clients);
            clients.forEach(function(client) {
                console.log(client);
                var socket = io.sockets.connected[client];
                console.log(socket.nickname);
            });
        });
    });

    socket.on('validate login',(data)=>{
        connection.query('SELECT * FROM user WHERE login_id ="' + data.username + '" AND password ="' + data.password + '"', function (err, rows) {
            if (err) throw err;
            if (rows.length > 1) throw 'duplicate user';
            if (rows == ''){
                socket.emit('error validate');
            }else{
                var data = {
                    url : 'index',
                    data : rows
                }
                socket.emit('redirect', data);
            }
        });
    });
});
//httpsServer.listen(PORT, () => console.log('Running!!! Listenning on ' + PORT));
httpServer.listen(PORT, () => console.log('Running!!! Listenning on ' + PORT));

