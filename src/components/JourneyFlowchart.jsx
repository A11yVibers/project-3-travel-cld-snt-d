import { useState } from 'react'
import { formatDate } from '../utils/format.js'

function initials(city) {
  return city
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function JourneyFlowchart({ days, selectedDayId, onSelect }) {
  const [failedImages, setFailedImages] = useState(() => new Set())

  const markFailed = (dayId) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(dayId)
      return next
    })
  }

  return (
    <div className="flow-track" role="list" aria-label="10-day trip timeline">
      {days.map((day, index) => {
        const isSelected = day.dayId === selectedDayId
        const shape = index % 2 === 0 ? 'circle' : 'diamond'
        return (
          <div className="flow-item" key={day.dayId} role="listitem">
            <button
              type="button"
              className={`flow-node ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelect(day.dayId)}
              aria-pressed={isSelected}
              aria-label={`Day ${day.dayNumber}: ${day.city} on ${formatDate(day.date)}. Show itinerary.`}
            >
              <span className="flow-day-badge">Day {day.dayNumber}</span>
              <span className={`flow-frame flow-frame--${shape}`}>
                {failedImages.has(day.dayId) ? (
                  <span className="flow-frame-fallback" title={day.landmark}>
                    {initials(day.city)}
                  </span>
                ) : (
                  <img
                    src={day.imageUrl}
                    alt={`${day.landmark} in ${day.city}`}
                    loading="lazy"
                    onError={() => markFailed(day.dayId)}
                  />
                )}
              </span>
              <span className="flow-city">{day.city}</span>
              <span className="flow-date">{formatDate(day.date)}</span>
            </button>
            {index < days.length - 1 && (
              <span className="flow-connector" aria-hidden="true">
                <span className="flow-connector-line" />
                <span className="flow-connector-arrow">&#8250;</span>
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
