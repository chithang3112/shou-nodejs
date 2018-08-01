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

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
.listen(PORT, () => console.log(`Listening on ${ PORT }`))