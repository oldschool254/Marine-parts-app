import React, { useState, useMemo } from 'react'
import { formatCurrency } from '../utils/format'

function Section({ title, icon, children }) {
  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  )
}

function ResultRow({ label, value, bold, color, big }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.5rem 0', borderBottom: '1px solid var(--border)'
    }}>
      <span style={{ fontSize: big ? '1rem' : '0.875rem', color: bold ? 'var(--text)' : 'var(--gray-600)', fontWeight: bold ? 700 : 400 }}>
        {label}
      </span>
      <span style={{ fontWeight: bold ? 800 : 600, color: color || 'var(--text)', fontSize: big ? '1.125rem' : '0.875rem' }}>
        {value}
      </span>
    </div>
  )
}

function ProfitCalc() {
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [fees, setFees] = useState('')
  const [repairs, setRepairs] = useState('')
  const [tax, setTax] = useState('')

  const buy = parseFloat(buyPrice) || 0
  const sell = parseFloat(sellPrice) || 0
  const feeAmt = parseFloat(fees) || 0
  const repairAmt = parseFloat(repairs) || 0
  const taxAmt = parseFloat(tax) || 0
  const totalCost = buy + feeAmt + repairAmt + taxAmt
  const profit = sell - totalCost
  const margin = sell > 0 ? ((profit / sell) * 100) : 0
  const roi = totalCost > 0 ? ((profit / totalCost) * 100) : 0

  return (
    <Section title="Profit / Loss Calculator" icon="💰">
      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Purchase Price ($)</label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Selling Price ($)</label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
        </div>
      </div>
      <div className="form-row" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Listing / Platform Fees ($)</label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={fees} onChange={e => setFees(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Repair / Refurb Costs ($)</label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={repairs} onChange={e => setRepairs(e.target.value)} />
        </div>
      </div>
      <div className="form-group" style={{ maxWidth: '50%' }}>
        <label>Tax / Other Costs ($)</label>
        <input type="number" min="0" step="0.01" placeholder="0.00" value={tax} onChange={e => setTax(e.target.value)} />
      </div>

      <hr className="divider" />

      <div>
        <ResultRow label="Purchase Price" value={formatCurrency(buy)} />
        <ResultRow label="Fees & Other Costs" value={formatCurrency(feeAmt + repairAmt + taxAmt)} />
        <ResultRow label="Total Cost" value={formatCurrency(totalCost)} bold />
        <ResultRow label="Selling Price" value={formatCurrency(sell)} bold />
        <ResultRow
          label="Net Profit / Loss"
          value={`${profit >= 0 ? '+' : ''}${formatCurrency(profit)}`}
          bold big
          color={profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)'}
        />
        <ResultRow
          label="Profit Margin"
          value={`${margin.toFixed(1)}%`}
          color={margin >= 20 ? 'var(--green-dark)' : margin >= 0 ? 'var(--orange)' : 'var(--red-dark)'}
        />
        <ResultRow
          label="Return on Investment (ROI)"
          value={`${roi.toFixed(1)}%`}
          color={roi >= 0 ? 'var(--green-dark)' : 'var(--red-dark)'}
        />
      </div>

      {profit > 0 && (
        <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <strong style={{ color: 'var(--green-dark)' }}>Profit Summary:</strong>
          <span style={{ color: 'var(--green-dark)', marginLeft: '0.5rem' }}>
            You make {formatCurrency(profit)} on this deal ({margin.toFixed(1)}% margin, {roi.toFixed(1)}% ROI).
          </span>
        </div>
      )}
      {profit < 0 && (
        <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: '#fef2f2', border: '1px solid #fecaca' }}>
          <strong style={{ color: 'var(--red-dark)' }}>⚠️ Loss:</strong>
          <span style={{ color: 'var(--red-dark)', marginLeft: '0.5rem' }}>
            You lose {formatCurrency(Math.abs(profit))} on this deal. Consider raising your price or reducing costs.
          </span>
        </div>
      )}
    </Section>
  )
}

