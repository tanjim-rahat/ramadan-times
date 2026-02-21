import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import { cn } from '@/lib/cn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="hover:opacity-80 transition-opacity">
            <img src={viteLogo} className="w-24 h-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
            <img src={reactLogo} className="w-24 h-24 animate-spin-slow" alt="React logo" />
          </a>
        </div>
        <h1 className="text-5xl font-bold text-white mb-8">Vite + React</h1>
        <div className="bg-white rounded-lg shadow-xl p-8 mb-4">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className={cn(
              "bg-purple-600 hover:bg-purple-700 text-white",
              "font-semibold py-3 px-6 rounded-lg transition-colors"
            )}
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-white text-sm opacity-75">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
