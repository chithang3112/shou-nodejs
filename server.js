/**
 * Created by chith on 2018/06/27.
 */
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var dirname = __dirname + '/socket';
app.get('/', function(req, res){
    res.sendFile(dirname + '/chat.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(80, () => {
    console.log('listening on *:80');
});