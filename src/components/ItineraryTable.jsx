import React from 'react'

export default function ItineraryTable({ day, items }) {
  if (!day) return null

  return (
    <div className="itinerary-panel" aria-live="polite">
      <div className="itinerary-panel-header">
        <h3>
          Day {day.dayNumber} &middot; {day.city}, {day.country}
        </h3>
        <p className="itinerary-panel-subtitle">{day.dateLabel}</p>
      </div>
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
            <tr key={`${day.dayId}-${item.order}`}>
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
