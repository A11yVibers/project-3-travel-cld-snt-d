import Papa from 'papaparse'

import tripDaysCsv from '../../project-assets/trip_days.csv?raw'
import itineraryCsv from '../../project-assets/itinerary.csv?raw'
import expensesCsv from '../../project-assets/expenses.csv?raw'

function parseCsv(raw) {
  const { data } = Papa.parse(raw.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })
  return data
}

const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

const CATEGORY_ORDER = ['lodging', 'food', 'entertainment', 'travel']

function loadTripDays() {
  const rows = parseCsv(tripDaysCsv)
  return rows.map((row) => ({
    dayId: row.day_id,
    dayNumber: Number(row.day_number),
    date: row.date,
    city: row.city,
    country: row.country,
    landmark: row.iconic_landmark,
    imageUrl: row.landmark_image_url,
  }))
}

function loadItinerary() {
  const rows = parseCsv(itineraryCsv)
  const byDay = new Map()
  rows.forEach((row) => {
    const entry = {
      order: Number(row.item_order),
      time: row.time,
      place: row.place,
      activity: row.activity,
    }
    if (!byDay.has(row.day_id)) byDay.set(row.day_id, [])
    byDay.get(row.day_id).push(entry)
  })
  byDay.forEach((items) => items.sort((a, b) => a.order - b.order))
  return byDay
}

function loadExpenses() {
  const rows = parseCsv(expensesCsv)
  return rows.map((row) => ({
    dayId: row.day_id,
    order: Number(row.expense_order),
    category: row.category,
    subcategory: row.subcategory,
    description: row.description,
    amount: Number(row.amount_usd),
  }))
}

export function loadTripData() {
  const days = loadTripDays().sort((a, b) => a.dayNumber - b.dayNumber)
  const itineraryByDay = loadItinerary()
  const expenses = loadExpenses()

  const expensesByDay = new Map()
  expenses.forEach((expense) => {
    if (!expensesByDay.has(expense.dayId)) expensesByDay.set(expense.dayId, [])
    expensesByDay.get(expense.dayId).push(expense)
  })

  // Totals per category across the whole trip.
  const categoryTotals = CATEGORY_ORDER.map((category) => {
    const total = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return { category, label: CATEGORY_LABELS[category], total: Math.round(total * 100) / 100 }
  })

  // Per-day totals per category, with city labels attached for comparison charts.
  const dailyCategoryTotals = CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = days.map((day) => {
      const dayExpenses = expensesByDay.get(day.dayId) || []
      const total = dayExpenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0)
      return {
        dayId: day.dayId,
        dayNumber: day.dayNumber,
        city: day.city,
        date: day.date,
        amount: Math.round(total * 100) / 100,
      }
    })
    return acc
  }, {})

  return {
    days,
    itineraryByDay,
    expensesByDay,
    categoryTotals,
    dailyCategoryTotals,
    categoryOrder: CATEGORY_ORDER,
    categoryLabels: CATEGORY_LABELS,
  }
}
