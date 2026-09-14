import { useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import { tripDays, categoryTotals } from './data.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.dayId ?? null)
  const selectedDay = tripDays.find((day) => day.dayId === selectedDayId) ?? null

  return (
    <main className="app">
      <header className="app__header">
        <h1>10 Days Across Europe</h1>
        <p>A visual journal of the trip &mdash; one new city each day, from London to Rome.</p>
      </header>

      <section className="app__section">
        <h2>Journey</h2>
        <JourneyFlowchart
          days={tripDays}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
        />
        <ItineraryPanel day={selectedDay} />
      </section>

      <section className="app__section">
        <h2>Trip Expenses</h2>
        <ExpenseChart categoryTotals={categoryTotals} />
      </section>
    </main>
  )
}
