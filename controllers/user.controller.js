'use strict';

const { getUserDataFromRequest } = require('../libs/getUserDataFromRequest');
const { calculateVerification } = require('../libs/calculateVerification');
const { validatePassword } = require('../libs/validation/validatePassword');
const { verifyAccessKey } = require('../libs/verifyAccessKey');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

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

    const minimalUser = {
      id: user.id,
      username: user.username,
      banned: user.banned,
    };

    const data = getUserDataFromRequest(request);

    if (!data) {
      return reply.code(200).send(minimalUser);
    }

    if (data.role === 'ADMIN' || data.username === username) {
      return reply.code(200).send(user);
    } else {
      return reply.code(200).send(minimalUser);
    }
  }

  async getAllUsers(request, reply) {
    const users = await prisma.user.findMany({
      orderBy: [{ role: 'desc' }, { id: 'asc' }],
    });

    const data = getUserDataFromRequest(request);

    if (data.role === 'ADMIN') {
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
    const {
      username,
      strictPassword,
      verification: { a, x, result },
    } = request.body;

    if (result !== calculateVerification(a, x)) {
      reply.code(401).send({ error: 'Unauthorized' });

      return;
    }

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

    const newUser = await prisma.user.create({
      data: {
        username,
        strictPassword,
      },
    });

    reply
      .code(201)
      .send({ user: newUser, message: 'User created successfully' });
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

  async checkAccess(request, reply) {
    const { username } = request.params;

    if (!username) {
      reply.code(400).send({ error: 'Missing username' });

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

    const data = getUserDataFromRequest(request);

    if (data.username !== username) {
      reply.code(401).send({ error: 'Unauthorized' });

      return;
    }

    if (user.access === 'FULL') {
      reply.code(200).send({ message: 'Access granted' });

      return;
    }

    if (user.access === 'NONE') {
      reply.code(403).send({ error: 'Access denied' });

      return;
    }

    const expirationDuration = 7; //* in days
    const creationDate = new Date(user.createdAt);
    const expirationTime = creationDate.setDate(
      creationDate.getDate() + expirationDuration
    );

    const now = Date.now();

    if (now > expirationTime) {
      await prisma.user.update({
        where: {
          username,
        },
        data: {
          access: 'NONE',
        },
      });

      reply.code(403).send({ error: 'Access expired' });

      return;
    }

    reply.code(200).send({ message: 'Access granted' });
  }

  async verifyAccess(request, reply) {
    const { key } = request.body;

    const data = getUserDataFromRequest(request);

    if (!data) {
      reply.code(401).send({ error: 'Unauthorized' });

      return;
    }

    if (!data.username) {
      reply.code(400).send({ error: 'Missing username' });

      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!user) {
      reply.code(404).send({ error: 'User not found' });

      return;
    }

    const isVerified = verifyAccessKey(key, user.username);

    if (!isVerified) {
      reply.code(403).send({ error: 'Access denied' });

      return;
    }

    await prisma.user.update({
      where: {
        username: data.username,
      },
      data: {
        access: 'FULL',
      },
    });

    reply.code(204).send({ message: 'Access granted' });
  }

  async setNewPassword(request, reply) {
    const { username } = request.params;
    const { newPassword } = request.body;

    if (!username || !newPassword) {
      reply.code(400).send({ error: 'Missing required field(s)' });

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
      reply.code(400).send({ error: 'User already has a password' });

      return;
    }

    const { valid, rule } = validatePassword(newPassword);

    if (user.strictPassword && !valid) {
      reply.code(400).send({ error: rule });

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

    const { valid, rule } = validatePassword(newPassword);

    if (user.strictPassword && !valid) {
      reply.code(400).send({ error: rule });

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
    const { username } = request.params;
    const { banned } = request.body;

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
        banned,
      },
    });

    reply.code(204);
  }

  async changePasswordStrictness(request, reply) {
    const { username } = request.params;
    const { strictPassword } = request.body;

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
        strictPassword,
      },
    });

    reply.code(204);
  }
}

const userController = new UserController();

module.exports = Object.freeze(userController);
