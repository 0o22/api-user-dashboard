'use strict';

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Extracts the role from the JWT in the Authorization header.
 * @param {Object} request - The request object from Fastify or another framework.
 * @returns {String} The role of the user, or 'USER' if the role cannot be determined.
 */
function getUserRoleFromRequest(request) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return 'USER'; // Default to 'USER' if no authorization header is present
  }

  const token = authHeader.substring(7); // Skip 'Bearer '

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    return payload.role || 'USER';
  } catch (error) {
    return 'USER';
  }
}

module.exports = { getUserRoleFromRequest };
