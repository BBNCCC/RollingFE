import { useAuth } from '@/hooks/useAuth'
import { useFeedback } from '@/hooks/useFeedback'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, ChevronLeft, Loader2 } from 'lucide-react'
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

  const divisions = ['LnT', 'Eeo', 'PR', 'HRD', 'AnD']

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
      }, 3000)
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
      {/* Left Section - Blue Background with Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 items-center justify-center p-12">
        <FeedbackIllustration
          width="600"
          height="500"
          primaryColor="#6c63ff"
          className="drop-shadow-2xl"
        />
      </div>

      {/* Right Section - White Background with Form */}
      <div className="w-full lg:w-1/2 bg-white overflow-y-auto">
        <div className="h-full flex flex-col">
          {/* Settings button - Desktop */}
          <div className="hidden lg:flex justify-end p-6">
            <button
              onClick={handleSettingsClick}
              className="p-3 rounded-full hover:bg-gray-100 transition"
              title={user ? 'Go to Panel' : 'Login to access Panel'}
            >
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
            <div className="w-full max-w-xl">
              {/* Header with back button */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    className="lg:hidden p-1.5 rounded-full hover:bg-gray-100 transition"
                    onClick={() => window.history.back()}
                  >
                    <ChevronLeft className="w-5 h-5 text-blue-600" />
                  </button>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">
                    FEEDBACK FORM
                  </p>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Fill your feedback below
                </h1>
                <p className="text-gray-500 text-sm">
                  We need your feedback for event improvement and future updates
                </p>
              </div>

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
                  Feedback submitted successfully!
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-600 mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={255}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      placeholder="Brooklyn"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      placeholder="brooklyn@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Event Name */}
                <div>
                  <label htmlFor="eventName" className="block text-xs font-medium text-gray-600 mb-2">
                    Event Name
                  </label>
                  <input
                    id="eventName"
                    name="eventName"
                    type="text"
                    value={formData.eventName}
                    onChange={handleChange}
                    maxLength={255}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                    placeholder="Event name"
                    required
                  />
                </div>

                {/* Division & Rating Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="division" className="block text-xs font-medium text-gray-600 mb-2">
                      Division
                    </label>
                    <select
                      id="division"
                      name="division"
                      value={formData.division}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      required
                    >
                      <option value="">Select division</option>
                      {divisions.map((div) => (
                        <option key={div} value={div}>
                          {div}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rating" className="block text-xs font-medium text-gray-600 mb-2">
                      Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label htmlFor="comment" className="block text-xs font-medium text-gray-600 mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none text-sm text-gray-900"
                    placeholder="Your feedback..."
                  />
                </div>

                {/* Suggestion */}
                <div>
                  <label htmlFor="suggestion" className="block text-xs font-medium text-gray-600 mb-2">
                    Suggestion
                  </label>
                  <textarea
                    id="suggestion"
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none text-sm text-gray-900"
                    placeholder="Any suggestions for improvement?"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? 'Submitting...' : 'CONTINUE'}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
