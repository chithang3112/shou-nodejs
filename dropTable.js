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

var roomTableSql = 'DROP TABLE user IF EXISTS user';
connection.query(roomTableSql, function (err, result) {
    if (err) throw err;
    console.log("Deleted table user");
});