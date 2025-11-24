import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const useFeedback = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getToken = () => {
    return localStorage.getItem('access_token')
  }

  // GET all feedbacks (public)
  const getAllFeedbacks = async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams(params).toString()
      const url = queryParams ? `${API_BASE_URL}/feedback?${queryParams}` : `${API_BASE_URL}/feedback`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch feedbacks')
      }

      const result = await response.json()
      return result.data // Return the data property which contains feedbacks array or object
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // GET single feedback by ID
  const getFeedbackById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch feedback')
      }

      const result = await response.json()
      return result.data // Return the data property
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // POST create new feedback (public)
  const createFeedback = async (feedbackData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create feedback')
      }

      const result = await response.json()
      return result.data // Return the data property
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // PUT update feedback (protected)
  const updateFeedback = async (id, feedbackData) => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update feedback')
      }

      const result = await response.json()
      return result.data // Return the data property
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // DELETE feedback (protected)
  const deleteFeedback = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete feedback')
      }

      const result = await response.json()
      return result.data // Return the data property (or just success message)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getAllFeedbacks,
    getFeedbackById,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  }
}
