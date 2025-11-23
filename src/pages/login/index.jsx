import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import bnccLogo from '@/assets/images/bncc-logo.png'
import { DesigningIcon } from '@/assets/icons'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('Login submitted:', { email, password, rememberMe })

    setTimeout(() => {
      setIsLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <img src={bnccLogo} alt="BNCC Logo" className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">BNCC</span>
              <span className="text-xs text-gray-600">Bina Nusantara Computer Club</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">
              Enter your email and password to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't Have An Account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-600 font-medium hover:underline"
              >
                Register Now.
              </button>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-20 h-40 bg-blue-700 rounded-br-3xl"></div>
          <div className="absolute top-0 left-20 w-24 h-32 bg-blue-700 rounded-br-3xl"></div>
          <div className="absolute top-0 left-44 w-28 h-20 bg-blue-700 rounded-br-3xl"></div>

          <div className="absolute top-0 right-0 w-32 h-10 bg-blue-500 rounded-bl-3xl"></div>

          <div className="absolute bottom-0 right-0 w-20 h-40 bg-blue-700 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-20 w-24 h-32 bg-blue-700 rounded-tl-3xl"></div>
          <div className="absolute bottom-0 right-44 w-28 h-20 bg-blue-700 rounded-tl-3xl"></div>
        </div>

        <div className="max-w-md space-y-8 relative z-10">
          <div className="relative">
            <DesigningIcon width="500" height="450" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
