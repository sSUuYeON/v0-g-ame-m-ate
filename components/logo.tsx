export function Logo() {
  return (
    <div className="flex items-center">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 10C17 11.1 16.1 12 15 12C13.9 12 13 11.1 13 10C13 8.9 13.9 8 15 8C16.1 8 17 8.9 17 10Z"
            fill="white"
          />
          <path d="M11 10C11 11.1 10.1 12 9 12C7.9 12 7 11.1 7 10C7 8.9 7.9 8 9 8C10.1 8 11 8.9 11 10Z" fill="white" />
          <path
            d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM15 14C15 13.4 14.6 13 14 13H10C9.4 13 9 13.4 9 14C9 14.6 9.4 15 10 15H14C14.6 15 15 14.6 15 14Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="ml-3">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
          AI Game Friend
        </h1>
        <p className="text-gray-400 text-sm">당신의 게임 친구</p>
      </div>
    </div>
  )
}
