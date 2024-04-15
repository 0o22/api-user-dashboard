'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { PASSWORD_REGEX } = require('../constants/validators');
const { getUserRoleFromRequest } = require('../libs/getUserRoleFromRequest');

const prisma = new PrismaClient();

class UserController {
  async getUser(request, reply) {
    const { username } = request.params || {};

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

    const role = getUserRoleFromRequest(request);

    if (role === 'ADMIN') {
      return reply.code(200).send(user);
    } else {
      return reply.code(200).send({
        id: user.id,
        username: user.username,
        banned: user.banned,
      });
    }
  }

  async getAllUsers(request, reply) {
    const users = await prisma.user.findMany();

    const role = getUserRoleFromRequest(request);

    if (role === 'ADMIN') {
      return reply.code(200).send(users);
    } else {
      const filteredUsers = users.map(({ id, username, banned }) => ({
        id,
        username,
        banned,
      }));

      return reply.code(200).send(filteredUsers);
    }
  }

  async createUser(request, reply) {
    const { username } = request.body || {};

    if (!username) {
      reply.code(400).send({ error: 'Username is required' });

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      reply.code(400).send({ error: 'Username already exist' });

      return;
    }

    await prisma.user.create({
      data: {
        username,
      },
    });

    reply.code(201).send({ message: 'User created successfully' });
  }

  async deleteUser(request, reply) {
    const { username } = request.params || {};

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

    await prisma.user.delete({
      where: {
        username,
      },
    });

    reply.code(204).send({ message: 'User deleted successfully' });
  }

  async changePassword(request, reply) {
    const { username } = request.params || {};
    const { password, newPassword } = request.body || {};

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
      reply.code(400).send({ error: 'Invalid username or password' });

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

  async changeStatus(request, reply) {
    const { username } = request.params || {};

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      reply.code(404).send({ error: 'User not found' });

      return;
    }

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        banned: !user.banned,
      },
    });

    reply.code(204);
  }

  async changePasswordStrictness(request, reply) {
    const { username } = request.params || {};

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

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        strictPassword: !user.strictPassword,
      },
    });

    reply.code(204);
  }
}

const userController = new UserController();

module.exports = Object.freeze(userController);