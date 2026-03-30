import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_TOKEN = import.meta.env.VITE_API_TOKEN || '20260301eink'

export default function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/notes`)
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }
      const data = await response.json()
      setNotes(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(`Failed to load notes: ${err.message}`)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Create a new note with authentication
  const handleCreateNote = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      })

      if (response.status === 401) {
        throw new Error('Unauthorized - Invalid or missing token')
      } else if (response.status === 201 || response.status === 200) {
        const newNote = await response.json()
        setNotes([newNote, ...notes])
        setTitle('')
        setContent('')
        setSuccess('Note created successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        throw new Error(`HTTP Error: ${response.status}`)
      }
    } catch (err) {
      setError(`Failed to create note: ${err.message}`)
      console.error('Create error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Delete a note with authentication
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 401) {
        throw new Error('Unauthorized - Invalid or missing token')
      } else if (response.status === 200) {
        setNotes(notes.filter(note => note.id !== noteId))
        setSuccess('Note deleted successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        throw new Error(`HTTP Error: ${response.status}`)
      }
    } catch (err) {
      setError(`Failed to delete note: ${err.message}`)
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">✨ UrNote</h1>
          <p className="text-purple-600 font-semibold">Your Mind..</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-gradient-to-r from-rose-100 to-pink-100 border-2 border-rose-300 text-rose-700 rounded-xl font-medium">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-gradient-to-r from-lime-100 to-emerald-100 border-2 border-lime-300 text-emerald-700 rounded-xl font-medium">
            {success}
          </div>
        )}

        {/* Create Note Form */}
        <div className="card mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">🎨 Create New Note</h2>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-purple-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-purple-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                placeholder="Enter note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field h-32 resize-none"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full fontSize font-bold py-3 rounded-xl ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Note'
              )}
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-6">
            📝 Your Notes {notes.length > 0 && `(${notes.length})`}
          </h2>

          {loading && notes.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 text-pink-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-purple-600 font-semibold">Loading your notes...</p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 card">
              <p className="text-purple-500 text-lg font-medium">💭 No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="card-hover">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 break-words">
                    {note.title}
                  </h3>
                  <p className="text-purple-700 mb-4 break-words whitespace-pre-wrap max-h-24 overflow-y-auto">
                    {note.content}
                  </p>
                  <p className="text-xs text-purple-400 mb-4">
                    {formatDate(note.created)}
                  </p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={loading}
                    className={`btn-danger w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Delete Note
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-purple-500 text-sm font-medium">
          <p>💜 API running on {API_URL}</p>
        </div>
      </div>
    </div>
  )
}
