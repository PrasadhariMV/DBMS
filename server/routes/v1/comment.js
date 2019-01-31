const express = require('express');
const server = express();

const router = express.Router();

const functions = require('functions');
const controllers = require('controllers');
const userController = controllers.user;
const commentController = controllers.comment;

router.route('/create')
  .post(commentController.create);


server.use('/', router);

module.exports = server;