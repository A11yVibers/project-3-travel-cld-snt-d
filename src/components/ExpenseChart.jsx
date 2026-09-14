import { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { categoryByDay } from '../data.js'

const CATEGORY_COLORS = {
  Lodging: '#6366f1',
  Food: '#f59e0b',
  Entertainment: '#ec4899',
  Travel: '#14b8a6',
}

const currency = (value) => `$${value.toFixed(0)}`

export default function ExpenseChart({ categoryTotals }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const grandTotal = useMemo(() => categoryTotals.reduce((s, c) => s + c.total, 0), [categoryTotals])

  const dailyBreakdown = useMemo(
    () => (selectedCategory ? categoryByDay(selectedCategory) : []),
    [selectedCategory]
  )

  return (
    <div className="expense-section">
      <div className="panel expense-panel">
        <div className="panel__header">
          <h3>Trip Spending by Category</h3>
          <span className="panel__subheading">Total: {currency(grandTotal)}</span>
        </div>
        <div className="expense-panel__body">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryTotals}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                onClick={(entry) => setSelectedCategory(entry.category)}
                cursor="pointer"
              >
                {categoryTotals.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category]}
                    stroke={selectedCategory === entry.category ? '#1e293b' : 'transparent'}
                    strokeWidth={selectedCategory === entry.category ? 3 : 0}
                    opacity={selectedCategory && selectedCategory !== entry.category ? 0.45 : 1}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} />
              <Legend
                onClick={(entry) => setSelectedCategory(entry.value)}
                wrapperStyle={{ cursor: 'pointer' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="panel__hint">Click a slice (or legend item) to compare that category's spending across all 10 days.</p>
        </div>
      </div>

      <div className="panel expense-panel">
        <div className="panel__header">
          <h3>
            {selectedCategory ? `${selectedCategory} Spending by Day` : 'Daily Comparison'}
          </h3>
          {selectedCategory && (
            <span className="panel__subheading" style={{ color: CATEGORY_COLORS[selectedCategory] }}>
              {selectedCategory}
            </span>
          )}
        </div>
        {selectedCategory ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dailyBreakdown} margin={{ top: 8, right: 16, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" angle={-40} textAnchor="end" interval={0} height={70} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={currency} />
              <Tooltip formatter={(value) => currency(value)} labelFormatter={(label) => label} />
              <Bar dataKey="amount" fill={CATEGORY_COLORS[selectedCategory]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="panel__hint">Select a category slice to see the day-by-day, city-by-city comparison.</p>
        )}
      </div>
    </div>
  )
}
