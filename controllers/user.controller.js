'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { PASSWORD_REGEX } = require('../constants/validators');

const prisma = new PrismaClient();

class UserController {
  async getUser(request, reply) {
    const { username } = request.params;

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

    reply.code(200).send(user);
  }

  async changePassword(request, reply) {
    const { username } = request.params;
    const { password, newPassword } = request.body;

    if (!username || !password || !newPassword) {
      reply.code(400).send({ error: 'Missing required field(s)' });

      return;
    }

    if (password === newPassword) {
      reply.code(400).send({ error: 'New password must be different' });

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

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      reply.code(400).send({ error: 'Invalid password' });

      return;
    }

    if (user.strictPassword && !PASSWORD_REGEX.test(newPassword)) {
      reply.code(400).send({
        error:
          'Password must contain at least one number, one special character, and one operator',
      });

      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        passwordHash,
      },
    });

    reply.code(204).send({ message: 'Password changed successfully' });
  }
}

const userController = new UserController();

module.exports = Object.freeze(userController);
