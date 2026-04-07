import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña requeridos' }, { status: 400 })
    }

    // Verificar usuario
    if (username !== process.env.ADMIN_USERNAME) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    // Verificar contraseña contra hash bcrypt
    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    // Generar token JWT
    const token = signToken({ username, role: 'admin' })
    const response = NextResponse.json({ ok: true })
    setAuthCookie(response, token)

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
