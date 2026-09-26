import React from 'react'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = String(timeStr).split(':')
  const hour = Number(h)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = ((hour + 11) % 12) + 1
  return `${displayHour}:${m} ${period}`
}

export default function ItineraryTable({ day, items }) {
  if (!day) return null

  return (
    <section className="itinerary-panel" aria-live="polite">
      <header className="itinerary-header">
        <h3>
          Day {day.day_number} &middot; {day.city}, {day.country}
        </h3>
        <p className="itinerary-subtitle">
          {formatDate(day.date)} &mdash; {day.iconic_landmark}
        </p>
      </header>
      <table className="itinerary-table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Place</th>
            <th scope="col">Activity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.day_id}-${item.item_order}`}>
              <td>{formatTime(item.time)}</td>
              <td>{item.place}</td>
              <td>{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
