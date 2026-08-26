import prisma from "../lib/prisma.js";

class DatabaseService {
  constructor() {
    this.prisma = prisma;
  }

  async transaction(work, options = {}) {
    return this.prisma.$transaction(work, options);
  }
}

export default DatabaseService;