import Papa from 'papaparse'
import tripDaysCsv from '../project-assets/trip_days.csv?raw'
import itineraryCsv from '../project-assets/itinerary.csv?raw'
import expensesCsv from '../project-assets/expenses.csv?raw'

function parseCsv(raw) {
  const { data } = Papa.parse(raw.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  return data
}

const rawTripDays = parseCsv(tripDaysCsv)
const rawItinerary = parseCsv(itineraryCsv)
const rawExpenses = parseCsv(expensesCsv)

// Trip days, sorted chronologically by day_number.
export const tripDays = [...rawTripDays].sort((a, b) => a.day_number - b.day_number)

// Itinerary items grouped by day_id, each day's items sorted by item_order.
export const itineraryByDay = rawItinerary.reduce((acc, row) => {
  const list = acc[row.day_id] || (acc[row.day_id] = [])
  list.push(row)
  return acc
}, {})
Object.values(itineraryByDay).forEach((list) => list.sort((a, b) => a.item_order - b.item_order))

// Expense category labels, matching the four requested buckets.
export const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}
export const CATEGORY_ORDER = ['lodging', 'food', 'entertainment', 'travel']

// Total spend per category across the whole trip -> pie/donut chart data.
export const expenseTotalsByCategory = CATEGORY_ORDER.map((key) => ({
  key,
  name: CATEGORY_LABELS[key],
  value: rawExpenses
    .filter((row) => row.category === key)
    .reduce((sum, row) => sum + (row.amount_usd || 0), 0),
}))

// For a given category key, spend per day (in chronological order), with city labels.
export function expenseByCategoryPerDay(categoryKey) {
  return tripDays.map((day) => {
    const amount = rawExpenses
      .filter((row) => row.day_id === day.day_id && row.category === categoryKey)
      .reduce((sum, row) => sum + (row.amount_usd || 0), 0)
    return {
      day_id: day.day_id,
      day_number: day.day_number,
      city: day.city,
      label: `Day ${day.day_number} · ${day.city}`,
      amount,
    }
  })
}

export const grandTotalSpend = expenseTotalsByCategory.reduce((sum, c) => sum + c.value, 0)
