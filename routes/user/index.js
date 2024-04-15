'use strict';

const userController = require('../../controllers/user.controller');

module.exports = async function (fastify) {
  fastify.get('/:username', userController.getUser);
  fastify.patch('/change-password/:username', userController.changePassword);
};
