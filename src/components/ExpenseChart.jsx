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
import { expenseTotalsByCategory, expenseByCategoryPerDay, grandTotalSpend } from '../data.js'

const CATEGORY_COLORS = {
  lodging: '#3a6ea5',
  food: '#e08e45',
  entertainment: '#9a5ba0',
  travel: '#3f9c7a',
}

function formatUsd(value) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function ExpenseChart() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const comparisonData = useMemo(
    () => (selectedCategory ? expenseByCategoryPerDay(selectedCategory) : []),
    [selectedCategory]
  )

  const selectedLabel = useMemo(() => {
    const entry = expenseTotalsByCategory.find((c) => c.key === selectedCategory)
    return entry ? entry.name : null
  }, [selectedCategory])

  const selectedColor = selectedCategory ? CATEGORY_COLORS[selectedCategory] : '#888'
  const selectedTotal = selectedCategory
    ? comparisonData.reduce((sum, d) => sum + d.amount, 0)
    : 0

  return (
    <div className="expense-section">
      <div className="expense-chart-card">
        <h3 className="expense-total">
          Total trip spend: <span>{formatUsd(grandTotalSpend)}</span>
        </h3>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
            <Pie
              data={expenseTotalsByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="62%"
              paddingAngle={2}
              onClick={(entry) => setSelectedCategory(entry.key)}
              cursor="pointer"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {expenseTotalsByCategory.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={CATEGORY_COLORS[entry.key]}
                  stroke={entry.key === selectedCategory ? '#1a1a1a' : '#ffffff'}
                  strokeWidth={entry.key === selectedCategory ? 3 : 1}
                  opacity={selectedCategory && entry.key !== selectedCategory ? 0.55 : 1}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatUsd(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p className="expense-hint">Select a slice to compare that category's spend across each day of the trip.</p>
      </div>

      <div className="expense-comparison-card">
        {selectedCategory ? (
          <>
            <h3>
              {selectedLabel} spend by day <span style={{ color: selectedColor }}>({formatUsd(selectedTotal)} total)</span>
            </h3>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(value) => formatUsd(value)}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="amount" fill={selectedColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="expense-placeholder">
            <p>Choose a category from the donut chart to see the day-by-day, city-by-city breakdown.</p>
          </div>
        )}
      </div>
    </div>
  )
}
