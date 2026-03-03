import React, { useState } from 'react'
import { useStore } from './hooks/useStore'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'
import Sales from './components/Sales'
import Reports from './components/Reports'
import Calculator from './components/Calculator'
import './App.css'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚓' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'sales', label: 'Sales', icon: '💵' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'calculator', label: 'Calculator', icon: '🧮' },
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const {
    inventory,
    sales,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    recordSale,
    deleteSale,
    getStats,
    getYearlyStats,
  } = useStore()

  const stats = getStats()

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-anchor">⚓</div>
          {sidebarOpen && (
            <div>
              <div className="logo-title">Marine Parts</div>
              <div className="logo-sub">Business Manager</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'nav-active' : ''}`}
              onClick={() => setPage(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Quick Stats at Bottom */}
        {sidebarOpen && (
          <div className="sidebar-stats">
            <div className="stat-row">
              <span>In Stock</span>
              <strong>{stats.inStockCount}</strong>
            </div>
            <div className="stat-row">
              <span>Total Profit</span>
              <strong style={{ color: stats.totalProfit >= 0 ? '#4ade80' : '#f87171' }}>
                ${(stats.totalProfit / 1000).toFixed(1)}k
              </strong>
            </div>
          </div>
        )}

        {/* Toggle */}
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-inner">
          {page === 'dashboard' && (
            <Dashboard
              inventory={inventory}
              sales={sales}
              getStats={getStats}
              getYearlyStats={getYearlyStats}
              onNavigate={setPage}
            />
          )}
          {page === 'inventory' && (
            <Inventory
              inventory={inventory}
              onAdd={addInventoryItem}
              onUpdate={updateInventoryItem}
              onDelete={deleteInventoryItem}
              onSell={recordSale}
            />
          )}
          {page === 'sales' && (
            <Sales
              sales={sales}
              onDelete={deleteSale}
            />
          )}
          {page === 'reports' && (
            <Reports
              sales={sales}
              inventory={inventory}
              getYearlyStats={getYearlyStats}
            />
          )}
          {page === 'calculator' && <Calculator />}
        </div>
      </main>
    </div>
  )
}
