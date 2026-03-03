import React, { useState, useMemo } from 'react'
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/format'

export default function Sales({ sales, onDelete }) {
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [yearFilter, setYearFilter] = useState('all')

  const years = useMemo(() => {
    const y = new Set(sales.map(s => s.saleDate?.slice(0, 4)).filter(Boolean))
    return Array.from(y).sort((a, b) => b - a)
  }, [sales])

  const filtered = useMemo(() => {
    let items = [...sales]
    if (filterCat !== 'All') items = items.filter(s => s.category === filterCat)
    if (yearFilter !== 'all') items = items.filter(s => s.saleDate?.startsWith(yearFilter))
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(s =>
        s.itemName.toLowerCase().includes(q) ||
        (s.buyer || '').toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      )
    }
    items.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.saleDate) - new Date(a.saleDate)
      if (sortBy === 'date_asc') return new Date(a.saleDate) - new Date(b.saleDate)
      if (sortBy === 'profit_desc') return b.profit - a.profit
      if (sortBy === 'price_desc') return b.salePrice - a.salePrice
      return 0
    })
    return items
  }, [sales, filterCat, search, sortBy, yearFilter])

  const totals = useMemo(() => ({
    revenue: filtered.reduce((s, x) => s + x.salePrice, 0),
    profit: filtered.reduce((s, x) => s + x.profit, 0),
    cost: filtered.reduce((s, x) => s + x.purchasePrice, 0),
    count: filtered.length,
  }), [filtered])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>💵 Sales History</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          All recorded sales and profit data
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Sales', val: totals.count, icon: '🧾', color: 'var(--text)' },
          { label: 'Revenue', val: formatCurrency(totals.revenue), icon: '💰', color: 'var(--blue)' },
          { label: 'Total Cost', val: formatCurrency(totals.cost), icon: '💵', color: 'var(--gray-700)' },
          { label: 'Profit', val: formatCurrency(totals.profit), icon: '📈', color: totals.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' },
          { label: 'Avg Profit/Sale', val: totals.count ? formatCurrency(totals.profit / totals.count) : '—', icon: '📊', color: 'var(--orange)' },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', color }}>{val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search sales..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="profit_desc">Highest Profit</option>
          <option value="price_desc">Highest Price</option>
        </select>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {filtered.length} sale{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">💵</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No sales recorded</div>
            <div style={{ fontSize: '0.875rem' }}>Sell items from the Inventory page to see them here</div>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Sale Date</th>
                <th>Cost</th>
                <th>Sale Price</th>
                <th>Profit</th>
                <th>Margin</th>
                <th>Buyer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const margin = s.salePrice > 0 ? ((s.profit / s.salePrice) * 100).toFixed(1) : '0.0'
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.itemName}</div>
                      {s.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.notes}</div>}
                    </td>
                    <td>
                      <span className={`badge ${CATEGORY_COLORS[s.category] || 'badge-gray'}`}>
                        {CATEGORY_ICONS[s.category]} {s.category}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{formatDate(s.saleDate)}</td>
                    <td style={{ color: 'var(--gray-600)' }}>{formatCurrency(s.purchasePrice)}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(s.salePrice)}</td>
                    <td style={{ fontWeight: 700, color: s.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                      {s.profit >= 0 ? '+' : ''}{formatCurrency(s.profit)}
                    </td>
                    <td>
                      <span className={`badge ${parseFloat(margin) >= 20 ? 'badge-green' : parseFloat(margin) >= 0 ? 'badge-blue' : 'badge-red'}`}>
                        {margin}%
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>{s.buyer || '—'}</td>
                    <td>
                      <button className="btn-danger btn-sm" onClick={() => {
                        if (confirm(`Delete this sale record for "${s.itemName}"? The item will return to inventory.`)) onDelete(s.id)
                      }}>Del</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--gray-50)', fontWeight: 700 }}>
                <td colSpan={3} style={{ fontWeight: 700, color: 'var(--gray-600)', fontSize: '0.8125rem' }}>TOTALS ({filtered.length} sales)</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(totals.cost)}</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(totals.revenue)}</td>
                <td style={{ fontWeight: 800, color: totals.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                  {totals.profit >= 0 ? '+' : ''}{formatCurrency(totals.profit)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
