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
  fastify.post('/:username/check-access', userController.checkAccess);
  fastify.patch('/:username/set-new-password', userController.setNewPassword);
  fastify.patch('/:username/change-password', userController.changePassword);
  fastify.patch(
    '/:username/change-status',
    { preHandler: adminMiddleware },
    userController.changeStatus
  );
  fastify.patch(
    '/:username/change-password-strictness',
    { preHandler: adminMiddleware },
    userController.changePasswordStrictness
  );
  fastify.post('/verify-access-key', userController.verifyAccess);
};
