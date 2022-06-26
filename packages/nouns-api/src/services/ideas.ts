import { prisma } from '../api';

class IdeasService {
  static async all() {
    const allIdeas = await prisma.idea.findMany();
    return allIdeas;
  }

  static async get(id: number) {
    const idea = await prisma.idea.findUnique({
      where: { id: id },
    });

    return idea;
  }

  static async createIdea(data: any) {
    try {
      const idea = await prisma.idea.create({
        data: {
          title: data.title,
          tldr: data.tldr,
          description: data.description,
          creatorId: '0x65A3870F48B5237f27f674Ec42eA1E017E111D63',
        },
      });

      return idea;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

export default IdeasService;
