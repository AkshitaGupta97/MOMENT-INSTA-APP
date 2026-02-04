
const Logo = () => {
  return (
    <div className="flex items-center gap-1">
        <div className="relative">
            <img
                src="https://img.freepik.com/premium-photo/love-bird-logo-design-template-abstract-love-bird-logo-design-concept_1308172-107908.jpg"
                alt="logo"
                className="w-16 h-16 rounded-full shadow-lg filter brightness-90 animate-pulse relative z-10"
            />
           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-80 animate-pulse"></div>
        </div>
        <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-pink-600 bg-clip-text text-transparent text-xl font-bold tracking-wide drop-shadow-lg italic animate-bounce">
            Moments
        </span>
    </div>
  )
}

export default Logo