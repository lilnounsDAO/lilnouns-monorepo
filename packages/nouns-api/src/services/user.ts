import { prisma } from '../api';

class UserService {
  static async allUsers() {
    try {

      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: { comments: true, votes: true, ideas: true },
          },
        },
      });

      return users;
    } catch (e: any) {
      throw e;
    }
  }

  static async getUser(wallet: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          wallet,
        },
        include: {
          _count: {
            select: { comments: true, votes: true, ideas: true },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (e: any) {
      throw e;
    }
  }
}

export default UserService;
