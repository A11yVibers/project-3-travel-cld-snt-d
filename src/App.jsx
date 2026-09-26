import { useMemo, useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import { tripDays, getItineraryForDay, getDay, expenseTotalsByCategory } from './lib/data.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(null)

  const selectedDay = selectedDayId ? getDay(selectedDayId) : null
  const itineraryItems = useMemo(
    () => (selectedDayId ? getItineraryForDay(selectedDayId) : []),
    [selectedDayId]
  )

  function handleSelectDay(dayId) {
    setSelectedDayId((current) => (current === dayId ? null : dayId))
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="app-eyebrow">Europe &middot; June 2026</p>
        <h1>Ten Days, Ten Cities</h1>
        <p className="app-subtitle">
          A visual journal of a whirlwind trip from London to Rome &mdash; one new
          city, one iconic landmark, every day.
        </p>
      </header>

      <section className="section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">Journey Flowchart</h2>
        <JourneyFlowchart
          days={tripDays}
          selectedDayId={selectedDayId}
          onSelectDay={handleSelectDay}
        />
        <ItineraryPanel day={selectedDay} items={itineraryItems} />
      </section>

      <section className="section" aria-labelledby="expense-heading">
        <h2 id="expense-heading">Trip Expenses</h2>
        <ExpenseChart totals={expenseTotalsByCategory} />
      </section>

      <footer className="app-footer">
        <p>Landmark photography courtesy of Wikimedia Commons contributors.</p>
      </footer>
    </main>
  )
}
