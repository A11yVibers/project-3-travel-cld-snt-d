import Papa from 'papaparse'
import tripDaysRaw from '../project-assets/trip_days.csv?raw'
import itineraryRaw from '../project-assets/itinerary.csv?raw'
import expensesRaw from '../project-assets/expenses.csv?raw'

function parseCsv(raw) {
  const { data } = Papa.parse(raw, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  return data
}

// --- Trip days -------------------------------------------------------------

export const tripDays = parseCsv(tripDaysRaw)
  .filter((d) => d.day_id)
  .sort((a, b) => a.day_number - b.day_number)

// --- Itinerary ---------------------------------------------------------------

const itineraryRows = parseCsv(itineraryRaw).filter((i) => i.day_id)

export const itineraryByDay = tripDays.reduce((acc, day) => {
  acc[day.day_id] = itineraryRows
    .filter((i) => i.day_id === day.day_id)
    .sort((a, b) => a.item_order - b.item_order)
  return acc
}, {})

// --- Expenses ------------------------------------------------------------

const expenseRows = parseCsv(expensesRaw).filter((e) => e.day_id)

export const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const CATEGORY_ORDER = ['Lodging', 'Food', 'Entertainment', 'Travel']

export const CATEGORY_COLORS = {
  Lodging: '#f2a154',
  Food: '#e8615b',
  Entertainment: '#2fa199',
  Travel: '#4f7cd1',
}

function round2(n) {
  return Math.round(n * 100) / 100
}

// Total spend per category across the whole trip, for the donut chart.
export const categoryTotals = CATEGORY_ORDER.map((label) => {
  const amount = expenseRows
    .filter((e) => CATEGORY_LABELS[e.category] === label)
    .reduce((sum, e) => sum + Number(e.amount_usd || 0), 0)
  return { category: label, amount: round2(amount) }
})

export const tripTotal = round2(categoryTotals.reduce((sum, c) => sum + c.amount, 0))

// Per-category breakdown across each of the 10 days/cities, in chronological order.
export const dayCategoryTotals = CATEGORY_ORDER.reduce((acc, label) => {
  acc[label] = tripDays.map((day) => {
    const amount = expenseRows
      .filter((e) => e.day_id === day.day_id && CATEGORY_LABELS[e.category] === label)
      .reduce((sum, e) => sum + Number(e.amount_usd || 0), 0)
    return {
      dayId: day.day_id,
      dayNumber: day.day_number,
      city: day.city,
      date: day.date,
      amount: round2(amount),
      label: `D${day.day_number} ${day.city}`,
    }
  })
  return acc
}, {})
