'use strict';

const userController = require('../../controllers/user.controller');
const adminMiddleware = require('../../middleware/admin.middleware');

module.exports = async function (fastify) {
  fastify.get('/', userController.getAllUsers);
  fastify.post('/', { preHandler: adminMiddleware }, userController.createUser);
  fastify.get('/:username', userController.getUser);
  fastify.delete(
    '/:username',
    { preHandler: adminMiddleware },
    userController.deleteUser
  );
  fastify.patch('/change-password/:username', userController.changePassword);
  fastify.patch(
    '/change-status/:username',
    { preHandler: adminMiddleware },
    userController.changeStatus
  );
  fastify.patch(
    '/change-password-strictness/:username',
    { preHandler: adminMiddleware },
    userController.changePasswordStrictness
  );
};
