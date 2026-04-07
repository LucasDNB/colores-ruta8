import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    DATABASE_URL:          !!process.env.DATABASE_URL,
    JWT_SECRET:            !!process.env.JWT_SECRET,
    JWT_EXPIRES_IN:        !!process.env.JWT_EXPIRES_IN,
    ADMIN_USERNAME:        !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD_HASH:   !!process.env.ADMIN_PASSWORD_HASH,
    hash_starts_correctly: process.env.ADMIN_PASSWORD_HASH?.startsWith('$2'),
    hash_length:           process.env.ADMIN_PASSWORD_HASH?.length ?? 0,
  }

  const allOk = Object.values(checks).every(v => v === true)
  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 })
}
