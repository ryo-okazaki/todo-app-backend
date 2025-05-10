import { v4 as uuidv4 } from 'uuid';

import { prisma } from "../utils/prisma";
import { VerifyTokenStatus } from "../enums/verify-token-status";
import { UserStatus } from "../enums/user-status";


class UserRepository {
  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByToken(token) {
    const userToken = await prisma.verificationToken.findFirst({
      where: { token },
      include: {
        user: true,
      }
    });

    return userToken.user;
  }

  async createUser(userData) {
    const verificationToken = uuidv4();

    return prisma.user.create({
      data: {
        ...userData,
        status: UserStatus.PENDING,
        token: {
          create: {
            token: verificationToken,
            status: VerifyTokenStatus.ACTIVATING,
          }
        }
      },
      include: {
        token: true,
      }
    });
  }

  async activateUser(userId) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          status: UserStatus.ACTIVATED,
        }
      });

      await tx.verificationToken.updateMany({
        where: { id: userId },
        data: {
          status: VerifyTokenStatus.USED,
        }
      });
    })
  }
}

export default new UserRepository();
