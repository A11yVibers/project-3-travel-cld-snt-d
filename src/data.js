import Papa from 'papaparse'
import tripDaysRaw from '../project-assets/trip_days.csv?raw'
import itineraryRaw from '../project-assets/itinerary.csv?raw'
import expensesRaw from '../project-assets/expenses.csv?raw'

function parseCsv(raw) {
  const { data } = Papa.parse(raw.trim(), { header: true, skipEmptyLines: true })
  return data
}

const rawTripDays = parseCsv(tripDaysRaw)
const rawItinerary = parseCsv(itineraryRaw)
const rawExpenses = parseCsv(expensesRaw)

// Map raw CSV category -> display category bucket
const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const EXPENSE_CATEGORIES = ['Lodging', 'Food', 'Entertainment', 'Travel']

function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export const tripDays = rawTripDays
  .map((row) => ({
    dayId: row.day_id,
    dayNumber: Number(row.day_number),
    date: row.date,
    dateLabel: formatDate(row.date),
    city: row.city,
    country: row.country,
    landmark: row.iconic_landmark,
    imageUrl: row.landmark_image_url,
    itinerary: rawItinerary
      .filter((item) => item.day_id === row.day_id)
      .sort((a, b) => Number(a.item_order) - Number(b.item_order))
      .map((item) => ({
        time: item.time,
        place: item.place,
        activity: item.activity,
      })),
    expenses: rawExpenses
      .filter((exp) => exp.day_id === row.day_id)
      .map((exp) => ({
        category: CATEGORY_LABELS[exp.category] || exp.category,
        subcategory: exp.subcategory,
        description: exp.description,
        amount: Number(exp.amount_usd),
      })),
  }))
  .sort((a, b) => a.dayNumber - b.dayNumber)

// Overall totals per category across the whole trip
export const categoryTotals = EXPENSE_CATEGORIES.map((category) => ({
  category,
  total: tripDays.reduce(
    (sum, day) => sum + day.expenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0),
    0
  ),
}))

// Per-day breakdown for a given category, used for the comparison chart
export function categoryByDay(category) {
  return tripDays.map((day) => ({
    dayId: day.dayId,
    dayNumber: day.dayNumber,
    city: day.city,
    label: `D${day.dayNumber} ${day.city}`,
    amount: day.expenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0),
  }))
}
