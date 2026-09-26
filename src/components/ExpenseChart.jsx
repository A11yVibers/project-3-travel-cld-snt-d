import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts'
import { CATEGORY_COLORS, categoryTotals, dayCategoryTotals, tripTotal } from '../data.js'

const currency = (value) =>
  `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

function PieTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const { category, amount } = payload[0].payload
  const pct = ((amount / tripTotal) * 100).toFixed(1)
  return (
    <div className="chart-tooltip">
      <strong>{category}</strong>
      <div>{currency(amount)} · {pct}% of trip</div>
    </div>
  )
}

function BarTooltip({ active, payload, category }) {
  if (!active || !payload || !payload.length) return null
  const { city, date, amount } = payload[0].payload
  return (
    <div className="chart-tooltip">
      <strong>{city}</strong>
      <div>{date}</div>
      <div>{category}: {currency(amount)}</div>
    </div>
  )
}

export default function ExpenseChart() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const dayData = useMemo(
    () => (selectedCategory ? dayCategoryTotals[selectedCategory] : []),
    [selectedCategory],
  )

  return (
    <section className="expense-section" aria-labelledby="expense-heading">
      <h2 id="expense-heading">Trip Spending</h2>
      <p className="expense-sub">
        Total spent across the trip: <strong>{currency(tripTotal)}</strong>. Select a slice to compare that
        category&rsquo;s spend across each of the 10 cities.
      </p>

      <div className="expense-layout">
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryTotals}
                dataKey="amount"
                nameKey="category"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                onClick={(entry) => setSelectedCategory(entry.category)}
                isAnimationActive={false}
              >
                {categoryTotals.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category]}
                    style={{ cursor: 'pointer' }}
                    stroke={selectedCategory === entry.category ? '#1d1d1f' : '#ffffff'}
                    strokeWidth={selectedCategory === entry.category ? 3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                onClick={(entry) => setSelectedCategory(entry.value)}
                formatter={(value) => (
                  <span className={value === selectedCategory ? 'legend-active' : ''}>{value}</span>
                )}
                wrapperStyle={{ cursor: 'pointer' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="category-buttons" role="group" aria-label="Choose an expense category">
            {categoryTotals.map((entry) => (
              <button
                key={entry.category}
                type="button"
                className={`category-btn ${selectedCategory === entry.category ? 'is-active' : ''}`}
                style={{ '--cat-color': CATEGORY_COLORS[entry.category] }}
                onClick={() => setSelectedCategory(entry.category)}
                aria-pressed={selectedCategory === entry.category}
              >
                <span className="category-dot" />
                {entry.category}
                <span className="category-amount">{currency(entry.amount)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="comparison-wrap" aria-live="polite">
          {selectedCategory ? (
            <>
              <h3>
                {selectedCategory} spend by city
                <span className="comparison-total">
                  {' '}
                  · total {currency(dayData.reduce((s, d) => s + d.amount, 0))}
                </span>
              </h3>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={dayData} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="city"
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tickFormatter={currency} width={64} />
                  <Tooltip content={<BarTooltip category={selectedCategory} />} />
                  <Bar dataKey="amount" fill={CATEGORY_COLORS[selectedCategory]} radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="amount" position="top" formatter={currency} fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="comparison-placeholder">
              <p>👈 Select a slice or category to compare daily spending by city.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
