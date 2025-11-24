import { useAuth } from '@/hooks/useAuth'
import { useFeedback } from '@/hooks/useFeedback'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, LogOut, Home, Edit, Trash2, Save, X, Star, MessageCircle, Download } from 'lucide-react'

function PanelPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { getAllFeedbacks, updateFeedback, deleteFeedback, loading } = useFeedback()

  const [feedbacks, setFeedbacks] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    eventName: '',
    division: '',
    rating: '',
    comment: '',
    suggestion: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const divisions = ['LnT', 'Eeo', 'PR', 'HRD', 'AnD']

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  const getCommentCount = (feedback) => {
    let count = 0
    if (feedback.comment && feedback.comment.trim()) count++
    if (feedback.suggestion && feedback.suggestion.trim()) count++
    return count
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const data = await getAllFeedbacks()
        setFeedbacks(data.feedbacks || data || [])
      } catch (err) {
        setError('Failed to load feedbacks')
      } finally {
        setIsPageLoading(false)
      }
    }

    loadData()
  }, [])

  const handleEdit = (feedback) => {
    setEditingId(feedback.id)
    setEditForm({
      name: feedback.name,
      email: feedback.email,
      eventName: feedback.eventName,
      division: feedback.division,
      rating: feedback.rating?.toString() || '',
      comment: feedback.comment || '',
      suggestion: feedback.suggestion || '',
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      name: '',
      email: '',
      eventName: '',
      division: '',
      rating: '',
      comment: '',
      suggestion: ''
    })
  }

  const handleUpdate = async (id) => {
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        eventName: editForm.eventName,
        division: editForm.division,
        rating: parseInt(editForm.rating),
        comment: editForm.comment || undefined,
        suggestion: editForm.suggestion || undefined,
      }

      await updateFeedback(id, payload)
      const data = await getAllFeedbacks()
      setFeedbacks(data.feedbacks || data || [])
      setEditingId(null)
      setSuccess('Feedback updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update feedback')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await deleteFeedback(id)
      const data = await getAllFeedbacks()
      setFeedbacks(data.feedbacks || data || [])
      setSuccess('Feedback deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete feedback')
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="text-gray-400">Review and rating</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Marshall Islands</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.email?.split('@')[0] || 'User'}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={signOut}
                className="p-2 text-gray-400 hover:text-gray-600 transition"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {editingId ? (
              <div className="bg-white rounded-lg border-2 border-blue-400 p-6 max-w-4xl">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Feedback</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        maxLength={255}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Event Name</label>
                    <input
                      type="text"
                      value={editForm.eventName}
                      onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                      maxLength={255}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Division</label>
                      <select
                        value={editForm.division}
                        onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
                      >
                        <option value="">Select division</option>
                        {divisions.map((div) => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Rating</label>
                      <select
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition text-sm text-gray-900"
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

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Comment</label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none text-sm text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Suggestion</label>
                    <textarea
                      value={editForm.suggestion}
                      onChange={(e) => setEditForm({ ...editForm, suggestion: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition resize-none text-sm text-gray-900"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleUpdate(feedbacks.find(f => f.id === editingId)?.id)}
                      disabled={loading}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition disabled:opacity-50 text-sm"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-sm text-gray-500">No feedbacks yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                      selectedFeedback?.id === feedback.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {feedback.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-bold text-gray-900">{feedback.name}</h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(feedback.created_at || Date.now()).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {renderStars(feedback.rating)}
                              </div>
                              <div className="flex items-center gap-1.5 bg-teal-500 text-white px-2.5 py-1 rounded-full">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">{getCommentCount(feedback)}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {feedback.comment || feedback.suggestion || 'No comment provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedFeedback && !editingId && (
            <div className="w-64 bg-white border-l border-gray-200 p-6 flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </button>

              <button
                onClick={() => handleEdit(selectedFeedback)}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>

              <button
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                onClick={() => handleDelete(selectedFeedback.id)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:border-red-200 transition text-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PanelPage
