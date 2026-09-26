import React, { useState } from 'react'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// Landmark photos are hotlinked from Wikimedia Commons redirect URLs, which can
// occasionally answer with a rate-limit page instead of the image. Fall back to a
// text badge inside the same frame shape rather than showing a broken-image icon.
function LandmarkImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="flow-frame-fallback" title={alt}>
        {alt}
      </span>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}

export default function JourneyFlowchart({ days, selectedDayId, onSelect }) {
  return (
    <div className="flow-wrap">
      <ol className="flow-track" role="listbox" aria-label="Trip itinerary, day by day">
        {days.map((day, i) => {
          const isSelected = day.day_id === selectedDayId
          const shape = i % 2 === 0 ? 'circle' : 'diamond'
          return (
            <li key={day.day_id} className="flow-item">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flow-node flow-node--${shape} ${isSelected ? 'is-active' : ''}`}
                onClick={() => onSelect(day.day_id)}
              >
                <span className="flow-daybadge">Day {day.day_number}</span>
                <span className={`flow-frame flow-frame--${shape}`}>
                  <LandmarkImage src={day.landmark_image_url} alt={day.iconic_landmark} />
                </span>
              </button>
              <div className="flow-caption">
                <span className="flow-city">{day.city}</span>
                <span className="flow-date">{formatDate(day.date)}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
