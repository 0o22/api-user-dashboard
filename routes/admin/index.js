'use strict';

const adminController = require('../../controllers/admin.controller');
const adminMiddleware = require('../../middleware/admin.middleware');

module.exports = async function (fastify) {
  fastify.addHook('preHandler', adminMiddleware);
  fastify.get('/users', adminController.getUsers);
  fastify.post('/users', adminController.createUser);
  fastify.delete('/users/:username', adminController.deleteUser);
  fastify.patch(
    '/users/change-status/:username',
    adminController.changeUserStatus
  );
  fastify.patch(
    '/users/change-password-strictness/:username',
    adminController.changeUserPasswordStrictness
  );
};
