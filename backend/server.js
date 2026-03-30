const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const POCKETHOST_TOKEN = process.env.POCKETHOST_TOKEN;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  if (token !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  next();
};

// PocketHost API Helper
const POCKETHOST_URL = 'https://app-tracking.pockethost.io/api/collections/notes/records';

const fetchNotesFromPocketHost = async () => {
  try {
    const response = await fetch(
      `${POCKETHOST_URL}?sort=-created&perPage=500`,
      {
        headers: {
          'Authorization': `Bearer ${POCKETHOST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch notes');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching from PocketHost:', error);
    return [];
  }
};

const createNoteInPocketHost = async (title, content) => {
  try {
    const response = await fetch(POCKETHOST_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POCKETHOST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content,
        user_id: 1
      })
    });
    if (!response.ok) throw new Error('Failed to create note');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating note in PocketHost:', error);
    throw error;
  }
};

const deleteNoteFromPocketHost = async (noteId) => {
  try {
    const response = await fetch(`${POCKETHOST_URL}/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${POCKETHOST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return true;
  } catch (error) {
    console.error('Error deleting note from PocketHost:', error);
    throw error;
  }
};

// Routes

// GET /api/notes - Retrieve all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await fetchNotesFromPocketHost();
    // Transform PocketHost data to match our format
    const formattedNotes = notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      created: note.created,
      updated: note.updated
    }));
    return res.status(200).json(formattedNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes - Create a new note (requires authentication)
app.post('/api/notes', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newNote = await createNoteInPocketHost(title, content);
    return res.status(201).json({
      id: newNote.id,
      title: newNote.title,
      content: newNote.content,
      created: newNote.created,
      updated: newNote.updated
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({ error: 'Failed to create note' });
  }
});

// DELETE /api/notes/:id - Delete a note (requires authentication)
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await deleteNoteFromPocketHost(id);
    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(404).json({ error: 'Note not found' });
  }
});

// Health check route (no auth required)
app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SecureNote API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET  /api/notes - Get all notes`);
  console.log(`  POST /api/notes - Create a note (requires Authorization header)`);
  console.log(`  DELETE /api/notes/:id - Delete a note (requires Authorization header)`);
});
