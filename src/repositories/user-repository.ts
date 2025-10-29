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

    const user = await prisma.user.create({
      data: {
        ...userData,
        status: UserStatus.PENDING,
        verificationToken: {
          create: {
            token: verificationToken,
            status: VerifyTokenStatus.ACTIVATING,
          }
        }
      }
    });

    return {
      ...user,
      token: verificationToken,
    };
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

  async savePasswordResetToken(userId: number, token: string, expiry: Date) {
    // 既存のアクティブなトークンを無効化
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        status: 1,
      },
      data: {
        status: 0,
      }
    });

    // 新しいトークンを作成
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiredAt: expiry,
        status: 1,
      }
    });
  }

  async findUserByPasswordResetToken(token: string) {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        status: 1,
        expiredAt: {
          gt: new Date()
        }
      },
      include: {
        user: true,
      }
    });

    if (!resetToken) {
      return null;
    }

    return {
      ...resetToken.user,
      resetTokenExpiry: resetToken.expiredAt
    };
  }

  async updatePassword(userId: number, hashedPassword: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      }
    });
  }

  async clearPasswordResetToken(userId: number) {
    // トークンのstatusを無効化(0)に設定
    await prisma.passwordResetToken.updateMany({
      where: { userId },
      data: {
        status: 0, // 無効化
      }
    });
  }
}

export default new UserRepository();
