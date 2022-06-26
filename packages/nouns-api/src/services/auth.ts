import { prisma } from '../api';
import { signAccessToken } from '../utils/jwt'
import { generateNonce } from 'siwe';

class AuthService {
  static async register(data: any) {
    const user = await prisma.user.create({
      data
    })
    data.accessToken = await signAccessToken(user);

    return data;
  }

  static async getNonce() {
    return generateNonce();
  }

  static async login(data: { wallet: string}) {
    const { wallet } = data;
    console.log(wallet)
    const user = await prisma.user.findUnique({
      where: {
        wallet,
      }
    });

    if (!user) {
      return this.register(data);
    }

    const accessToken = await signAccessToken(user)
    return { ...user, accessToken }
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }
}

export default AuthService;