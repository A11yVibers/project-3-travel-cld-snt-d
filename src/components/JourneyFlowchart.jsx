import { tripDays } from '../data.js'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function DayCard({ day, align, isActive, onSelect }) {
  return (
    <div className={`day-card day-card--${align} ${isActive ? 'is-active' : ''}`}>
      <p className="day-card-eyebrow">Day {day.day_number}</p>
      <h3 className="day-card-city">{day.city}</h3>
      <p className="day-card-country">{day.country}</p>
      <p className="day-card-date">{formatDate(day.date)}</p>
      <button
        type="button"
        className="day-card-btn"
        onClick={() => onSelect(day.day_id)}
        aria-pressed={isActive}
      >
        {isActive ? 'Showing itinerary ✓' : 'View itinerary'}
      </button>
    </div>
  )
}

export default function JourneyFlowchart({ selectedDayId, onSelectDay }) {
  return (
    <div className="timeline" role="list" aria-label="10-day journey flowchart, chronologically connected">
      <div className="timeline-line" aria-hidden="true" />
      {tripDays.map((day, index) => {
        const isActive = day.day_id === selectedDayId
        const align = index % 2 === 0 ? 'left' : 'right'
        const node = (
          <button
            key={`node-${day.day_id}`}
            type="button"
            className={`timeline-node ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelectDay(day.day_id)}
            aria-pressed={isActive}
            aria-label={`Day ${day.day_number}: ${day.city} on ${formatDate(day.date)}. Select to view the day's itinerary.`}
            role="listitem"
          >
            <span className="timeline-frame">
              <img src={day.landmark_image_url} alt={day.iconic_landmark} loading="lazy" />
            </span>
            <span className="timeline-node-badge">{day.day_number}</span>
          </button>
        )
        const card = (
          <DayCard key={`card-${day.day_id}`} day={day} align={align} isActive={isActive} onSelect={onSelectDay} />
        )
        return (
          <div className="timeline-row" key={day.day_id}>
            {align === 'left' ? card : <span className="timeline-spacer" />}
            {node}
            {align === 'right' ? card : <span className="timeline-spacer" />}
          </div>
        )
      })}
    </div>
  )
}
