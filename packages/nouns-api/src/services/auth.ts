import { prisma } from '../api';
import { signAccessToken } from '../utils/jwt';
import { generateNonce } from 'siwe';

class AuthService {
  static async register(data: any) {
    try {
      const user = await prisma.user.create({
        data,
      });

      return user;
    } catch (e: any) {
      throw e;
    }
  }

  static async update(data: { wallet: string; lilnounCount: number }) {
    const { wallet } = data;
    try {
      const user = await prisma.user.update({
        where: {
          wallet,
        },
        data,
      });

      return user;
    } catch (e: any) {
      throw e;
    }
  }

  static async getNonce() {
    try {
      return generateNonce();
    } catch (e: any) {
      throw e;
    }
  }

  static async login(data: { wallet: string; lilnounCount: number }) {
    const { wallet } = data;
    try {
      let user = await prisma.user.findUnique({
        where: {
          wallet,
        },
      });

      if (!user) {
        user = await this.register(data);
      } else {
        user = await this.update(data);
      }

      const accessToken = await signAccessToken({ wallet: user.wallet, lilnounCount: user.lilnounCount });
      return { ...user, accessToken };
    } catch (e: any) {
      throw e;
    }
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }

  static async syncUserTokenCounts(data: { to: string; from: string }) {
    try {
      const toUser = await prisma.user.findUnique({
        where: {
          wallet: data.to,
        },
      });

      const fromUser = await prisma.user.findUnique({
        where: {
          wallet: data.from,
        },
      });

      if (!fromUser && !toUser) {
        throw new Error('No users to update');
      }

      if (toUser) {
        await this.update({ wallet: data.to, lilnounCount: toUser.lilnounCount + 1 });
      }

      if (fromUser) {
        await this.update({ wallet: data.from, lilnounCount: fromUser.lilnounCount - 1 });
      }
    } catch (e: any) {
      throw e;
    }
  }
}

export default AuthService;
