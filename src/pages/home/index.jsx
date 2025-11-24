import { useAuth } from '@/hooks/useAuth'
import { useFeedback } from '@/hooks/useFeedback'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Loader2, Sparkles, Check, User, Mail, Calendar, Building2, MessageSquare, Lightbulb } from 'lucide-react'
import FeedbackIllustration from '@/assets/icons/FeedbackIllustration'

function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const { createFeedback, loading } = useFeedback()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventName: '',
    division: '',
    rating: '',
    comment: '',
    suggestion: '',
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const divisions = ['LnT', 'EEO', 'PR', 'HRD', 'RnD']

  const handleSettingsClick = () => {
    if (user) {
      navigate('/panel')
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        eventName: formData.eventName,
        division: formData.division,
        rating: parseInt(formData.rating),
        comment: formData.comment || undefined,
        suggestion: formData.suggestion || undefined,
      }

      await createFeedback(payload)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        eventName: '',
        division: '',
        rating: '',
        comment: '',
        suggestion: ''
      })

      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err.message || 'Failed to submit feedback')
    }
  }

  if (isPageLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <p className="text-gray-800 font-semibold text-sm">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              Share Your<br />Experience
            </h1>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Your feedback helps us create better events and improve your experience
            </p>
          </div>

          <FeedbackIllustration
            width="500"
            height="400"
            primaryColor="#6c63ff"
            className="drop-shadow-2xl"
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex flex-col relative">
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleSettingsClick}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all shadow-sm"
            title={user ? 'Go to Panel' : 'Login to access Panel'}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-12">
          <div className="w-full max-w-xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                We'd love to hear from you
              </h2>
              <p className="text-gray-500 text-xs leading-relaxed">
                Please take a moment to share your thoughts about the event. Your feedback is valuable to us.
              </p>
            </div>

            {success && (
              <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-2 animate-slide-down">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-xs">Feedback submitted successfully!</p>
                  <p className="text-[10px] text-green-600 mt-0.5">Thank you for taking the time to share your thoughts.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="font-semibold text-xs">Error</p>
                <p className="text-[10px] text-red-600 mt-0.5">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                    <User className="w-3.5 h-3.5 text-gray-700" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={255}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition text-xs text-gray-900 placeholder-gray-400"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-700" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition text-xs text-gray-900 placeholder-gray-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventName" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-700" />
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="eventName"
                  name="eventName"
                  type="text"
                  value={formData.eventName}
                  onChange={handleChange}
                  maxLength={255}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition text-xs text-gray-900 placeholder-gray-400"
                  placeholder="Enter the event name"
                  required
                />
              </div>

              <div>
                <label htmlFor="division" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-700" />
                  Division <span className="text-red-500">*</span>
                </label>
                <select
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition text-xs text-gray-900"
                  required
                >
                  <option value="">Select your division</option>
                  {divisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-2">
                  How satisfied are you with our event? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 1, emoji: '😞', label: 'Very Bad', color: 'hover:border-red-300 hover:bg-red-50', selected: 'border-red-400 bg-gradient-to-br from-red-50 to-red-100' },
                    { value: 2, emoji: '😕', label: 'Bad', color: 'hover:border-orange-300 hover:bg-orange-50', selected: 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100' },
                    { value: 3, emoji: '😐', label: 'Okay', color: 'hover:border-yellow-300 hover:bg-yellow-50', selected: 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' },
                    { value: 4, emoji: '🙂', label: 'Good', color: 'hover:border-lime-300 hover:bg-lime-50', selected: 'border-lime-400 bg-gradient-to-br from-lime-50 to-lime-100' },
                    { value: 5, emoji: '😄', label: 'Very Good', color: 'hover:border-green-300 hover:bg-green-50', selected: 'border-green-400 bg-gradient-to-br from-green-50 to-green-100' }
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: rating.value.toString() })}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.rating === rating.value.toString()
                        ? `${rating.selected} shadow-md scale-105`
                        : `border-gray-200 bg-white ${rating.color}`
                        }`}
                    >
                      <span className="text-2xl mb-1">{rating.emoji}</span>
                      <span className="text-[10px] font-semibold text-gray-700">{rating.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-700" />
                  Comments
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition resize-none text-xs text-gray-900 placeholder-gray-400"
                  placeholder="What did you like most about the event?"
                />
              </div>

              <div>
                <label htmlFor="suggestion" className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-gray-700" />
                  Suggestions for Improvement
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-sm transition resize-none text-xs text-gray-900 placeholder-gray-400"
                  placeholder="How can we make it better next time?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default HomePage
