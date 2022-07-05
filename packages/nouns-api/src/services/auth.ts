import { prisma } from '../api';
import { signAccessToken } from '../utils/jwt';
import { generateNonce } from 'siwe';

class AuthService {
  static async register(data: any) {
    try {
      const user = await prisma.user.create({
        data,
      });
      console.log(user);
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
        user = await this.update(data); // Could do this update async
      }

      const accessToken = await signAccessToken(user);
      return { ...user, accessToken };
    } catch (e: any) {
      throw e;
    }
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }
}

export default AuthService;
