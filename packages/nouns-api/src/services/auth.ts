import { prisma } from '../api';
import { signAccessToken } from '../utils/jwt';
import { generateNonce } from 'siwe';

class AuthService {
  static async register(data: any) {
    try {
      const user = await prisma.user.create({
        data,
      });
      data.accessToken = await signAccessToken(user);

      return data;
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

  static async login(data: { wallet: string }) {
    const { wallet } = data;
    try {
      const user = await prisma.user.findUnique({
        where: {
          wallet,
        },
      });

      if (!user) {
        return this.register(data);
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
