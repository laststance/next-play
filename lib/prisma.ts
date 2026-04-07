/**
 * Prisma Client Singleton for Next.js with SQLite
 *
 * Prevents multiple PrismaClient instances during development hot reloading.
 * Uses the libSQL driver adapter; local `file:` access goes through the `libsql`
 * package (not `better-sqlite3`). If you change Prisma or DB drivers, run
 * `pnpm clean` once so Turbopack does not serve stale server chunks.
 *
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
 */

import 'dotenv/config'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { PrismaLibSql } from '@prisma/adapter-libsql'

import { PrismaClient } from '@/lib/generated/prisma/client'

/**
 * Normalizes SQLite `DATABASE_URL` to an absolute `file:` URL (`file:///...`)
 * so `@libsql/client` parses the path the same way on server and in dev.
 *
 * @returns Connection string for the Prisma libSQL adapter.
 */
function resolveSqliteUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  if (!raw.startsWith('file:')) {
    return raw
  }
  const filePath = raw.slice('file:'.length)
  if (path.isAbsolute(filePath)) {
    return pathToFileURL(filePath).href
  }
  const absolute = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    filePath,
  )
  return pathToFileURL(absolute).href
}

const DATABASE_URL = resolveSqliteUrl()

const adapter = new PrismaLibSql({
  url: DATABASE_URL,
})

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
