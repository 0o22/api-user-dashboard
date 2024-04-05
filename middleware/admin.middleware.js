'use strict';

module.exports = function (request, reply, done) {
  const authToken = request.headers.authorization; // TODO Rewrite with cookies

  if (!authToken) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  const [, token] = authToken.split(' ');
  const [, payload] = token.split('.');

  let userData;

  try {
    const payloadDecoded = Buffer.from(payload, 'base64').toString();

    userData = JSON.parse(payloadDecoded);

    const currentTime = Math.floor(Date.now() / 1000);

    if (!userData.exp || userData.exp < currentTime) {
      reply.code(401).send({ error: 'Token expired' });

      return;
    }
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  if (!userData) {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  if (userData.role !== 'ADMIN') {
    reply.code(401).send({ error: 'Unauthorized' });

    return;
  }

  done();
};
