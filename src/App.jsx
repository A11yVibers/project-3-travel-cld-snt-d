import { useState } from 'react'
import { tripDays } from './data.js'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.day_id ?? null)

  return (
    <main className="app">
      <header className="hero">
        <p className="hero-eyebrow">A 10-Day European Journey</p>
        <h1>Travel Journal</h1>
        <p className="hero-sub">
          One new city a day, {tripDays[0]?.city} to {tripDays[tripDays.length - 1]?.city}. Click a stop on the
          flowchart to relive that day&rsquo;s itinerary.
        </p>
      </header>

      <section className="flowchart-section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">Journey Flowchart</h2>
        <JourneyFlowchart selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />
      </section>

      <ItineraryPanel selectedDayId={selectedDayId} />

      <ExpenseChart />

      <footer className="app-footer">
        <p>Ten cities, ten days, one unforgettable route across Europe.</p>
      </footer>
    </main>
  )
}
