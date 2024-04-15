'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Verifies the JWT in the Authorization header.
 * @param {Object} request - The request object from Fastify or another framework.
 * @returns {Boolean} True if the JWT is valid, false otherwise.
 */
function verifyJWT(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return false;
  }

  const token = authHeader.substring(7); // Skip 'Bearer '

  try {
    jwt.verify(token, JWT_SECRET);

    return true;
  } catch (error) {
    console.error('Error verifying token:', error);

    return false;
  }
}

module.exports = { verifyJWT };
