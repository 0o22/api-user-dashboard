'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = function (request, reply, done) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  const token = authHeader.substring(7, authHeader.length); // Skip 'Bearer '
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
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
