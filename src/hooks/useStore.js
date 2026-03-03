import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'marine_parts_data'

const defaultData = {
  inventory: [],
  sales: [],
  nextId: 1,
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultData, ...JSON.parse(raw) }
  } catch {}
  return defaultData
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useStore() {
  const [data, setData] = useState(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const genId = useCallback(() => {
    let id
    setData(d => {
      id = d.nextId
      return { ...d, nextId: d.nextId + 1 }
    })
    return id
  }, [])

  // Add item to inventory (purchase)
  const addInventoryItem = useCallback((item) => {
    const id = Date.now()
    setData(d => ({
      ...d,
      inventory: [
        ...d.inventory,
        {
          id,
          ...item,
          status: 'in_stock',
          purchaseDate: item.purchaseDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        }
      ]
    }))
    return id
  }, [])

  // Update inventory item
  const updateInventoryItem = useCallback((id, updates) => {
    setData(d => ({
      ...d,
      inventory: d.inventory.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }))
  }, [])

  // Delete inventory item
  const deleteInventoryItem = useCallback((id) => {
    setData(d => ({
      ...d,
      inventory: d.inventory.filter(item => item.id !== id),
      sales: d.sales.filter(s => s.inventoryId !== id)
    }))
  }, [])

  // Record a sale
  const recordSale = useCallback((inventoryId, saleInfo) => {
    const saleId = Date.now()
    setData(d => {
      const item = d.inventory.find(i => i.id === inventoryId)
      if (!item) return d
      const profit = (parseFloat(saleInfo.salePrice) || 0) - (parseFloat(item.purchasePrice) || 0)
      return {
        ...d,
        inventory: d.inventory.map(i =>
          i.id === inventoryId ? { ...i, status: 'sold' } : i
        ),
        sales: [
          ...d.sales,
          {
            id: saleId,
            inventoryId,
            itemName: item.name,
            category: item.category,
            purchasePrice: parseFloat(item.purchasePrice) || 0,
            salePrice: parseFloat(saleInfo.salePrice) || 0,
            profit,
            saleDate: saleInfo.saleDate || new Date().toISOString().split('T')[0],
            buyer: saleInfo.buyer || '',
            notes: saleInfo.notes || '',
            createdAt: new Date().toISOString(),
          }
        ]
      }
    })
    return saleId
  }, [])

  // Delete a sale record (and restore item to stock)
  const deleteSale = useCallback((saleId) => {
    setData(d => {
      const sale = d.sales.find(s => s.id === saleId)
      return {
        ...d,
        sales: d.sales.filter(s => s.id !== saleId),
        inventory: sale
          ? d.inventory.map(i =>
              i.id === sale.inventoryId ? { ...i, status: 'in_stock' } : i
            )
          : d.inventory
      }
    })
  }, [])

  // Computed helpers
  const getStats = useCallback(() => {
    const inventory = data.inventory
    const sales = data.sales

    const totalInvested = inventory.reduce((sum, i) => sum + (parseFloat(i.purchasePrice) || 0), 0)
    const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.salePrice) || 0), 0)
    const totalProfit = sales.reduce((sum, s) => sum + (parseFloat(s.profit) || 0), 0)
    const inStock = inventory.filter(i => i.status === 'in_stock')
    const inStockValue = inStock.reduce((sum, i) => sum + (parseFloat(i.purchasePrice) || 0), 0)
    const soldCount = sales.length
    const inStockCount = inStock.length

    return { totalInvested, totalRevenue, totalProfit, inStockValue, soldCount, inStockCount }
  }, [data])

  const getYearlyStats = useCallback((year) => {
    const ySales = data.sales.filter(s => s.saleDate && s.saleDate.startsWith(String(year)))
    const yPurchases = data.inventory.filter(i => i.purchaseDate && i.purchaseDate.startsWith(String(year)))

    const revenue = ySales.reduce((sum, s) => sum + s.salePrice, 0)
    const profit = ySales.reduce((sum, s) => sum + s.profit, 0)
    const invested = yPurchases.reduce((sum, i) => sum + (parseFloat(i.purchasePrice) || 0), 0)
    const itemsSold = ySales.length
    const itemsBought = yPurchases.length

    // Monthly breakdown
    const months = {}
    for (let m = 1; m <= 12; m++) {
      const key = String(m).padStart(2, '0')
      const mSales = ySales.filter(s => s.saleDate.slice(5, 7) === key)
      months[m] = {
        revenue: mSales.reduce((sum, s) => sum + s.salePrice, 0),
        profit: mSales.reduce((sum, s) => sum + s.profit, 0),
        count: mSales.length,
      }
    }

    // By category
    const categories = {}
    ySales.forEach(s => {
      if (!categories[s.category]) categories[s.category] = { revenue: 0, profit: 0, count: 0 }
      categories[s.category].revenue += s.salePrice
      categories[s.category].profit += s.profit
      categories[s.category].count += 1
    })

    return { revenue, profit, invested, itemsSold, itemsBought, months, categories }
  }, [data])

  return {
    inventory: data.inventory,
    sales: data.sales,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    recordSale,
    deleteSale,
    getStats,
    getYearlyStats,
  }
}
