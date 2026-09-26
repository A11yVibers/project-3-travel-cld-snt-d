import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getCategoryBreakdownByDay } from '../lib/data.js'

const CATEGORY_COLORS = {
  Lodging: '#6d5cff',
  Food: '#ff8a5c',
  Entertainment: '#2fbf9f',
  Travel: '#f2b705',
}

const currency = (value) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

export default function ExpenseChart({ totals }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const grandTotal = useMemo(
    () => totals.reduce((sum, row) => sum + row.total, 0),
    [totals]
  )

  const breakdown = useMemo(
    () => (selectedCategory ? getCategoryBreakdownByDay(selectedCategory) : null),
    [selectedCategory]
  )

  return (
    <div className="expense-section">
      <div className="panel expense-panel">
        <div className="panel-header">
          <h3>Spending by Category</h3>
          <span className="panel-subtitle">Total: {currency(grandTotal)}</span>
        </div>
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={totals}
                dataKey="total"
                nameKey="category"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                cursor="pointer"
                onClick={(entry) => setSelectedCategory(entry.category)}
              >
                {totals.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category]}
                    stroke={
                      selectedCategory === entry.category ? '#1c1c28' : 'transparent'
                    }
                    strokeWidth={selectedCategory === entry.category ? 3 : 0}
                    opacity={
                      selectedCategory && selectedCategory !== entry.category ? 0.45 : 1
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [currency(value), name]}
              />
              <Legend
                onClick={(entry) => setSelectedCategory(entry.value)}
                wrapperStyle={{ cursor: 'pointer' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="chart-hint">Select a slice or legend entry to compare spending by day.</p>
        </div>
      </div>

      <div className="panel expense-panel">
        <div className="panel-header">
          <h3>
            {selectedCategory ? `${selectedCategory} Spend by Day` : 'Daily Comparison'}
          </h3>
          {selectedCategory && (
            <span className="panel-subtitle">Across all 10 cities</span>
          )}
        </div>
        {!breakdown ? (
          <p className="chart-empty">
            Choose a category from the chart to see how much was spent on it in each city.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={breakdown} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="city"
                interval={0}
                angle={-35}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={currency} width={64} />
              <Tooltip
                formatter={(value) => currency(value)}
                labelFormatter={(label, payload) => {
                  const row = payload && payload[0] && payload[0].payload
                  return row ? `Day ${row.dayNumber} · ${row.city}` : label
                }}
              />
              <Bar
                dataKey="amount"
                fill={CATEGORY_COLORS[selectedCategory]}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
