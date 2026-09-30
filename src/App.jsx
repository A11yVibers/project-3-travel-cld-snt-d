import React, { useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryTable from './components/ItineraryTable.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import { tripDays, itineraryByDay, expenseTotalsByCategory } from './data.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.dayId ?? null)
  const selectedDay = tripDays.find((d) => d.dayId === selectedDayId) ?? null

  return (
    <main className="app">
      <header className="app-header">
        <h1>10 Days Across Europe</h1>
        <p>A visual travel journal from London to Rome, one new city a day.</p>
      </header>

      <section className="section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">Journey</h2>
        <p className="section-intro">Select a day on the trail to see that day&rsquo;s itinerary.</p>
        <JourneyFlowchart
          days={tripDays}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
        />
        <ItineraryTable day={selectedDay} items={itineraryByDay[selectedDayId] ?? []} />
      </section>

      <section className="section" aria-labelledby="expenses-heading">
        <h2 id="expenses-heading">Trip Expenses</h2>
        <p className="section-intro">
          See where the money went overall, then drill into any category by day.
        </p>
        <ExpenseChart totalsByCategory={expenseTotalsByCategory} />
      </section>
    </main>
  )
}
