/**
 * Created by chith on 2018/06/27.
 */
'use strict';

var socket = io();


socket.on('log',(array)=>{
    console.log.apply(console, array);
});

socket.emit('get list room');

$('#createBtn').on('click',()=>{
    var roomName = prompt("Input your room name","");
    if (roomName!=null){
        socket.emit("Add room", roomName);
    }
});

socket.on('show room',(rooms)=>{
    rooms.forEach((val)=>{
        let html = '<li><a href="#" id="joinRoom" data-room='+val.id+'>'+val.room_name+'</a></li>'
        $('#list').append(html);
        $('a[data-room='+ val.id +']').on('click',()=>{
            console.log(val.id);
            socket.emit('join room', val.id);
        });
    });
});

socket.on('redirect',(destination)=>{
    window.location.href = destination;
});

