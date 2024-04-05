'use strict';

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class AdminController {
  async getUsers(_, reply) {
    const users = await prisma.user.findMany();

    return reply.code(200).send(users);
  }

  async createUser(request, reply) {
    const { username } = request.body;

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

    await prisma.user.delete({
      where: {
        username,
      },
    });

    reply.code(204).send({ message: 'User deleted successfully' });
  }

  async changeUserStatus(request, reply) {
    const { username } = request.params;

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

    const newUserStatus = user.banned ? 'unbanned' : 'banned';

    reply.code(204).send({ message: `User ${newUserStatus}` });
  }

  async changeUserPasswordStrictness(request, reply) {
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

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        strictPassword: !user.strictPassword,
      },
    });

    const newPasswordPolicy = user.strictPassword ? 'disabled' : 'enabled';

    reply.code(204).send({ message: `Password policy ${newPasswordPolicy}` });
  }
}

const adminController = new AdminController();

module.exports = Object.freeze(adminController);
