import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatDate } from '../utils/format.js'

const CATEGORY_COLORS = {
  lodging: '#3b6fb6',
  food: '#e0964f',
  entertainment: '#5fa777',
  travel: '#a26bc2',
}

function TotalTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const entry = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{entry.label}</strong>
      <div>{formatCurrency(entry.total)}</div>
    </div>
  )
}

function DailyTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const entry = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>
        Day {entry.dayNumber} &middot; {entry.city}
      </strong>
      <div>{formatDate(entry.date)}</div>
      <div>{formatCurrency(entry.amount)}</div>
    </div>
  )
}

export default function ExpenseChart({ categoryTotals, dailyCategoryTotals, categoryLabels }) {
  const [selectedCategory, setSelectedCategory] = useState(categoryTotals[0]?.category ?? null)

  const grandTotal = useMemo(
    () => categoryTotals.reduce((sum, entry) => sum + entry.total, 0),
    [categoryTotals]
  )

  const dailyData = selectedCategory ? dailyCategoryTotals[selectedCategory] : []
  const selectedLabel = selectedCategory ? categoryLabels[selectedCategory] : ''

  return (
    <div className="expense-chart">
      <div className="expense-chart-donut">
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={categoryTotals}
              dataKey="total"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={78}
              outerRadius={130}
              paddingAngle={3}
              onClick={(entry) => setSelectedCategory(entry.category)}
              isAnimationActive={false}
            >
              {categoryTotals.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category]}
                  stroke={entry.category === selectedCategory ? '#1f2933' : '#ffffff'}
                  strokeWidth={entry.category === selectedCategory ? 3 : 1}
                  cursor="pointer"
                  onClick={() => setSelectedCategory(entry.category)}
                  role="button"
                  aria-label={`${entry.label}: ${formatCurrency(entry.total)}. Show daily breakdown.`}
                />
              ))}
            </Pie>
            <text
              x="50%"
              y="47%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="donut-center-label"
            >
              {formatCurrency(grandTotal)}
            </text>
            <text
              x="50%"
              y="57%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="donut-center-sublabel"
            >
              Total spent
            </text>
            <Tooltip content={<TotalTooltip />} />
            <Legend
              verticalAlign="bottom"
              onClick={(entry) => {
                const match = categoryTotals.find((c) => c.label === entry.value)
                if (match) setSelectedCategory(match.category)
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="expense-category-buttons" role="group" aria-label="Expense categories">
          {categoryTotals.map((entry) => (
            <button
              key={entry.category}
              type="button"
              className={`category-pill ${entry.category === selectedCategory ? 'is-selected' : ''}`}
              style={{ borderColor: CATEGORY_COLORS[entry.category] }}
              onClick={() => setSelectedCategory(entry.category)}
              aria-pressed={entry.category === selectedCategory}
            >
              <span
                className="category-pill-swatch"
                style={{ background: CATEGORY_COLORS[entry.category] }}
              />
              {entry.label}
              <span className="category-pill-amount">{formatCurrency(entry.total)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="expense-chart-detail">
        <h3>{selectedLabel} spending by day</h3>
        <p className="expense-chart-detail-subtitle">
          Compare {selectedLabel.toLowerCase()} costs across each city on the trip.
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={dailyData} margin={{ top: 10, right: 16, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="city"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={(value) => `$${value}`} width={56} />
            <Tooltip content={<DailyTooltip />} />
            <Bar
              dataKey="amount"
              fill={selectedCategory ? CATEGORY_COLORS[selectedCategory] : '#3b6fb6'}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
