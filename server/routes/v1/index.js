var express = require('express');
var server = express();

server.use('/pub', require('./pub'));
server.use('/user', require('./user'));

module.exports = server;