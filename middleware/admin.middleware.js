'use strict';

const { jwtDecode } = require('jwt-decode');

module.exports = function (request, reply, done) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  const token = authHeader.substring(7, authHeader.length);
  const payload = jwtDecode(token);

  try {
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < currentTime) {
      reply.code(401).send({ error: 'Token expired' });

      return;
    }
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  if (!payload) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  if (payload.role !== 'ADMIN') {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  done();
};
