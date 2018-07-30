/**
 * Created by chith on 2018/07/17.
 */
var socket = io();

socket.on('log',(array)=>{
    console.log.apply(console, array);
});

socket.on('connectToRoom',(room)=>{
    console.log('You are in room no. '+ room);
});
if (window.location.search.indexOf('roomId=') > -1) {
    var url = window.location.search;
    var getQuery = url.split('?')[1];
    var params = getQuery.split('&')[0];
    var roomId = params.split('roomId=')[1];
    socket.emit('loading room',roomId);
} else {
    alert('track not here');
}

console.log(roomId);
