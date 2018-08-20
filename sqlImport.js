/**
 * Created by chith on 2018/08/17.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : process.env.PORT ? 'db4free.net' : 'shou.nodejs',
    database : process.env.PORT ? 'thangtran_db' : 'nodejs',
    port     : '3306',
    user     : process.env.PORT ? 'thangtran' : 'user',
    password : process.env.PORT ? '12345678' : 'password',
});

connection.connect(function(err) {
    if (err) throw 'exception' + err;
    console.log('Connection Successful');
});

var roomTableSql = 'CREATE TABLE IF NOT EXISTS room (id INT(11) NOT NULL auto_increment PRIMARY KEY,room_name VARCHAR(255), room_master_id INT(11), created_at INT(11)) DEFAULT CHARSET=utf8';
connection.query(roomTableSql, function (err, result) {
    if (err) throw err;
    console.log("Created table room");
});

var userTableSql = 'CREATE TABLE IF NOT EXISTS user (id INT(11) NOT NULL auto_increment PRIMARY KEY,login_id VARCHAR(255), password VARCHAR(100), nick_name VARCHAR(32), valid_chk TINYINT(11), created_at INT(11)) DEFAULT CHARSET=utf8';
connection.query(userTableSql, function (err, result) {
    if (err) throw err;
    console.log("Created table user");
    var initUserImport = "INSERT INTO user (login_id, password, nick_name, valid_chk, created_at) VALUES ('system', 'password', 'システム管理者', 1 ,UNIX_TIMESTAMP(NOW())),('admin', 'password', '管理者', 1 ,UNIX_TIMESTAMP(NOW()))";
    connection.query(initUserImport, function (err, result) {
        if (err) throw err;
        console.log("Created user room");
    });
});