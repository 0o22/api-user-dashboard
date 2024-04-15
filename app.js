'use strict';

const { PORT = 3000, JWT_SECRET } = require('./config/env');

// If the environment variable RENDER is set, the application is running on Render.com
const HOST = 'RENDER' in process.env ? `0.0.0.0` : `localhost`;

const path = require('node:path');
const cors = require('@fastify/cors');
const cookie = require('@fastify/cookie');
const middie = require('@fastify/middie');
const AutoLoad = require('@fastify/autoload');

const fastify = require('fastify')({
  logger: true,
});

fastify.register(cors, {
  origin: '*',
});

fastify.register(cookie, {
  secret: JWT_SECRET,
  hook: 'onRequest',
});

fastify.register(middie, {
  hook: 'onRequest',
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
  options: Object.assign({}),
});

fastify.listen({ host: HOST, port: PORT }, function (error) {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});
