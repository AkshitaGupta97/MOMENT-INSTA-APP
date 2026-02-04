
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-lg font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

export default Loader