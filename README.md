# To-Do API

A simple RESTful API for managing to-do items, developed for the Candidate Assessment.

## Features

- **CRUD Operations:** Create, Read, Update, Delete to-do items.
- **In-Memory Store:** Data is stored temporarily using a simple array for fast and simple testing.
- **RESTful Endpoints:** Standard path definitions with correct HTTP status codes (200, 201, 400, 404, 500).
- **Error Handling:** Centralized middleware for dealing with server errors robustly.
- **Authorization (Bonus):** Simple API Key validation to access the `/todos` endpoints.

## Prerequisites

- Node.js installed

## Quick Start

1. Install dependencies (if any, e.g. express):
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. The server runs on `http://localhost:3000`. 
   *Note: All `/todos` routes require the `x-api-key: secret-index-key-123` header.*

## API Endpoints

### 1. Base Health Check
- `GET /`
- Returns a welcome message. No API key required.

### 2. Get All To-Dos
- `GET /todos`
- **Headers:** `x-api-key: secret-index-key-123`
- **Returns:** `200 OK` with an array of to-do items.

### 3. Get To-Do By ID
- `GET /todos/:id`
- **Headers:** `x-api-key: secret-index-key-123`
- **Returns:** `200 OK` (todo item) or `404 Not Found` if missing.

### 4. Create To-Do
- `POST /todos`
- **Headers:** `x-api-key: secret-index-key-123`, `Content-Type: application/json`
- **Body:** `{"title": "My new task", "completed": false}`
- **Returns:** `201 Created` on success, `400 Bad Request` if invalid.

### 5. Update To-Do
- `PUT /todos/:id`
- **Headers:** `x-api-key: secret-index-key-123`, `Content-Type: application/json`
- **Body (Partial allowed):** `{"completed": true}`
- **Returns:** `200 OK` on success, `404 Not Found` or `400 Bad Request`.

### 6. Delete To-Do
- `DELETE /todos/:id`
- **Headers:** `x-api-key: secret-index-key-123`
- **Returns:** `200 OK` on success, `404 Not Found`.

## Example Testing With Flow
```bash
# 1. Create a To-Do
curl -X POST http://localhost:3000/todos \
  -H 'x-api-key: secret-index-key-123' \
  -H 'Content-Type: application/json' \
  -d '{"title": "Buy milk"}'

# 2. Get All To-Dos
curl http://localhost:3000/todos \
  -H 'x-api-key: secret-index-key-123'
```
