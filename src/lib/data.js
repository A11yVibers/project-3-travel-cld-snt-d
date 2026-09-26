import Papa from 'papaparse'
import tripDaysRaw from '../../project-assets/trip_days.csv?raw'
import itineraryRaw from '../../project-assets/itinerary.csv?raw'
import expensesRaw from '../../project-assets/expenses.csv?raw'

function parse(raw) {
  const { data } = Papa.parse(raw, { header: true, skipEmptyLines: true })
  return data
}

const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const CATEGORY_ORDER = ['Lodging', 'Food', 'Entertainment', 'Travel']

// --- Trip days -------------------------------------------------------------

export const tripDays = parse(tripDaysRaw)
  .map((row) => ({
    dayId: row.day_id,
    dayNumber: Number(row.day_number),
    date: row.date,
    city: row.city,
    country: row.country,
    landmark: row.iconic_landmark,
    imageUrl: row.landmark_image_url,
  }))
  .sort((a, b) => a.dayNumber - b.dayNumber)

const dayById = new Map(tripDays.map((d) => [d.dayId, d]))

export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// --- Itinerary ---------------------------------------------------------------

const itineraryRows = parse(itineraryRaw).map((row) => ({
  dayId: row.day_id,
  order: Number(row.item_order),
  time: row.time,
  place: row.place,
  activity: row.activity,
}))

export function getItineraryForDay(dayId) {
  return itineraryRows
    .filter((row) => row.dayId === dayId)
    .sort((a, b) => a.order - b.order)
}

// --- Expenses ------------------------------------------------------------

const expenseRows = parse(expensesRaw).map((row) => ({
  dayId: row.day_id,
  order: Number(row.expense_order),
  category: CATEGORY_LABELS[row.category] || row.category,
  subcategory: row.subcategory,
  description: row.description,
  amount: Number(row.amount_usd),
}))

// Total spend per category, across the whole trip.
export const expenseTotalsByCategory = CATEGORY_ORDER.map((category) => ({
  category,
  total: expenseRows
    .filter((row) => row.category === category)
    .reduce((sum, row) => sum + row.amount, 0),
}))

// For a given category, the amount spent on each of the 10 days, joined with city names.
export function getCategoryBreakdownByDay(category) {
  return tripDays.map((day) => {
    const total = expenseRows
      .filter((row) => row.dayId === day.dayId && row.category === category)
      .reduce((sum, row) => sum + row.amount, 0)
    return {
      dayId: day.dayId,
      dayNumber: day.dayNumber,
      city: day.city,
      date: day.date,
      amount: Math.round(total * 100) / 100,
    }
  })
}

export function getDay(dayId) {
  return dayById.get(dayId)
}
