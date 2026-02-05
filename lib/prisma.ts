/**
 * Prisma Client Singleton for Next.js with SQLite
 *
 * Prevents multiple PrismaClient instances during development hot reloading.
 * Uses the better-sqlite3 adapter for Prisma 7 compatibility.
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@/lib/generated/prisma/client'

const DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db'

const adapter = new PrismaBetterSqlite3({ url: DATABASE_URL })

const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * Global Prisma Client instance
 *
 * In development, the `next dev` command clears Node.js cache on each run,
 * which would initialize a new PrismaClient instance each time.
 * This singleton pattern prevents exhausting database connections.
 */
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
