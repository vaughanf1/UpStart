// Fallback for Prisma when database is not available
export const prismaFallback = {
  user: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
  },
  idea: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    findUnique: () => Promise.resolve(null),
  },
  analysis: {
    create: () => Promise.resolve({}),
    findMany: () => Promise.resolve([]),
  },
  keyword: {
    createMany: () => Promise.resolve({}),
  },
  communitySignal: {
    createMany: () => Promise.resolve({}),
  },
};

export function getPrismaClient() {
  try {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient();
  } catch (error) {
    console.warn('Prisma client not available, using fallback');
    return prismaFallback as any;
  }
}