function BreakEvenCalc() {
  const [fixedCosts, setFixedCosts] = useState('')
  const [varCostPct, setVarCostPct] = useState('')
  const [avgSalePrice, setAvgSalePrice] = useState('')

  const fixed = parseFloat(fixedCosts) || 0
  const varPct = parseFloat(varCostPct) || 0
  const avgPrice = parseFloat(avgSalePrice) || 0

  const contribution = avgPrice * (1 - varPct / 100)
  const breakEvenUnits = contribution > 0 ? Math.ceil(fixed / contribution) : null
  const breakEvenRevenue = breakEvenUnits ? breakEvenUnits * avgPrice : null

  return (
    <Section title="Break-Even Calculator" icon="⚖️">
      <div className="form-row">
        <div className="form-group">
          <label>Fixed Costs / Month ($)</label>
          <input type="number" min="0" step="0.01" placeholder="e.g. storage, tools" value={fixedCosts} onChange={e => setFixedCosts(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Variable Cost % of Sale</label>
          <input type="number" min="0" max="100" step="0.1" placeholder="e.g. 60 = 60%" value={varCostPct} onChange={e => setVarCostPct(e.target.value)} />
        </div>
      </div>
      <div className="form-group" style={{ maxWidth: '50%' }}>
        <label>Average Sale Price ($)</label>
        <input type="number" min="0" step="0.01" placeholder="0.00" value={avgSalePrice} onChange={e => setAvgSalePrice(e.target.value)} />
      </div>

      {breakEvenUnits !== null && (
        <>
          <hr className="divider" />
          <ResultRow label="Contribution per Sale" value={formatCurrency(contribution)} />
          <ResultRow label="Break-Even Units / Month" value={breakEvenUnits} bold big color="var(--orange)" />
          <ResultRow label="Break-Even Revenue / Month" value={formatCurrency(breakEvenRevenue)} bold color="var(--orange)" />
          <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: '#fff7ed', border: '1px solid #fed7aa', color: 'var(--orange)', fontSize: '0.875rem' }}>
            You need to sell at least <strong>{breakEvenUnits}</strong> item{breakEvenUnits !== 1 ? 's' : ''} per month (
            {formatCurrency(breakEvenRevenue)}) to cover your fixed costs.
          </div>
        </>
      )}
    </Section>
  )
}

function PriceTargetCalc() {
  const [costBasis, setCostBasis] = useState('')
  const [desiredProfit, setDesiredProfit] = useState('')
  const [profitType, setProfitType] = useState('dollar')

  const cost = parseFloat(costBasis) || 0
  const target = parseFloat(desiredProfit) || 0

  let targetPrice = 0
  let profit = 0
  if (profitType === 'dollar') {
    targetPrice = cost + target
    profit = target
  } else {
    // percentage of cost (markup)
    targetPrice = cost * (1 + target / 100)
    profit = targetPrice - cost
  }
  const margin = targetPrice > 0 ? ((profit / targetPrice) * 100) : 0

  return (
    <Section title="Target Price Calculator" icon="🎯">
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Figure out what price you need to sell at to hit your profit goal.
      </p>
      <div className="form-row">
        <div className="form-group">
          <label>Your Total Cost ($)</label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={costBasis} onChange={e => setCostBasis(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Desired Profit Type</label>
          <select value={profitType} onChange={e => setProfitType(e.target.value)}>
            <option value="dollar">Dollar Amount ($)</option>
            <option value="percent">Markup Percentage (%)</option>
          </select>
        </div>
      </div>
      <div className="form-group" style={{ maxWidth: '50%' }}>
        <label>Desired Profit {profitType === 'dollar' ? '($)' : '(% markup)'}</label>
        <input type="number" min="0" step="0.01" placeholder="0.00" value={desiredProfit} onChange={e => setDesiredProfit(e.target.value)} />
      </div>

      {cost > 0 && target > 0 && (
        <>
          <hr className="divider" />
          <ResultRow label="Your Cost" value={formatCurrency(cost)} />
          <ResultRow label="Target Profit" value={formatCurrency(profit)} color="var(--green-dark)" />
          <ResultRow label="Minimum Sale Price" value={formatCurrency(targetPrice)} bold big color="var(--blue)" />
          <ResultRow label="Profit Margin" value={`${margin.toFixed(1)}%`} />
          <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: '#eff6ff', border: '1px solid #bfdbfe', color: 'var(--blue)', fontSize: '0.875rem' }}>
            List at <strong>{formatCurrency(targetPrice)}</strong> or higher to make your {formatCurrency(profit)} profit ({margin.toFixed(1)}% margin).
          </div>
        </>
      )}
    </Section>
  )
}

