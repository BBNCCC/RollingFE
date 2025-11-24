import { useAuth } from '@/hooks/useAuth'
import { useFeedback } from '@/hooks/useFeedback'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

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

  const divisions = ['LnT', 'Eeo', 'PR', 'HRD', 'AnD']

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const data = await getAllFeedbacks()
        // API returns { feedbacks: [...], pagination: {...} } in data property
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feedback Panel</h1>
              <p className="text-gray-600 mt-2">Manage all feedback submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Back to Home
              </button>
              <button
                onClick={signOut}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          {user && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Logged in as: <span className="font-semibold text-gray-900">{user.email}</span></p>
            </div>
          )}
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Feedbacks ({feedbacks.length})
            </h2>
          </div>

          {feedbacks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No feedbacks yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="p-6 hover:bg-gray-50 transition">
                  {editingId === feedback.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            maxLength={255}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Event Name</label>
                        <input
                          type="text"
                          value={editForm.eventName}
                          onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                          maxLength={255}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Division</label>
                          <select
                            value={editForm.division}
                            onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          <label className="text-sm font-medium text-gray-700">Rating</label>
                          <select
                            value={editForm.rating}
                            onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                          value={editForm.comment}
                          onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Suggestion</label>
                        <textarea
                          value={editForm.suggestion}
                          onChange={(e) => setEditForm({ ...editForm, suggestion: e.target.value })}
                          rows={3}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(feedback.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{feedback.name}</h3>
                          <p className="text-sm text-gray-600">{feedback.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(feedback)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(feedback.id)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-lg transition text-sm disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Event Name</p>
                          <p className="text-sm font-medium text-gray-900">{feedback.eventName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Division</p>
                          <p className="text-sm font-medium text-gray-900">{feedback.division}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="text-sm font-medium text-gray-900">
                            {feedback.rating} / 5
                            <span className="text-yellow-500 ml-1">
                              {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {feedback.comment && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Comment</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{feedback.comment}</p>
                        </div>
                      )}

                      {feedback.suggestion && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Suggestion</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{feedback.suggestion}</p>
                        </div>
                      )}

                      {feedback.created_at && (
                        <p className="text-xs text-gray-500 mt-3">
                          {new Date(feedback.created_at).toLocaleString()}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PanelPage
