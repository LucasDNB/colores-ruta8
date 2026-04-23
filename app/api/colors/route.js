import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getPool } from '@/lib/db'

export async function GET(request) {
  const user = requireAuth()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page     = Math.max(1, parseInt(searchParams.get('page')     || '1'))
  const pageSize = Math.min(200, parseInt(searchParams.get('pageSize') || '50'))
  const offset   = (page - 1) * pageSize

  const cliente    = searchParams.get('cliente')    || ''
  const color      = searchParams.get('color')      || ''
  const producto   = searchParams.get('producto')   || ''
  const fechaDesde = searchParams.get('fechaDesde') || ''
  const fechaHasta = searchParams.get('fechaHasta') || ''

  try {
    const pool = getPool()

    // Construir WHERE dinámico con parámetros numerados ($1, $2...)
    const conditions = []
    const values = []
    let idx = 1

    if (cliente) {
      conditions.push(`customer_name ILIKE $${idx++}`)
      values.push(`%${cliente}%`)
    }
    if (color) {
      const p1 = idx++, p2 = idx++, p3 = idx++
      conditions.push(`(color_name ILIKE $${p1} OR color_number_1 ILIKE $${p2} OR color_number_2 ILIKE $${p3})`)
      values.push(`%${color}%`, `%${color}%`, `%${color}%`)
    }
    if (producto) {
      conditions.push(`recipe_product_name ILIKE $${idx++}`)
      values.push(`%${producto}%`)
    }
    if (fechaDesde) {
      conditions.push(`created_date >= $${idx++}`)
      values.push(fechaDesde)
    }
    if (fechaHasta) {
      conditions.push(`created_date <= $${idx++}`)
      values.push(fechaHasta)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM customer_colors ${where}`,
      values
    )
    const total = parseInt(countResult.rows[0].total)

    values.push(pageSize, offset)
    const dataResult = await pool.query(
      `SELECT
          created_date                    AS "CreatedDate",
          customer_name                   AS "CustomerName",
          color_name                      AS "ColourName",
          color_number_1                  AS "ColorNumber1",
          color_number_2                  AS "ColorNumber2",
          recipe_product_name             AS "RecipeProductName",
          recipe_product_basepaint_name   AS "RecipeProductBasepaintName",
          delivery_can_size_amount        AS "DeliveryCantSizeAmount",
          delivery_number_of_cans         AS "DeliveryNumberOfCans"
       FROM customer_colors
       ${where}
       ORDER BY created_date DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      values
    )

    return NextResponse.json({ rows: dataResult.rows, total, page, pageSize })
  } catch (err) {
    console.error('DB error:', err)
    return NextResponse.json(
      { error: 'Error al consultar la base de datos', detail: err.message },
      { status: 500 }
    )
  }
}
