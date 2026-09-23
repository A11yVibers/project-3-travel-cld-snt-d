import { useMemo, useState } from 'react'
import { loadTripData } from './data/tripData.js'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'

export default function App() {
  const trip = useMemo(() => loadTripData(), [])
  const [selectedDayId, setSelectedDayId] = useState(trip.days[0]?.dayId ?? null)

  const selectedDay = trip.days.find((day) => day.dayId === selectedDayId) ?? null
  const selectedItems = selectedDayId ? trip.itineraryByDay.get(selectedDayId) ?? [] : []

  return (
    <main className="app">
      <header className="app-header">
        <p className="app-eyebrow">June 2026</p>
        <h1>10 Days Across Europe</h1>
        <p className="app-subtitle">
          A city-a-day journey from London to Rome, in landmarks, itineraries, and spending.
        </p>
      </header>

      <section className="section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">The Journey</h2>
        <p className="section-lead">Select a day to see that day's itinerary.</p>
        <JourneyFlowchart
          days={trip.days}
          selectedDayId={selectedDayId}
          onSelect={setSelectedDayId}
        />
        <ItineraryPanel day={selectedDay} items={selectedItems} />
      </section>

      <section className="section" aria-labelledby="expenses-heading">
        <h2 id="expenses-heading">Trip Spending</h2>
        <p className="section-lead">
          Select a slice of the chart to compare that category's spending across every city.
        </p>
        <ExpenseChart
          categoryTotals={trip.categoryTotals}
          dailyCategoryTotals={trip.dailyCategoryTotals}
          categoryLabels={trip.categoryLabels}
        />
      </section>
    </main>
  )
}
