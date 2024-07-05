'use strict';

const { JWT_SECRET } = require('../config/env');
const jwt = require('jsonwebtoken');

/**
 * Extracts the data from the JWT in the Authorization header.
 * @param {Object} request - The request object from Fastify or another framework.
 * @returns {Object} The data of the user extracted from the JWT.
 */
function getUserDataFromRequest(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const token = authHeader.substring(7); // Skip 'Bearer '

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    return payload;
  } catch (error) {
    return null;
  }
}

module.exports = { getUserDataFromRequest };
