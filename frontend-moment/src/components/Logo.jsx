
const Logo = () => {
  return (
    <div className="flex items-center gap-1">
        <div className="relative">
            <img
                src="https://cdn.pixabay.com/photo/2016/12/28/08/15/hummingbird-1935665__340.png"
                alt="logo"
                className="w-16 h-16 rounded-full shadow-lg filter brightness-75 animate-pulse relative z-10"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-800 to-purple-800 opacity-80 animate-ping"></div>
        </div>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-xl font-bold tracking-wide drop-shadow-lg italic animate-bounce">
            Moments
        </span>
    </div>
  )
}

export default Logo