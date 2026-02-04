
const Logo = () => {
  return (
    <div className="flex items-center gap-1">
        <div className="relative">
            <img
                src="https://static.vecteezy.com/system/resources/previews/000/579/642/original/love-logo-and-symbols-vector-template-icons.jpg"
                alt="logo"
                className="w-16 h-16 rounded-full shadow-lg filter brightness-75 animate-pulse relative z-10"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-30 animate-ping"></div>
        </div>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent text-xl font-bold tracking-wide drop-shadow-lg italic animate-bounce">
            Moments
        </span>
    </div>
  )
}

export default Logo