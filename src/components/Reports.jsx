import React, { useState, useMemo } from 'react'
import { formatCurrency, MONTH_NAMES, getAvailableYears, CATEGORY_ICONS } from '../utils/format'

function ProgressBar({ value, max, color, label, sub }) {
  const pct = max > 0 ? Math.min((Math.abs(value) / Math.abs(max)) * 100, 100) : 0
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 700, color }}>{formatCurrency(value)}</span>
          {sub && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{sub}</span>}
        </div>
      </div>
      <div style={{ height: '8px', borderRadius: '99px', background: 'var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export default function Reports({ sales, inventory, getYearlyStats }) {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const years = useMemo(() => getAvailableYears(sales, inventory), [sales, inventory])
  const stats = useMemo(() => getYearlyStats(year), [year, getYearlyStats])

  const maxMonthRevenue = useMemo(() =>
    Math.max(...Object.values(stats.months).map(m => m.revenue), 1),
    [stats]
  )
  const maxMonthProfit = useMemo(() =>
    Math.max(...Object.values(stats.months).map(m => Math.abs(m.profit)), 1),
    [stats]
  )

  const topSales = useMemo(() =>
    sales
      .filter(s => s.saleDate?.startsWith(String(year)))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5),
    [sales, year]
  )

  const categoryEntries = Object.entries(stats.categories).sort((a, b) => b[1].profit - a[1].profit)
  const maxCatProfit = categoryEntries.length ? Math.max(...categoryEntries.map(([, v]) => Math.abs(v.profit)), 1) : 1

  const roi = stats.invested > 0 ? ((stats.profit / stats.invested) * 100).toFixed(1) : null
  const margin = stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : null

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>📊 Profit Reports</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Yearly and monthly performance breakdown</p>
        </div>
        <select value={year} onChange={e => setYear(parseInt(e.target.value))} style={{ width: 'auto', fontWeight: 700, fontSize: '1rem' }}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Year Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Revenue', val: formatCurrency(stats.revenue), color: 'var(--blue)', icon: '💰' },
          { label: 'Total Cost', val: formatCurrency(stats.invested), color: 'var(--gray-700)', icon: '💵' },
          { label: 'Net Profit', val: formatCurrency(stats.profit), color: stats.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)', icon: '📈' },
          { label: 'Items Bought', val: stats.itemsBought, color: 'var(--orange)', icon: '📥' },
          { label: 'Items Sold', val: stats.itemsSold, color: 'var(--blue)', icon: '📤' },
          { label: 'ROI', val: roi ? `${roi}%` : '—', color: parseFloat(roi) >= 0 ? 'var(--green-dark)' : 'var(--red-dark)', icon: '🎯' },
          { label: 'Margin', val: margin ? `${margin}%` : '—', color: parseFloat(margin) >= 20 ? 'var(--green-dark)' : 'var(--blue)', icon: '📐' },
        ].map(({ label, val, color, icon }) => (
          <div key={label} className="card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', color }}>{val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Monthly Revenue */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Monthly Revenue — {year}</h2>
          {Object.entries(stats.months).map(([m, data]) => (
            <ProgressBar
              key={m}
              label={MONTH_NAMES[m - 1]}
              value={data.revenue}
              max={maxMonthRevenue}
              color="var(--blue-light)"
              sub={data.count ? `${data.count} sale${data.count !== 1 ? 's' : ''}` : undefined}
            />
          ))}
        </div>

        {/* Monthly Profit */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Monthly Profit — {year}</h2>
          {Object.entries(stats.months).map(([m, data]) => (
            <ProgressBar
              key={m}
              label={MONTH_NAMES[m - 1]}
              value={data.profit}
              max={maxMonthProfit}
              color={data.profit >= 0 ? 'var(--green)' : 'var(--red)'}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* By Category */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Profit by Category — {year}</h2>
          {categoryEntries.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>No sales this year</div>
          ) : (
            categoryEntries.map(([cat, data]) => (
              <div key={cat} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {CATEGORY_ICONS[cat] || '📦'} {cat}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: data.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                      {formatCurrency(data.profit)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      {data.count} sold
                    </span>
                  </div>
                </div>
                <div style={{ height: '8px', borderRadius: '99px', background: 'var(--gray-100)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(Math.abs(data.profit) / maxCatProfit) * 100}%`,
                    background: data.profit >= 0 ? 'var(--green)' : 'var(--red)',
                    borderRadius: '99px',
                    transition: 'width 0.5s'
                  }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Revenue: {formatCurrency(data.revenue)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top Sales */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Profitable Sales — {year}</h2>
          {topSales.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>No sales this year</div>
          ) : (
            <div>
              {topSales.map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem 0',
                  borderBottom: i < topSales.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i === 0 ? '#fef08a' : i === 1 ? '#e2e8f0' : i === 2 ? '#fed7aa' : 'var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.itemName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.saleDate} • {formatCurrency(s.salePrice)}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: s.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                      {s.profit >= 0 ? '+' : ''}{formatCurrency(s.profit)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {s.salePrice > 0 ? ((s.profit / s.salePrice) * 100).toFixed(1) : 0}% margin
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
