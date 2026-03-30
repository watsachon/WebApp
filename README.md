# SecureNote - A Full-Stack Secure Note Taking Application

A lightweight, secure internal tool for creating, viewing, and deleting text notes. Built with Node.js backend and React frontend, featuring secure communication and data persistence.

## Features

- ✅ **Create Notes**: Add new notes with title and content
- ✅ **View Notes**: Display all notes with proper formatting
- ✅ **Delete Notes**: Remove notes with confirmation
- ✅ **Authentication**: Secure token-based authorization
- ✅ **Data Persistence**: Notes persist via PocketHost API
- ✅ **Loading States**: UI feedback during async operations
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Modern Stack**: React 18 + Tailwind CSS + Express.js

## Technology Stack

### Backend
- **Framework**: Express.js
- **Runtime**: Node.js
- **Data Persistence**: PocketHost API
- **Authentication**: Bearer token (Authorization header)

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **HTTP Client**: Fetch API

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git (for version control)

### Step 1: Clone or Download the Project
```bash
cd c:\Parn
```

### Step 2: Setup Backend

```bash
cd backend
npm install
```

**Verify `.env` file exists with:**
```
PORT=3000
SECRET_TOKEN=20260301eink
POCKETHOST_TOKEN=20260301eink
```

### Step 3: Setup Frontend

```bash
cd ../frontend
npm install
```

**Verify `.env` file exists with:**
```
VITE_API_URL=http://localhost:3000
VITE_API_TOKEN=20260301eink
```

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```

Expected output:
```
SecureNote API running on http://localhost:3000
Endpoints:
  GET  /api/notes - Get all notes
  POST /api/notes - Create a note (requires Authorization header)
  DELETE /api/notes/:id - Delete a note (requires Authorization header)
```

### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```

Browser will automatically open at `http://localhost:5173`

## API Endpoints

### GET /api/notes
- **Description**: Retrieve all notes
- **Authentication**: None required
- **Status Code**: `200 OK`
- **Response**: 
```json
[
  {
    "id": "abc123",
    "title": "My Note",
    "content": "Note content",
    "created": "2025-03-31T10:00:00Z",
    "updated": "2025-03-31T10:00:00Z"
  }
]
```

### POST /api/notes
- **Description**: Create a new note
- **Authentication**: `Authorization: Bearer 20260301eink` (required)
- **Request Body**:
```json
{
  "title": "Note Title",
  "content": "Note content here"
}
```
- **Status Codes**: 
  - `201 Created` - Success
  - `401 Unauthorized` - Invalid/missing token
  - `400 Bad Request` - Missing title or content
- **Response**:
```json
{
  "id": "abc123",
  "title": "Note Title",
  "content": "Note content here",
  "created": "2025-03-31T10:00:00Z"
}
```

### DELETE /api/notes/:id
- **Description**: Delete a specific note
- **Authentication**: `Authorization: Bearer 20260301eink` (required)
- **Status Codes**:
  - `200 OK` - Successfully deleted
  - `401 Unauthorized` - Invalid/missing token
  - `404 Not Found` - Note not found
- **Response**:
```json
{
  "message": "Note deleted successfully"
}
```

## Testing with API Tools

### Using Thunder Client / Postman / Bruno

**Create a Note:**
```
Method: POST
URL: http://localhost:3000/api/notes
Headers:
  - Authorization: Bearer 20260301eink
  - Content-Type: application/json
Body:
{
  "title": "Big Match",
  "content": "Thai v.s. Turk"
}
```

**Get All Notes:**
```
Method: GET
URL: http://localhost:3000/api/notes
```

**Delete a Note:**
```
Method: DELETE
URL: http://localhost:3000/api/notes/abc123
Headers:
  - Authorization: Bearer 20260301eink
```

## Project Structure

