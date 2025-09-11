import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function MetricCard({ title, value, change, description, trend }) {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toFixed(1) + '%'
    }
    return val
  }

  const getTrendIcon = () => {
    if (trend === 'increasing') {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (trend === 'decreasing') {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    }
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getChangeColor = () => {
    if (trend === 'increasing') {
      return 'text-green-600'
    } else if (trend === 'decreasing') {
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="metric-value">{formatValue(value)}</div>
          {change !== undefined && (
            <div className={`metric-change ${getChangeColor()} flex items-center gap-1 mt-1`}>
              {getTrendIcon()}
              <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
