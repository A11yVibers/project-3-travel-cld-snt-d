import React, { useState } from 'react'
import { tripDays, itineraryByDay } from './data.js'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryTable from './components/ItineraryTable.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.day_id ?? null)
  const selectedDay = tripDays.find((d) => d.day_id === selectedDayId) || null
  const selectedItems = selectedDayId ? itineraryByDay[selectedDayId] || [] : []

  return (
    <main className="app">
      <header className="app-header">
        <h1>10 Days Across Europe</h1>
        <p>A visual journal of one city a day, from London to Rome.</p>
      </header>

      <section className="section">
        <h2>Journey</h2>
        <JourneyFlowchart days={tripDays} selectedDayId={selectedDayId} onSelect={setSelectedDayId} />
        <ItineraryTable day={selectedDay} items={selectedItems} />
      </section>

      <section className="section">
        <h2>Spending</h2>
        <ExpenseChart />
      </section>

      <footer className="app-footer">
        <p>Trip data sourced from the traveler&rsquo;s own day-by-day log and expense records.</p>
      </footer>
    </main>
  )
}
