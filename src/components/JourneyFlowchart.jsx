import React from 'react'

export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <div className="flowchart" role="list" aria-label="10-day trip itinerary, select a day to view details">
      {days.map((day, idx) => {
        const isSelected = day.dayId === selectedDayId
        const shape = idx % 2 === 0 ? 'circle' : 'diamond'
        return (
          <React.Fragment key={day.dayId}>
            <div className="flow-node" role="listitem">
              <button
                type="button"
                className={`flow-node-btn${isSelected ? ' is-selected' : ''}`}
                onClick={() => onSelectDay(day.dayId)}
                aria-pressed={isSelected}
                aria-label={`Day ${day.dayNumber}: ${day.city} on ${day.dateLabel}. View itinerary.`}
              >
                <span className="day-badge">Day {day.dayNumber}</span>
                <span className={`frame-outer frame-${shape}`}>
                  <span className={`frame-inner frame-${shape}`}>
                    <img src={day.imageUrl} alt={`${day.landmark}, ${day.city}`} loading="lazy" />
                  </span>
                </span>
                <span className="node-city">{day.city}</span>
                <span className="node-date">{day.dateLabel}</span>
              </button>
            </div>
            {idx < days.length - 1 && (
              <div className="flow-connector" aria-hidden="true">
                <span className="flow-connector-line" />
                <span className="flow-connector-arrow">&rsaquo;</span>
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
