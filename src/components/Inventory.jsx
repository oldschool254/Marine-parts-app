import React, { useState, useMemo } from 'react'
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/format'

function AddItemModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Boat Trailer',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    seller: '',
    condition: 'Good',
    year: '',
    make: '',
    model: '',
    notes: '',
  })

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.purchasePrice) return
    onSave(form)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>🛒 Add Purchase</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Item Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. 2018 EZ Loader Trailer" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)}>
                  {['Excellent','Good','Fair','Poor','Parts Only'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input type="number" min="0" step="0.01" value={form.purchasePrice} onChange={e => set('purchasePrice', e.target.value)} placeholder="0.00" required />
              </div>
              <div className="form-group">
                <label>Purchase Date</label>
                <input type="date" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Year (if applicable)</label>
                <input type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder="e.g. 2018" />
              </div>
              <div className="form-group">
                <label>Make / Brand</label>
                <input value={form.make} onChange={e => set('make', e.target.value)} placeholder="e.g. Mercury" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Model</label>
                <input value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. 150hp" />
              </div>
              <div className="form-group">
                <label>Bought From</label>
                <input value={form.seller} onChange={e => set('seller', e.target.value)} placeholder="Seller name" />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any additional details..." style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-success">Save Purchase</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState({ ...item })
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>✏️ Edit Item</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Item Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)}>
                  {['Excellent','Good','Fair','Poor','Parts Only'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input type="number" min="0" step="0.01" value={form.purchasePrice} onChange={e => set('purchasePrice', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Purchase Date</label>
                <input type="date" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input type="number" value={form.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 2018" />
              </div>
              <div className="form-group">
                <label>Make / Brand</label>
                <input value={form.make || ''} onChange={e => set('make', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Model</label>
                <input value={form.model || ''} onChange={e => set('model', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Bought From</label>
                <input value={form.seller || ''} onChange={e => set('seller', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SellItemModal({ item, onSell, onClose }) {
  const [form, setForm] = useState({
    salePrice: '',
    saleDate: new Date().toISOString().split('T')[0],
    buyer: '',
    notes: '',
  })
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const profit = (parseFloat(form.salePrice) || 0) - (parseFloat(item.purchasePrice) || 0)

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>💵 Record Sale</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', marginBottom: '1.25rem', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700 }}>{item.name}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.category} • Purchased for {formatCurrency(item.purchasePrice)}</div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sale Price *</label>
              <input type="number" min="0" step="0.01" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="0.00" autoFocus />
            </div>
            <div className="form-group">
              <label>Sale Date</label>
              <input type="date" value={form.saleDate} onChange={e => set('saleDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Buyer Name</label>
            <input value={form.buyer} onChange={e => set('buyer', e.target.value)} placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} style={{ resize: 'vertical' }} />
          </div>

          {form.salePrice && (
            <div style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: profit >= 0 ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${profit >= 0 ? '#bbf7d0' : '#fecaca'}`,
              marginTop: '0.25rem'
            }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '0.2rem' }}>Estimated Profit</div>
              <div style={{ fontWeight: 800, fontSize: '1.375rem', color: profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
              </div>
              {profit < 0 && <div style={{ fontSize: '0.8rem', color: 'var(--red-dark)', marginTop: '0.2rem' }}>⚠️ Selling below purchase price</div>}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn-success"
            onClick={() => form.salePrice && onSell(form)}
            disabled={!form.salePrice}
          >
            Record Sale
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Inventory({ inventory, onAdd, onUpdate, onDelete, onSell }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [sellItem, setSellItem] = useState(null)
  const [filterStatus, setFilterStatus] = useState('in_stock')
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  const filtered = useMemo(() => {
    let items = [...inventory]

    if (filterStatus !== 'all') items = items.filter(i => i.status === filterStatus)
    if (filterCat !== 'All') items = items.filter(i => i.category === filterCat)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.make || '').toLowerCase().includes(q) ||
        (i.model || '').toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
      )
    }

    items.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'date_asc') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'price_desc') return (parseFloat(b.purchasePrice) || 0) - (parseFloat(a.purchasePrice) || 0)
      if (sortBy === 'price_asc') return (parseFloat(a.purchasePrice) || 0) - (parseFloat(b.purchasePrice) || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
    return items
  }, [inventory, filterStatus, filterCat, search, sortBy])

  const inStockTotal = inventory.filter(i => i.status === 'in_stock').reduce((s, i) => s + (parseFloat(i.purchasePrice) || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>📦 Inventory</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {inventory.filter(i => i.status === 'in_stock').length} in stock • {formatCurrency(inStockTotal)} invested
          </p>
        </div>
        <button className="btn-success" style={{ fontSize: '0.9375rem', padding: '0.625rem 1.375rem' }} onClick={() => setShowAdd(true)}>
          + Add Purchase
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="sold">Sold</option>
        </select>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 'auto' }}>
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="name">Name A-Z</option>
        </select>
        <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No items found</div>
            <div style={{ fontSize: '0.875rem' }}>Try adjusting your filters or add a new purchase</div>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Condition</th>
                <th>Purchased</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    {(item.make || item.model || item.year) && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {[item.year, item.make, item.model].filter(Boolean).join(' ')}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${CATEGORY_COLORS[item.category] || 'badge-gray'}`}>
                      {CATEGORY_ICONS[item.category]} {item.category}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gray-600)', fontSize: '0.8125rem' }}>{item.condition || '—'}</td>
                  <td style={{ color: 'var(--gray-600)', fontSize: '0.8125rem' }}>
                    {formatDate(item.purchaseDate)}
                    {item.seller && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>from {item.seller}</div>}
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(item.purchasePrice)}</td>
                  <td>
                    <span className={`badge ${item.status === 'sold' ? 'badge-green' : 'badge-orange'}`}>
                      {item.status === 'sold' ? '✓ Sold' : '● In Stock'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {item.status === 'in_stock' && (
                        <button className="btn-success btn-sm" onClick={() => setSellItem(item)}>
                          Sell
                        </button>
                      )}
                      <button className="btn-ghost btn-sm" onClick={() => setEditItem(item)}>Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => {
                        if (confirm(`Delete "${item.name}"? This cannot be undone.`)) onDelete(item.id)
                      }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <AddItemModal
          onSave={item => { onAdd(item); setShowAdd(false) }}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editItem && (
        <EditItemModal
          item={editItem}
          onSave={form => { onUpdate(editItem.id, form); setEditItem(null) }}
          onClose={() => setEditItem(null)}
        />
      )}
      {sellItem && (
        <SellItemModal
          item={sellItem}
          onSell={form => { onSell(sellItem.id, form); setSellItem(null) }}
          onClose={() => setSellItem(null)}
        />
      )}
    </div>
  )
}
