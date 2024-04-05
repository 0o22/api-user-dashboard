'use strict';

const userController = require('../../controllers/user.controller');

module.exports = async function (fastify) {
  fastify.post('/login', userController.login);
  fastify.post('/register', userController.register);
  fastify.patch('/change-password/:username', userController.changePassword);
};
