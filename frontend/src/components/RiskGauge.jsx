import { getRiskLevel, RISK_CONFIG } from '../utils/constants'

const RiskGauge = ({ score, size = 'large' }) => {
  const riskLevel = getRiskLevel(score)
  const config = RISK_CONFIG[riskLevel]

  const getGaugeColor = () => {
    switch (config.color) {
      case 'green': return 'text-green-600'
      case 'yellow': return 'text-yellow-600'
      case 'orange': return 'text-orange-600'
      case 'red': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getBgColor = () => {
    switch (config.color) {
      case 'green': return 'bg-green-100'
      case 'yellow': return 'bg-yellow-100'
      case 'orange': return 'bg-orange-100'
      case 'red': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  const sizeClasses = {
    small: 'w-24 h-24 text-2xl',
    medium: 'w-32 h-32 text-3xl',
    large: 'w-40 h-40 text-5xl'
  }

  const percentage = score
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      {/* Circular Gauge */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />

          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={getGaugeColor()}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out'
            }}
          />
        </svg>

        {/* Score in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getGaugeColor()}`}>
            {score}
          </span>
        </div>
      </div>

      {/* Risk level label */}
      <div className={`mt-4 px-4 py-2 rounded-full ${getBgColor()}`}>
        <span className={`text-sm font-semibold ${getGaugeColor()}`}>
          {config.label}
        </span>
      </div>

      {/* Score interpretation */}
      <p className="mt-2 text-xs text-gray-600 text-center max-w-xs">
        {score < 30 && 'Low risk. All compliance checks passed.'}
        {score >= 30 && score < 60 && 'Medium risk. Some attention required.'}
        {score >= 60 && score < 80 && 'High risk. Review recommended.'}
        {score >= 80 && 'Critical risk. Immediate action required.'}
      </p>
    </div>
  )
}

export default RiskGauge
