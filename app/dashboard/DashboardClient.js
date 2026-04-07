'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const PAGE_SIZE = 50

export default function DashboardClient() {
  const router = useRouter()
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    cliente: '',
    color: '',
    producto: '',
    fechaDesde: '',
    fechaHasta: '',
  })
  const [applied, setApplied] = useState(filters)

  const fetchData = useCallback(async (f, p) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        page: p,
        pageSize: PAGE_SIZE,
        ...(f.cliente    && { cliente: f.cliente }),
        ...(f.color      && { color: f.color }),
        ...(f.producto   && { producto: f.producto }),
        ...(f.fechaDesde && { fechaDesde: f.fechaDesde }),
        ...(f.fechaHasta && { fechaHasta: f.fechaHasta }),
      })
      const res = await fetch(`/api/colors?${params}`)
      if (res.status === 401) { router.push('/login'); return }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const detail = data?.detail || data?.error
        throw new Error(detail || 'Error al consultar la base de datos')
      }
      setRows(data.rows)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchData(applied, page)
  }, [applied, page, fetchData])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    setApplied(filters)
  }

  function handleClear() {
    const empty = { cliente: '', color: '', producto: '', fechaDesde: '', fechaHasta: '' }
    setFilters(empty)
    setApplied(empty)
    setPage(1)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function formatDate(val) {
    if (!val) return '—'
    try { return new Date(val).toLocaleDateString('es-AR') } catch { return val }
  }

  function fmt(val) {
    return val === null || val === undefined || val === '' ? '—' : val
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Mix2Win</h1>
              <p className="text-xs text-gray-500">Customer Colors</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filtros de búsqueda
          </h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cliente</label>
                <input className="input" placeholder="Ej: Juan García" value={filters.cliente}
                  onChange={(e) => setFilters({ ...filters, cliente: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <input className="input" placeholder="Ej: Blanco Nieve" value={filters.color}
                  onChange={(e) => setFilters({ ...filters, color: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Producto</label>
                <input className="input" placeholder="Ej: Látex Interior" value={filters.producto}
                  onChange={(e) => setFilters({ ...filters, producto: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha desde</label>
                <input type="date" className="input" value={filters.fechaDesde}
                  onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fecha hasta</label>
                <input type="date" className="input" value={filters.fechaHasta}
                  onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn-primary text-sm">
                Buscar
              </button>
              <button type="button" onClick={handleClear} className="btn-secondary text-sm">
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Info bar */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {loading ? 'Cargando...' : `${total.toLocaleString('es-AR')} resultado${total !== 1 ? 's' : ''}`}
            </span>
            {totalPages > 1 && (
              <span className="text-sm text-gray-500">
                Página {page} de {totalPages}
              </span>
            )}
          </div>

          {error && (
            <div className="m-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['FECHA','CLIENTE','COLOR','CÓDIGO 1','CÓDIGO 2','PRODUCTO','BASE','LITROS','CANTIDAD'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        <span>Consultando base de datos...</span>
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>No se encontraron resultados</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr key={i} className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">{formatDate(row.CreatedDate)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium max-w-[160px] truncate" title={row.CustomerName}>{fmt(row.CustomerName)}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate" title={row.ColourName}>{fmt(row.ColourName)}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{fmt(row.ColorNumber1)}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">{fmt(row.ColorNumber2)}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate" title={row.RecipeProductName}>{fmt(row.RecipeProductName)}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[120px] truncate" title={row.RecipeProductBasepaintName}>{fmt(row.RecipeProductBasepaintName)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">{fmt(row.DeliveryCantSizeAmount)}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">{fmt(row.DeliveryNumberOfCans)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="btn-secondary text-sm"
              >
                ← Anterior
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p
                  if (totalPages <= 5) p = i + 1
                  else if (page <= 3) p = i + 1
                  else if (page >= totalPages - 2) p = totalPages - 4 + i
                  else p = page - 2 + i
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="btn-secondary text-sm"
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
