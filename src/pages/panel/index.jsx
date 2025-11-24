import { useAuth } from '@/hooks/useAuth'
import { useFeedback } from '@/hooks/useFeedback'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Trash2, Save, X, Star, Search, AlertTriangle, User, Mail, Calendar, Briefcase, MessageSquare, Lightbulb, SquarePen, Settings, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, FileText, ChevronDown, Home, LogOut } from 'lucide-react'

function PanelPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { getAllFeedbacks, updateFeedback, deleteFeedback, loading } = useFeedback()

  const [feedbacks, setFeedbacks] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingFeedback, setEditingFeedback] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    eventName: '',
    division: '',
    rating: '',
    status: '',
    comment: '',
    suggestion: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingFeedback, setDeletingFeedback] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const divisions = ['LnT', 'EEO', 'PR', 'HRD', 'RnD']

  const getStatusBadge = (status) => {
    const statusConfig = {
      'open': {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        label: 'Open'
      },
      'in-review': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        dot: 'bg-yellow-500',
        label: 'In Review'
      },
      'resolved': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        dot: 'bg-green-500',
        label: 'Resolved'
      }
    }

    const config = statusConfig[status] || statusConfig['open']

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
        <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
        <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
      </div>
    )
  }


  // Memoized filter for performance optimization
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const matchesSearch =
        feedback.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feedback.eventName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [feedbacks, searchQuery, filterStatus])

  // Memoized pagination for performance optimization
  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredFeedbacks.slice(startIndex, endIndex)
  }, [filteredFeedbacks, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage)

  const handleRefresh = async () => {
    setIsPageLoading(true)
    try {
      const data = await getAllFeedbacks()
      setFeedbacks(data.feedbacks || data || [])
    } catch (err) {
      alert('Failed to refresh feedbacks')
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const data = await getAllFeedbacks()
        setFeedbacks(data.feedbacks || data || [])
      } catch (err) {
        alert('Failed to load feedbacks')
      } finally {
        setIsPageLoading(false)
      }
    }

    loadData()
  }, [])

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback)
    setEditForm({
      name: feedback.name,
      email: feedback.email,
      eventName: feedback.eventName,
      division: feedback.division,
      rating: feedback.rating?.toString() || '',
      status: feedback.status || 'open',
      comment: feedback.comment || '',
      suggestion: feedback.suggestion || '',
    })
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingFeedback(null)
    setEditForm({
      name: '',
      email: '',
      eventName: '',
      division: '',
      rating: '',
      status: '',
      comment: '',
      suggestion: ''
    })
  }

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        eventName: editForm.eventName,
        division: editForm.division,
        rating: parseInt(editForm.rating),
        status: editForm.status,
        comment: editForm.comment || undefined,
        suggestion: editForm.suggestion || undefined,
      }

      await updateFeedback(editingFeedback.id, payload)
      const data = await getAllFeedbacks()
      setFeedbacks(data.feedbacks || data || [])
      handleCloseModal()
      setSuccessMessage('Feedback updated successfully!')
      setIsSuccessModalOpen(true)
    } catch (err) {
      alert('Failed to update feedback')
    }
  }

  const handleDeleteClick = (feedback) => {
    setDeletingFeedback(feedback)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingFeedback(null)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteFeedback(deletingFeedback.id)
      const data = await getAllFeedbacks()
      setFeedbacks(data.feedbacks || data || [])
      handleCloseDeleteModal()
      setSuccessMessage('Feedback deleted successfully!')
      setIsSuccessModalOpen(true)
    } catch (err) {
      alert('Failed to delete feedback')
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
    setSuccessMessage('')
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Feedback Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">View and manage all feedback submissions</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-sm transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] text-gray-500">Logged in as</p>
                  <p className="text-xs font-semibold text-gray-900 max-w-[120px] truncate">{user?.email || 'User'}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <a
                      href="https://bnccbe.drian.my.id/api-docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-purple-50 transition"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>Docs API</span>
                    </a>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        navigate('/')
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Home className="w-4 h-4 text-gray-600" />
                      <span>Home</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="container mx-auto py-6 sm:py-8 space-y-6 px-2 sm:px-4">

          <div className="bg-card text-card-foreground rounded-xl border-2 py-4">
            <div className="px-4 pt-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="search" className="text-xs font-medium text-gray-700">Search feedback</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      id="search"
                      type="text"
                      placeholder="Search by name, email, event..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-8 w-full rounded-md border px-2.5 py-1 text-xs shadow-xs transition-colors pl-8 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-[2px] focus-visible:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:w-40">
                  <label htmlFor="status" className="text-xs font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="flex h-8 w-full items-center justify-between rounded-md border bg-transparent px-2.5 py-1 text-xs shadow-xs focus:outline-none focus:border-blue-500 focus:ring-[2px] focus:ring-blue-500/20"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-review">In Review</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all h-8 px-3 py-1 border-2 bg-background hover:bg-gray-100 w-full sm:w-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 px-2">
            Showing {paginatedFeedbacks.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0}-{Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length}
          </div>

          <div className="bg-card text-card-foreground rounded-xl border-2 py-4">
            <div className="pt-3 px-0 sm:px-4">
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-xs">
                  <thead className="border-b">
                    <tr className="border-b transition-colors">
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[120px] text-[11px]">Name</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[120px] text-[11px]">Event</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap hidden sm:table-cell text-[11px]">Division</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap hidden md:table-cell text-[11px]">Rating</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap hidden lg:table-cell text-[11px]">Status</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap hidden lg:table-cell text-[11px]">Created</th>
                      <th className="h-8 px-2 text-left align-middle font-medium whitespace-nowrap w-[60px] text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500 text-xs">
                          No feedbacks found
                        </td>
                      </tr>
                    ) : (
                      paginatedFeedbacks.map((feedback) => (
                        <tr key={feedback.id} className="cursor-pointer hover:bg-gray-50 transition-colors border-b">
                          <td className="p-2 align-middle whitespace-nowrap py-3">
                            <div>
                              <div className="font-medium text-xs">{feedback.name}</div>
                              <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{feedback.email}</div>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap font-medium py-3 text-xs">{feedback.eventName}</td>
                          <td className="p-2 align-middle whitespace-nowrap py-3 hidden sm:table-cell text-xs">{feedback.division}</td>
                          <td className="p-2 align-middle whitespace-nowrap py-3 hidden md:table-cell">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-green-600">
                                {Array.from({ length: feedback.rating }, () => '★').join('')}
                                {Array.from({ length: 5 - feedback.rating }, () => '☆').join('')}
                              </span>
                              <span className="text-[10px] text-gray-500 ml-0.5">{feedback.rating}/5</span>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap py-3 hidden lg:table-cell">
                            {getStatusBadge(feedback.status || 'open')}
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-xs text-gray-500 py-3 hidden lg:table-cell">
                            {new Date(feedback.createdAt || feedback.created_at || Date.now()).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(feedback)}
                                className="inline-flex items-center justify-center h-7 w-7 p-0 rounded-md hover:bg-gray-100 transition-all"
                                title="Edit"
                              >
                                <SquarePen className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(feedback)}
                                disabled={loading}
                                className="inline-flex items-center justify-center h-7 w-7 p-0 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-all disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-3 gap-3 px-4">
                <div className="text-xs text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-7 rounded-md gap-1 px-2 border-2 bg-background hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center h-7 rounded-md gap-1 px-2 border-2 bg-background hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex items-center justify-center h-7 rounded-md gap-1 px-2 border-2 bg-background hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="inline-flex items-center justify-center h-7 rounded-md gap-1 px-2 border-2 bg-background hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isDeleteModalOpen && deletingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 modal-backdrop" onClick={handleCloseDeleteModal}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden flex flex-col modal-content-scale">
            <div className="px-6 py-5 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Delete Feedback</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
                </div>
                <button
                  onClick={handleCloseDeleteModal}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-900" />
                    {new Date(deletingFeedback?.createdAt || deletingFeedback?.created_at || Date.now()).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs text-gray-900">
                    ID: {deletingFeedback?.id ? String(deletingFeedback.id).substring(0, 12) : 'N/A'}
                  </span>
                </div>

                <div className="bg-gray-200 h-px w-full"></div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900 font-medium">{deletingFeedback.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{deletingFeedback.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Event</label>
                    <p className="text-sm text-gray-900">{deletingFeedback.eventName}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                  <p className="text-sm text-red-800">
                    This will permanently delete the feedback from the database.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-red-600 text-white hover:bg-red-700 border-2 border-red-600 hover:border-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-white" />
                    Delete Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 modal-backdrop" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col modal-content">
            <div className="px-6 py-5 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <SquarePen className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Edit Feedback</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Edit feedback information and status</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 overflow-y-auto min-h-0">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-900" />
                    {new Date(editingFeedback?.createdAt || editingFeedback?.created_at || Date.now()).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs text-gray-900">
                    ID: {editingFeedback?.id ? String(editingFeedback.id).substring(0, 12) : 'N/A'}
                  </span>
                </div>

                <div className="bg-gray-200 h-px w-full"></div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-900" />
                        Name
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        name="name"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-900" />
                        Email
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        name="email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Event Name</label>
                      <input
                        className="flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                        value={editForm.eventName}
                        onChange={(e) => setEditForm({ ...editForm, eventName: e.target.value })}
                        name="eventName"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-900" />
                        Division
                      </label>
                      <select
                        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/20"
                        value={editForm.division}
                        onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                      >
                        <option value="">Select division</option>
                        {divisions.map((div) => {
                          const divisionNames = {
                            'LnT': 'Learning & Training',
                            'EEO': 'External Events & Operations',
                            'PR': 'Public Relations',
                            'HRD': 'Human Resource Development',
                            'RnD': 'Research & Development'
                          }
                          return <option key={div} value={div}>{divisionNames[div] || div}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Star className="w-4 h-4 text-gray-900" />
                        Rating
                      </label>
                      <select
                        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/20"
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                      >
                        <option value="">Select rating</option>
                        <option value="1">★☆☆☆☆ (1/5)</option>
                        <option value="2">★★☆☆☆ (2/5)</option>
                        <option value="3">★★★☆☆ (3/5)</option>
                        <option value="4">★★★★☆ (4/5)</option>
                        <option value="5">★★★★★ (5/5)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-900">Status</label>
                      <select
                        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/20"
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option value="open">Open</option>
                        <option value="in-review">In Review</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-900" />
                      Comment
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 resize-none"
                      name="comment"
                      rows="3"
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gray-900" />
                      Suggestion
                    </label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 resize-none"
                      name="suggestion"
                      rows="3"
                      value={editForm.suggestion}
                      onChange={(e) => setEditForm({ ...editForm, suggestion: e.target.value })}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 flex-1 bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 text-white" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 border-2 bg-white border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 modal-backdrop" onClick={handleCloseSuccessModal}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden flex flex-col modal-content-scale">
            <div className="px-6 py-5 border-b flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Success</h2>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Operation completed successfully</p>
                </div>
                <button
                  onClick={handleCloseSuccessModal}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-sm text-green-800 text-center font-medium">
                  {successMessage}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 hover:border-green-700"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PanelPage
