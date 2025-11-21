import bnccLogo from '@/assets/images/bncc-logo.png'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-6">
          <img src={bnccLogo} alt="BNCC Logo" className="w-20 h-20 mx-auto object-contain" />

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              BNCC Frontend
            </h1>
            <p className="text-gray-600">
              React + Vite + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
