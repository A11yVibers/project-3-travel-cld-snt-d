import { formatDate } from '../utils/format.js'

export default function ItineraryPanel({ day, items }) {
  if (!day) return null

  return (
    <section className="itinerary-panel" aria-labelledby="itinerary-heading">
      <div className="itinerary-heading-row">
        <h3 id="itinerary-heading">
          Day {day.dayNumber} &middot; {day.city}, {day.country}
        </h3>
        <p className="itinerary-subtitle">{formatDate(day.date)}</p>
      </div>
      <table className="itinerary-table">
        <caption className="sr-only">
          Itinerary for day {day.dayNumber} in {day.city}
        </caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Place</th>
            <th scope="col">Activity</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${day.dayId}-${index}`}>
              <td>{item.time}</td>
              <td>{item.place}</td>
              <td>{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
