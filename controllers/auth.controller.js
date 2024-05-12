'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const {
  validateUsername,
  validatePassword,
} = require('../libs/validation/validate');

const prisma = new PrismaClient();

class AuthController {
  async login(request, reply) {
    const { username, password } = request.body;

    if (!username) {
      reply.code(400).send({ error: 'Username is required' });

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      reply.code(404).send({ error: 'User not found' });

      return;
    }

    if (user.passwordHash) {
      if (!password) {
        reply.code(400).send({ error: 'Password is required' });

        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        reply.code(400).send({ error: 'Invalid username or password' });

        return;
      }
    }

    if (user.banned) {
      reply.code(403).send({ error: 'User is banned' });

      return;
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      access: user.access,
      createdAt: user.createdAt,
      hasPassword: Boolean(user.passwordHash), // Check if user has a password
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
    });

    reply.code(200).send({ token });
  }

  async register(request, reply) {
    const { username, password } = request.body;

    if (!username || !password) {
      reply.code(400).send({ error: 'Missing required field(s)' });

      return;
    }

    const { valid: usernameValid, rule: usernameRule } =
      validateUsername(username);

    if (!usernameValid) {
      reply.code(400).send({
        error: usernameRule,
      });

      return;
    }

    const { valid: passwordValid, rule: passwordRule } =
      validatePassword(password);

    if (!passwordValid) {
      reply.code(400).send({
        error: passwordRule,
      });

      return;
    }

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userExists) {
      reply.code(400).send({ error: 'Username already exists' });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      username,
      passwordHash,
    };

    const newUser = await prisma.user.create({
      data: user,
    });

    reply
      .code(201)
      .send({ user: newUser, message: 'User created successfully' });
  }
}

const authController = new AuthController();

module.exports = Object.freeze(authController);
