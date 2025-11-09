const ProgressBar = ({ progress, label }) => {
  const getColor = () => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 60) return 'bg-yellow-500'
    if (progress < 100) return 'bg-blue-500'
    return 'bg-green-500'
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{progress}%</span>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        >
          <div className="h-full w-full bg-white opacity-20 animate-pulse"></div>
        </div>
      </div>

      {progress === 100 && (
        <div className="mt-2 flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Complete!</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar
