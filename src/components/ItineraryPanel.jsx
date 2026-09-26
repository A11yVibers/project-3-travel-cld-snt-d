import { formatDate } from '../lib/data.js'

export default function ItineraryPanel({ day, items }) {
  if (!day) {
    return (
      <div className="panel itinerary-panel itinerary-panel--empty">
        <p>Select a day on the flowchart above to see that day's itinerary.</p>
      </div>
    )
  }

  return (
    <div className="panel itinerary-panel">
      <div className="panel-header">
        <h3>
          Day {day.dayNumber} &middot; {day.city}, {day.country}
        </h3>
        <span className="panel-subtitle">{formatDate(day.date)}</span>
      </div>
      <table className="itinerary-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Place</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.dayId}-${item.order}`}>
              <td>{item.time}</td>
              <td>{item.place}</td>
              <td>{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
