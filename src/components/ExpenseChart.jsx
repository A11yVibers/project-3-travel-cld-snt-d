import React, { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { expenseByDayForCategory } from '../data.js'

const CATEGORY_COLORS = {
  Lodging: '#3f6fb4',
  Food: '#d9822b',
  Entertainment: '#5aa469',
  Travel: '#a05aa4',
}

function formatUSD(value) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const { category, total } = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{category}</strong>
      <div>{formatUSD(total)}</div>
    </div>
  )
}

function BarTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const { city, date, total } = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{city}</strong>
      <div>{date}</div>
      <div>{formatUSD(total)}</div>
    </div>
  )
}

export default function ExpenseChart({ totalsByCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(totalsByCategory[0]?.category ?? null)

  const grandTotal = useMemo(
    () => totalsByCategory.reduce((sum, c) => sum + c.total, 0),
    [totalsByCategory]
  )

  const dayBreakdown = useMemo(
    () => (selectedCategory ? expenseByDayForCategory(selectedCategory) : []),
    [selectedCategory]
  )

  return (
    <div className="expense-section">
      <div className="expense-chart-card">
        <h3>Overall spending distribution</h3>
        <p className="expense-total">Total trip spend: {formatUSD(grandTotal)}</p>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={totalsByCategory}
              dataKey="total"
              nameKey="category"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              onClick={(entry) => setSelectedCategory(entry.category)}
              cursor="pointer"
            >
              {totalsByCategory.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category]}
                  stroke={entry.category === selectedCategory ? '#1a1a1a' : '#fff'}
                  strokeWidth={entry.category === selectedCategory ? 3 : 1}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              onClick={(entry) => setSelectedCategory(entry.payload.category)}
              formatter={(value) => <span className="legend-label">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        <p className="chart-hint">Select a slice or legend item to compare that category across all 10 days.</p>
      </div>

      <div className="expense-breakdown-card">
        <h3>{selectedCategory} spending by day</h3>
        <p className="expense-breakdown-subtitle">
          How much went to {selectedCategory?.toLowerCase()} in each city, day by day.
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={dayBreakdown} margin={{ top: 10, right: 16, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="city"
              angle={-40}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis tickFormatter={(v) => `$${v}`} width={56} />
            <Tooltip content={<BarTooltip />} />
            <Bar
              dataKey="total"
              fill={CATEGORY_COLORS[selectedCategory]}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