```
/secure-note-app
│
├── backend/
│   ├── server.js              (Main Express server)
│   ├── package.json           (Backend dependencies)
│   ├── .env                   (Environment variables - DO NOT COMMIT)
│   ├── .gitignore            (Git exclusions)
│   └── node_modules/         (Installed packages)
│
├── frontend/
│   ├── index.html            (HTML entry point)
│   ├── vite.config.js        (Vite configuration)
│   ├── tailwind.config.js    (Tailwind CSS config)
│   ├── postcss.config.js     (PostCSS config)
│   ├── package.json          (Frontend dependencies)
│   ├── .env                  (Environment variables - DO NOT COMMIT)
│   ├── .gitignore           (Git exclusions)
│   ├── src/
│   │   ├── main.jsx         (React entry point)
│   │   ├── App.jsx          (Main React component)
│   │   └── index.css        (Tailwind + custom styles)
│   └── node_modules/        (Installed packages)
│
├── REPORT.md                (Conceptual report - REQUIRED)
└── README.md                (This file)
```

## Key Features Explained

### 1. Authentication & Security
- Authorization header with bearer token
- Token validated on server before processing requests
- Sensitive token stored in backend `.env` only
- `.env` file excluded from Git to prevent secret exposure

### 2. Data Persistence
- All notes are saved to PocketHost API cloud database
- Notes survive application restarts
- Remote storage ensures data reliability

### 3. Dynamic UI with React
- Real-time note updates without page reload
- Automatic state management with hooks
- Loading states for better UX
- Error messages for failed operations

### 4. Responsive Design
- Mobile-friendly layout with Tailwind CSS
- Works on phones, tablets, and desktops
- Touch-friendly interface

## Common Issues & Solutions

### Issue: "ECONNREFUSED" error on frontend
**Solution**: Make sure backend is running on port 3000
```bash
cd backend
npm start
```

### Issue: "Unauthorized" error when creating notes
**Solution**: Verify `.env` files have correct tokens
- Backend `.env`: `SECRET_TOKEN=20260301eink`
- Frontend `.env`: `VITE_API_TOKEN=20260301eink`

### Issue: CORS errors
**Solution**: Already handled! CORS is enabled in Express:
```javascript
app.use(cors())
```

### Issue: Notes not persisting after restart
**Solution**: Application uses PocketHost API which stores data remotely

## Scoring Rubric (100 Points)

| Category | Criteria | Points |
|----------|----------|--------|
| **Backend Functionality** | Node.js server runs, API endpoints work, CRUD operations functional | 25 |
| **Security & Config** | .env used correctly, Auth header implemented, .env excluded from Git | 20 |
| **Frontend Implementation** | Responsive UI, Fetch API used correctly, DOM/State updates dynamically | 25 |
| **HTTP Protocol** | Correct HTTP verbs (GET, POST, DELETE), Proper status codes (200, 201, 401, 404) | 15 |
| **Conceptual Report** | Clear explanation of JS Engine/Runtime, DOM, HTTP/HTTPS, Environment Variables | 15 |
| **Code Quality** | Clean code, comments, proper folder structure, README instructions | 10 |

### Bonus Points (Optional)

| Bonus | Criteria | Points |
|-------|----------|--------|
| **Loading State** | UI shows loading spinner during async operations | +5 |
| **Data Persistence** | PocketHost API integration for note storage | +15 |

## Environment Variables

### Backend (.env)
```
PORT=3000                              # Server port
SECRET_TOKEN=20260301eink             # API authentication token
POCKETHOST_TOKEN=20260301eink        # PocketHost API token
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000   # Backend URL
VITE_API_TOKEN=20260301eink          # Token to send with requests
```

⚠️ **Important**: 
- DO NOT commit `.env` files to Git
- DO NOT expose tokens in frontend code
- USE `.env.example` for documenting expected variables

## Deployment (Bonus)

For +10 bonus points, deploy with HTTPS:

### Deploy Backend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from backend folder
cd backend
vercel
```

### Deploy Frontend (Netlify)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy from frontend folder
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

Update `VITE_API_URL` in frontend `.env` to deployed backend URL

## License

This project is for educational purposes as part of a Web Development course assignment.

## Support

For questions or issues, check the REPORT.md file for detailed technical explanations.
"# WebApp" 
