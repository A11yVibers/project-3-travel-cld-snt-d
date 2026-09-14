export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <ol className="journey" aria-label="10 day journey timeline">
      {days.map((day, index) => {
        const isSelected = day.dayId === selectedDayId
        const shape = index % 2 === 0 ? 'circle' : 'diamond'
        return (
          <li className="journey__item" key={day.dayId}>
            <button
              type="button"
              className={`day-node day-node--${shape} ${isSelected ? 'day-node--selected' : ''}`}
              onClick={() => onSelectDay(day.dayId)}
              aria-pressed={isSelected}
              aria-label={`Show itinerary for day ${day.dayNumber}, ${day.city} on ${day.dateLabel}`}
            >
              <span className="day-node__badge">Day {day.dayNumber}</span>
              <span className="day-node__frame">
                <span className="day-node__frame-inner">
                  <img src={day.imageUrl} alt={day.landmark} loading="lazy" />
                </span>
              </span>
            </button>
            <div className="day-node__caption">
              <span className="day-node__city">{day.city}</span>
              <span className="day-node__date">{day.dateLabel}</span>
            </div>
            {index < days.length - 1 && (
              <span className="journey__connector" aria-hidden="true">
                <svg viewBox="0 0 40 12" width="40" height="12">
                  <line x1="0" y1="6" x2="30" y2="6" stroke="currentColor" strokeWidth="2" />
                  <polygon points="30,0 40,6 30,12" fill="currentColor" />
                </svg>
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}
