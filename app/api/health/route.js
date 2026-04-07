import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    DATABASE_URL:          !!process.env.DATABASE_URL,
    JWT_SECRET:            !!process.env.JWT_SECRET,
    JWT_EXPIRES_IN:        !!process.env.JWT_EXPIRES_IN,
    ADMIN_USERNAME:        !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD:        !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_HASH:   !!process.env.ADMIN_PASSWORD_HASH,
    auth_configured:       !!(process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH),
  }

  const allOk = checks.DATABASE_URL && checks.JWT_SECRET && checks.JWT_EXPIRES_IN && checks.ADMIN_USERNAME && checks.auth_configured
  return NextResponse.json({ ok: allOk, checks }, { status: allOk ? 200 : 500 })
}
