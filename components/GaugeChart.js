import React, { useState } from 'react'
import { Info } from 'lucide-react'

const GaugeChart = ({ 
  value, 
  title = "Self-Medication Rate", 
  subtitle = "",
  previousValue = null,
  tooltipData = null,
  size = "medium" 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  // Size configurations
  const sizeConfig = {
    small: { width: 200, height: 120, fontSize: 'text-lg', centerFontSize: 'text-2xl' },
    medium: { width: 300, height: 180, fontSize: 'text-xl', centerFontSize: 'text-3xl' },
    large: { width: 400, height: 240, fontSize: 'text-2xl', centerFontSize: 'text-4xl' }
  }

  const config = sizeConfig[size]
  
  // Calculate gauge properties
  const radius = config.width / 2 - 20
  const centerX = config.width / 2
  const centerY = config.height - 20
  const startAngle = Math.PI // 180 degrees
  const endAngle = 0 // 0 degrees
  const angleRange = endAngle - startAngle
  
  // Calculate needle angle
  const needleAngle = startAngle + (value / 100) * angleRange
  
  // Color zones
  const getColor = (percentage) => {
    if (percentage <= 20) return '#10b981' // Green - Low Risk
    if (percentage <= 40) return '#f59e0b' // Yellow - Moderate Risk
    if (percentage <= 60) return '#f97316' // Orange - High Risk
    return '#ef4444' // Red - Very High Risk
  }

  const getRiskLevel = (percentage) => {
    if (percentage <= 20) return 'Low Risk'
    if (percentage <= 40) return 'Moderate Risk'
    if (percentage <= 60) return 'High Risk'
    return 'Very High Risk'
  }

  // Create gauge arc
  const createArc = (start, end, color, strokeWidth = 8) => {
    const x1 = centerX + radius * Math.cos(start)
    const y1 = centerY + radius * Math.sin(start)
    const x2 = centerX + radius * Math.cos(end)
    const y2 = centerY + radius * Math.sin(end)
    
    const largeArcFlag = Math.abs(end - start) > Math.PI ? 1 : 0
    
    return (
      <path
        d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x2} ${y2}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    )
  }

  // Create gauge background
  const createGaugeBackground = () => {
    const segments = [
      { start: 0, end: 0.2, color: '#10b981' }, // Green 0-20%
      { start: 0.2, end: 0.4, color: '#f59e0b' }, // Yellow 21-40%
      { start: 0.4, end: 0.6, color: '#f97316' }, // Orange 41-60%
      { start: 0.6, end: 1.0, color: '#ef4444' }  // Red 61-100%
    ]

    return segments.map((segment, index) => {
      const startAngle = Math.PI + segment.start * Math.PI
      const endAngle = Math.PI + segment.end * Math.PI
      return createArc(startAngle, endAngle, segment.color, 12)
    })
  }

  // Calculate needle position
  const needleX = centerX + (radius - 10) * Math.cos(needleAngle)
  const needleY = centerY + (radius - 10) * Math.sin(needleAngle)

  // Calculate change indicator
  const getChangeIndicator = () => {
    if (!previousValue) return null
    const change = value - previousValue
    if (change > 0) return { icon: '📈', text: `↑ ${Math.abs(change).toFixed(1)}% from last month`, color: 'text-red-600' }
    if (change < 0) return { icon: '📉', text: `↓ ${Math.abs(change).toFixed(1)}% from last month`, color: 'text-green-600' }
    return { icon: '➡️', text: 'No change from last month', color: 'text-gray-600' }
  }

  const changeIndicator = getChangeIndicator()

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-gray-900 ${config.fontSize}`}>{title}</h3>
        <div className="relative">
          <button 
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
          
          {showTooltip && (
            <div className="absolute right-0 top-8 w-80 p-4 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
              <div className="space-y-2">
                <div>
                  <strong>Formula:</strong>
                  <p className="text-xs mt-1">
                    (Antibiotic users without doctor consultation ÷ Total antibiotic users) × 100
                  </p>
                </div>
                {tooltipData && (
                  <div>
                    <strong>Raw Data:</strong>
                    <p className="text-xs mt-1">
                      {tooltipData.selfMedicated} self-medicated out of {tooltipData.total} antibiotic users
                    </p>
                  </div>
                )}
                <div>
                  <strong>Risk Level:</strong>
                  <p className="text-xs mt-1">{getRiskLevel(value)}</p>
                </div>
                {changeIndicator && (
                  <div>
                    <strong>Trend:</strong>
                    <p className={`text-xs mt-1 ${changeIndicator.color}`}>
                      {changeIndicator.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative" style={{ width: config.width, height: config.height }}>
        <svg width={config.width} height={config.height}>
          {/* Gauge background */}
          {createGaugeBackground()}
          
          {/* Needle */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Needle center point */}
          <circle
            cx={centerX}
            cy={centerY}
            r="6"
            fill="#1f2937"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold text-gray-900 ${config.centerFontSize}`}>
            {value.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {subtitle || "Self-Medication Rate"}
          </div>
          {changeIndicator && (
            <div className={`text-xs mt-2 ${changeIndicator.color}`}>
              {changeIndicator.icon} {changeIndicator.text}
            </div>
          )}
        </div>
      </div>

      {/* Risk level indicator */}
      <div className="mt-4 text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          value <= 20 ? 'bg-green-100 text-green-800' :
          value <= 40 ? 'bg-yellow-100 text-yellow-800' :
          value <= 60 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getRiskLevel(value)}
        </span>
      </div>
    </div>
  )
}

export default GaugeChart
