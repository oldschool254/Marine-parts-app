export function formatCurrency(value) {
  const num = parseFloat(value) || 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const CATEGORIES = [
  'Boat Trailer',
  'Outboard Engine',
  'Boat',
  'Motor Parts',
  'Trailer Parts',
  'Electronics',
  'Accessories',
  'Other',
]

export const CATEGORY_ICONS = {
  'Boat Trailer': '🚤',
  'Outboard Engine': '⚙️',
  'Boat': '⛵',
  'Motor Parts': '🔧',
  'Trailer Parts': '🔩',
  'Electronics': '📡',
  'Accessories': '🧰',
  'Other': '📦',
}

export const CATEGORY_COLORS = {
  'Boat Trailer': 'badge-blue',
  'Outboard Engine': 'badge-orange',
  'Boat': 'badge-teal',
  'Motor Parts': 'badge-gray',
  'Trailer Parts': 'badge-gray',
  'Electronics': 'badge-blue',
  'Accessories': 'badge-green',
  'Other': 'badge-gray',
}

export function getAvailableYears(sales, inventory) {
  const years = new Set()
  const current = new Date().getFullYear()
  years.add(current)
  sales.forEach(s => s.saleDate && years.add(parseInt(s.saleDate.slice(0, 4))))
  inventory.forEach(i => i.purchaseDate && years.add(parseInt(i.purchaseDate.slice(0, 4))))
  return Array.from(years).sort((a, b) => b - a)
}
