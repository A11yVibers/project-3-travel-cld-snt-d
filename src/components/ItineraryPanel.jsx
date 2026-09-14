export default function ItineraryPanel({ day }) {
  if (!day) {
    return (
      <div className="panel itinerary-panel">
        <p className="panel__hint">Select a day on the journey above to see its itinerary.</p>
      </div>
    )
  }

  return (
    <div className="panel itinerary-panel">
      <div className="panel__header">
        <h3>
          Day {day.dayNumber} · {day.city}, {day.country}
        </h3>
        <span className="panel__subheading">{day.dateLabel}</span>
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
          {day.itinerary.map((item, index) => (
            <tr key={`${day.dayId}-${index}`}>
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
