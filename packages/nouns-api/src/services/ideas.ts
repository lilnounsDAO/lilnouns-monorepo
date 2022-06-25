import { prisma } from '../api';

class IdeasService {
  static async all() {
    const allIdeas = await prisma.idea.findMany();
    return allIdeas;
  }

  static async createIdea() {
    // Add prisma create logic

    return this.all();
  }
}

export default IdeasService;