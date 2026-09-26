import { itineraryByDay, tripDays } from '../data.js'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = String(timeStr).split(':')
  const hour = Number(h)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = ((hour + 11) % 12) + 1
  return `${displayHour}:${m} ${suffix}`
}

export default function ItineraryPanel({ selectedDayId }) {
  const day = tripDays.find((d) => d.day_id === selectedDayId)
  const items = itineraryByDay[selectedDayId] || []

  if (!day) {
    return (
      <section className="itinerary-panel" id="itinerary" aria-live="polite">
        <p>Select a day on the flowchart above to see its itinerary.</p>
      </section>
    )
  }

  return (
    <section className="itinerary-panel" id="itinerary" aria-live="polite">
      <header className="itinerary-header">
        <div>
          <p className="itinerary-eyebrow">Day {day.day_number} of 10</p>
          <h2>{day.city}, {day.country}</h2>
          <p className="itinerary-date">{formatDate(day.date)}</p>
        </div>
        <img
          className="itinerary-thumb"
          src={day.landmark_image_url}
          alt={day.iconic_landmark}
          loading="lazy"
        />
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
              <td data-label="Time">{formatTime(item.time)}</td>
              <td data-label="Place">{item.place}</td>
              <td data-label="Activity">{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
