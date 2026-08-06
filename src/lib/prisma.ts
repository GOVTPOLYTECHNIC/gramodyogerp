// Prisma client — only used in local/dev environments.
// On Netlify/serverless, Prisma native binaries are not available.
// All production auth/data operations use Supabase instead.

let prisma: any = null;

try {
  // Dynamic require to prevent build-time crash on serverless
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@/generated/prisma/client");
  const globalForPrisma = globalThis as unknown as { prisma?: typeof PrismaClient };
  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ log: ["query", "error", "warn"] });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch {
  // Native binary not available in this environment (e.g. Netlify serverless)
  // Use Supabase client for all data operations instead
  prisma = null;
}

export { prisma };
