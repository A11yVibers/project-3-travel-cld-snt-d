import { formatDate } from '../lib/data.js'
import LandmarkImage from './LandmarkImage.jsx'

export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <div className="flowchart" role="list" aria-label="Trip itinerary, ten days">
      {days.map((day, index) => {
        const isSelected = day.dayId === selectedDayId
        const shape = index % 2 === 0 ? 'circle' : 'diamond'
        return (
          <div className="flow-item" key={day.dayId} role="listitem">
            <button
              type="button"
              className={`flow-node${isSelected ? ' is-selected' : ''}`}
              onClick={() => onSelectDay(day.dayId)}
              aria-pressed={isSelected}
              aria-label={`Day ${day.dayNumber}: ${day.city}, ${formatDate(day.date)}. Select to view itinerary.`}
            >
              <span className="flow-day-badge">Day {day.dayNumber}</span>
              <span className={`flow-frame flow-frame--${shape}`}>
                <LandmarkImage src={day.imageUrl} alt={day.landmark} />
              </span>
              <span className="flow-caption">
                <span className="flow-city">{day.city}</span>
                <span className="flow-date">{formatDate(day.date)}</span>
              </span>
            </button>
            {index < days.length - 1 && <span className="flow-connector" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}
