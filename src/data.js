// Parses the immutable project data (project-assets/*.csv) into structures
// the UI can consume. The CSV files are treated as read-only source data.
import tripDaysRaw from '../project-assets/trip_days.csv?raw'
import itineraryRaw from '../project-assets/itinerary.csv?raw'
import expensesRaw from '../project-assets/expenses.csv?raw'

// Minimal RFC4180-ish CSV parser: handles quoted fields, commas and
// double-quote escaping inside quotes.
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const s = text.replace(/\r\n/g, '\n')

  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmpty = rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
  const header = nonEmpty[0]
  return nonEmpty.slice(1).map((r) => {
    const obj = {}
    header.forEach((h, idx) => {
      obj[h.trim()] = r[idx] !== undefined ? r[idx] : ''
    })
    return obj
  })
}

const tripDaysRows = parseCSV(tripDaysRaw)
const itineraryRows = parseCSV(itineraryRaw)
const expensesRows = parseCSV(expensesRaw)

function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export const tripDays = tripDaysRows
  .map((r) => ({
    dayId: r.day_id,
    dayNumber: Number(r.day_number),
    date: r.date,
    dateLabel: formatDate(r.date),
    city: r.city,
    country: r.country,
    landmark: r.iconic_landmark,
    imageUrl: r.landmark_image_url,
  }))
  .sort((a, b) => a.dayNumber - b.dayNumber)

export const itineraryByDay = itineraryRows.reduce((acc, r) => {
  const dayId = r.day_id
  if (!acc[dayId]) acc[dayId] = []
  acc[dayId].push({
    order: Number(r.item_order),
    time: r.time,
    place: r.place,
    activity: r.activity,
  })
  return acc
}, {})

Object.values(itineraryByDay).forEach((items) => items.sort((a, b) => a.order - b.order))

const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const EXPENSE_CATEGORIES = ['Lodging', 'Food', 'Entertainment', 'Travel']

const parsedExpenses = expensesRows.map((r) => ({
  dayId: r.day_id,
  category: CATEGORY_LABELS[r.category?.trim().toLowerCase()] || r.category,
  subcategory: r.subcategory,
  description: r.description,
  amount: Number(r.amount_usd),
}))

// Overall totals per category, for the pie/donut chart.
export const expenseTotalsByCategory = EXPENSE_CATEGORIES.map((category) => ({
  category,
  total: parsedExpenses
    .filter((e) => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0),
}))

// Per-day totals per category, for the drill-down comparison view.
export function expenseByDayForCategory(category) {
  return tripDays.map((day) => {
    const total = parsedExpenses
      .filter((e) => e.dayId === day.dayId && e.category === category)
      .reduce((sum, e) => sum + e.amount, 0)
    return {
      dayId: day.dayId,
      dayNumber: day.dayNumber,
      city: day.city,
      date: day.dateLabel,
      total,
    }
  })
}

export const allExpenses = parsedExpenses
