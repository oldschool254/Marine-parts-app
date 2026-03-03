import React, { useMemo } from 'react'
import { formatCurrency, MONTH_NAMES, CATEGORY_ICONS } from '../utils/format'

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            {label}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: color || 'var(--text)', lineHeight: 1.1 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{sub}</div>}
        </div>
        <div style={{ fontSize: '2rem', opacity: 0.7 }}>{icon}</div>
      </div>
    </div>
  )
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--gray-700)' }}>{label}</span>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{formatCurrency(value)}</span>
      </div>
      <div style={{ height: '6px', borderRadius: '99px', background: 'var(--gray-100)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

export default function Dashboard({ inventory, sales, getStats, getYearlyStats, onNavigate }) {
  const stats = getStats()
  const currentYear = new Date().getFullYear()
  const yearStats = getYearlyStats(currentYear)

  const recentSales = useMemo(() =>
    [...sales].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate)).slice(0, 5),
    [sales]
  )

  const recentPurchases = useMemo(() =>
    [...inventory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [inventory]
  )

  const monthlyMax = useMemo(() => {
    const vals = Object.values(yearStats.months).map(m => m.profit)
    return Math.max(...vals, 1)
  }, [yearStats])

  const topCategory = useMemo(() => {
    const cats = Object.entries(yearStats.categories)
    if (!cats.length) return null
    return cats.sort((a, b) => b[1].profit - a[1].profit)[0]
  }, [yearStats])

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--navy)' }}>
          ⚓ Marine Parts Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Business overview & performance at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard
          label="Total Invested"
          value={formatCurrency(stats.totalInvested)}
          sub={`${inventory.length} items purchased`}
          icon="💵"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          sub={`${stats.soldCount} items sold`}
          color="var(--blue)"
          icon="💰"
        />
        <StatCard
          label="Total Profit"
          value={formatCurrency(stats.totalProfit)}
          sub={stats.totalRevenue > 0 ? `${((stats.totalProfit / stats.totalRevenue) * 100).toFixed(1)}% margin` : ''}
          color={stats.totalProfit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)'}
          icon="📈"
        />
        <StatCard
          label="In Stock"
          value={stats.inStockCount}
          sub={`Worth ${formatCurrency(stats.inStockValue)}`}
          color="var(--orange)"
          icon="🏪"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Monthly Profit Chart (text bars) */}
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Monthly Profit — {currentYear}</h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{yearStats.itemsSold} sold</span>
          </div>
          {Object.entries(yearStats.months).map(([m, data]) => (
            <MiniBar
              key={m}
              label={MONTH_NAMES[m - 1].slice(0, 3)}
              value={data.profit}
              max={monthlyMax}
              color={data.profit >= 0 ? 'var(--green)' : 'var(--red)'}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Year Stats */}
          <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>{currentYear} Summary</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { label: 'Revenue', val: formatCurrency(yearStats.revenue), color: 'var(--blue)' },
                { label: 'Profit', val: formatCurrency(yearStats.profit), color: yearStats.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' },
                { label: 'Invested', val: formatCurrency(yearStats.invested), color: 'var(--gray-700)' },
                { label: 'Items Bought', val: yearStats.itemsBought, color: 'var(--orange)' },
                { label: 'Items Sold', val: yearStats.itemsSold, color: 'var(--blue)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Category */}
          {topCategory && (
            <div className="card" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)' }}>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Top Category This Year
              </div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                {CATEGORY_ICONS[topCategory[0]] || '📦'} {topCategory[0]}
              </div>
              <div style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '1.1rem' }}>
                {formatCurrency(topCategory[1].profit)} profit
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {topCategory[1].count} item{topCategory[1].count !== 1 ? 's' : ''} sold
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Sales</h2>
            <button className="btn-ghost btn-sm" onClick={() => onNavigate('sales')}>View all</button>
          </div>
          {recentSales.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <div>No sales yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {recentSales.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.itemName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.saleDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: s.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)', fontSize: '0.875rem' }}>
                      +{formatCurrency(s.profit)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatCurrency(s.salePrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Purchases</h2>
            <button className="btn-ghost btn-sm" onClick={() => onNavigate('inventory')}>View all</button>
          </div>
          {recentPurchases.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem' }}>
              <div>No purchases yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {recentPurchases.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{i.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{i.category} • {i.purchaseDate}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(i.purchasePrice)}</div>
                    <div style={{ fontSize: '0.75rem' }}>
                      <span className={`badge ${i.status === 'sold' ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '0.7rem' }}>
                        {i.status === 'sold' ? 'Sold' : 'In Stock'}
                      </span>
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
