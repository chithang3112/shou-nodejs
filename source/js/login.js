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
        alert('Please fill username and password');
    }
});

socket.on('error validate', (error) => {
  alert('username or password is not match');
});

socket.on('redirect',(data)=>{
    var nickname;
    if(data.data[0].nickname){
        nickname = data.data[0].nickname;
    }else{
        nickname = data.data[0].login_id;
    }
    var cookie = window.btoa('shougenshi-' + data.data[0].id + '-'+ nickname +'-31121994');
    document.cookie = "SNJ_SSID=" + cookie;
    window.location.href = data.url;
});