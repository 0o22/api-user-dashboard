'use strict';

const authController = require('../../controllers/auth.controller');

module.exports = async function (fastify) {
  fastify.post('/login', authController.login);
  fastify.post('/register', authController.register);
  fastify.get('/get-questions', authController.getQuestions);
  fastify.post('/check-answers', authController.checkAnswers);
};
