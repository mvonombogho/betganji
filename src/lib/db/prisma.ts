import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  maxConnections: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Configure Prisma client with connection pool
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'error', 'warn'],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const client = await pool.connect();
        try {
          const result = await query(args);
          return result;
        } finally {
          client.release();
        }
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma, pool };