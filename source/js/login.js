/**
 * Created by chith on 2018/08/08.
 */
'use strict';

var socket = io();

socket.on('log',(array)=>{
    console.log.apply(console, array);
});

$('#login').on('click',()=>{
    if($('#username').val() != '' && $('#password').val() != ''){
        let data= {
            username : $('#username').val(),
            password : $('#password').val()
        };
        socket.emit('validate login',data);
    }else{
        alert('please fill username and password');
    }
});

socket.on('error validate', (error) => {
  alert('username or password is not match');
});

socket.on('redirect',(destination)=>{
    window.location.href = destination;
});