function ROICalc() {
  const [items, setItems] = useState([{ cost: '', price: '', label: '' }])

  const addItem = () => setItems(it => [...it, { cost: '', price: '', label: '' }])
  const removeItem = (i) => setItems(it => it.filter((_, idx) => idx !== i))
  const updateItem = (i, field, val) => setItems(it => it.map((x, idx) => idx === i ? { ...x, [field]: val } : x))

  const totals = useMemo(() => {
    let totalCost = 0, totalRevenue = 0
    items.forEach(item => {
      totalCost += parseFloat(item.cost) || 0
      totalRevenue += parseFloat(item.price) || 0
    })
    const profit = totalRevenue - totalCost
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
    const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
    return { totalCost, totalRevenue, profit, roi, margin }
  }, [items])

  return (
    <Section title="Multi-Item Portfolio Calc" icon="📋">
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Calculate total ROI across multiple items you're planning to buy and sell.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <label style={{ marginBottom: 0 }}>Item Label</label>
        <label style={{ marginBottom: 0 }}>Cost ($)</label>
        <label style={{ marginBottom: 0 }}>Sell Price ($)</label>
        <span></span>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <input placeholder={`Item ${i + 1}`} value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} />
          <input type="number" min="0" step="0.01" placeholder="0.00" value={item.cost} onChange={e => updateItem(i, 'cost', e.target.value)} />
          <input type="number" min="0" step="0.01" placeholder="0.00" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} />
          <button className="btn-danger btn-sm" onClick={() => removeItem(i)} disabled={items.length === 1}>✕</button>
        </div>
      ))}
      <button className="btn-ghost btn-sm" onClick={addItem} style={{ marginBottom: '1rem' }}>+ Add Item</button>

      <hr className="divider" />
      <ResultRow label="Total Invested" value={formatCurrency(totals.totalCost)} />
      <ResultRow label="Total Revenue" value={formatCurrency(totals.totalRevenue)} />
      <ResultRow
        label="Total Profit / Loss"
        value={`${totals.profit >= 0 ? '+' : ''}${formatCurrency(totals.profit)}`}
        bold big
        color={totals.profit >= 0 ? 'var(--green-dark)' : 'var(--red-dark)'}
      />
      <ResultRow label="Profit Margin" value={`${totals.margin.toFixed(1)}%`} />
      <ResultRow label="ROI" value={`${totals.roi.toFixed(1)}%`} color={totals.roi >= 0 ? 'var(--green-dark)' : 'var(--red-dark)'} />
    </Section>
  )
}

export default function Calculator() {
  const [tab, setTab] = useState('profit')

  const tabs = [
    { id: 'profit', label: 'Profit/Loss', icon: '💰' },
    { id: 'target', label: 'Price Target', icon: '🎯' },
    { id: 'breakeven', label: 'Break-Even', icon: '⚖️' },
    { id: 'portfolio', label: 'Multi-Item', icon: '📋' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy)' }}>🧮 Calculator Tools</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Business calculators to help you price items and plan deals</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '0.5rem 1.125rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: tab === t.id ? 700 : 500,
              background: tab === t.id ? 'var(--navy)' : 'white',
              color: tab === t.id ? 'white' : 'var(--gray-600)',
              border: `1.5px solid ${tab === t.id ? 'var(--navy)' : 'var(--border)'}`,
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'profit' && <ProfitCalc />}
      {tab === 'target' && <PriceTargetCalc />}
      {tab === 'breakeven' && <BreakEvenCalc />}
      {tab === 'portfolio' && <ROICalc />}
    </div>
  )
}
