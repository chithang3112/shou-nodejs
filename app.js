/**
 * Created by chith on 2018/06/22.
 */
let path = require('path');
let fs = require('fs');
let express = require('express');
let https = require('https');
let http = require('http');
let ejs = require('ejs');
let PORT = process.env.PORT || 443;

var certOptions = {
    key: fs.readFileSync('https_pem/shou.key'),
    cert: fs.readFileSync('https_pem/shou.crt'),
};
var app = express();
var httpsServer = https.createServer(certOptions, app);
var io = require('socket.io')(httpsServer);

//db設定
//b6e7028f57ed52:68c0eb28@us-cdbr-iron-east-01.cleardb.net/heroku_a832250927dee8b?
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : process.env.PORT ? 'us-cdbr-iron-east-01.cleardb.net' : 'shou.nodejs',
    database : process.env.PORT ? 'heroku_a832250927dee8b' : 'nodejs',
    port     : '3306',
    user     : process.env.PORT ? '6e7028f57ed52' : 'user',
    password : process.env.PORT ? '68c0eb28' : 'password',
});

connection.connect(function(err) {
    if (err) throw 'exception' + err;
    console.log('Connection Successful');
});

//appの設定
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'source')));
//トップページ

app.get('/',function(req, res){
    res.redirect('/index');
});
app.get('/index' , function (req, res) {
    res.render('template',{title : 'タイトル1',body : req.url});
});

app.get('/room' , function (req, res) {
    res.render('template',{title : 'ルーム' + req.query.roomId ,body : req.baseUrl + req.path});
});

io.sockets.on('connection', function(socket) {
    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }
    socket.on('get list room',getListRoom=()=>{
        connection.query('SELECT * FROM room', function (err, rows) {
            if (err) throw err;
            log('Server said: ', 'Data received from Db:');
            log(rows);
            socket.emit('show room', rows);
        });
    });
    log('Connected');
    socket.on('message', function(message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.emit('message', message);
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
            let sql = "SELECT * FROM room where id = LAST_INSERT_ID()";
            connection.query( sql ,function(err,rows){
                if(err) throw err;
                log('Server said: ', 'Data received from Db:');
                log(rows);
                socket.emit('show room', rows);
            });
        });
    });

    socket.on('loading room',(roomId)=>{
        log(roomId);
        var room = 'room-' + roomId;
        socket.nickname = 'Earl';
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
});

httpsServer.listen(PORT, () => console.log('Running!!! Listenning on ' + PORT));

