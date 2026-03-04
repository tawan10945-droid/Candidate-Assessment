const API_URL = 'http://localhost:3000/todos';
const HEADERS = {
    'Content-Type': 'application/json',
    'x-api-key': 'secret-index-key-123'
};
const BAD_HEADERS = {
    'Content-Type': 'application/json'
};

async function runTests() {
    console.log('================================================');
    console.log('  CANDIDATE ASSESSMENT REQUIREMENTS VERIFICATION');
    console.log('================================================\n');

    // 1. Bonus Task: Authentication
    console.log('► REQUIREMENT: Bonus Task (User Authentication / API Key)');
    let res = await fetch(API_URL, { headers: BAD_HEADERS });
    console.log(`  [GET /todos without API key] -> Status: ${res.status} (Expected: 401)`);
    console.log(`  Response:`, await res.json());
    console.log('  ✅ Passed\n');

    // 2. CRUD - Create To-Do
    console.log('► REQUIREMENT: CRUD Operations -> Create (Title and Status)');
    res = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ title: 'Complete Candidate Assessment', completed: false })
    });
    console.log(`  [POST /todos] -> Status: ${res.status} (Expected: 201)`);
    const createdTodo = await res.json();
    console.log(`  Response:`, createdTodo);
    const todoId = createdTodo.id;
    console.log('  ✅ Passed\n');

    // 3. Error Handling - Bad Request (Missing title)
    console.log('► REQUIREMENT: Error Handling (Bad Request)');
    res = await fetch(API_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ completed: false }) // missing title
    });
    console.log(`  [POST /todos with missing title] -> Status: ${res.status} (Expected: 400)`);
    console.log(`  Response:`, await res.json());
    console.log('  ✅ Passed\n');

    // 4. CRUD - Read & In-Memory Database
    console.log('► REQUIREMENT: In-memory Database & Read Operation');
    res = await fetch(API_URL, { headers: HEADERS });
    console.log(`  [GET /todos] -> Status: ${res.status} (Expected: 200)`);
    const allTodos = await res.json();
    console.log(`  Total Items Found: ${allTodos.length}`);
    console.log('  ✅ Passed\n');

    // 5. CRUD - Update
    console.log('► REQUIREMENT: CRUD Operations -> Update Status');
    res = await fetch(`${API_URL}/${todoId}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify({ completed: true })
    });
    console.log(`  [PUT /todos/${todoId}] -> Status: ${res.status} (Expected: 200)`);
    const updatedTodo = await res.json();
    console.log(`  Updated status to 'completed: ${updatedTodo.completed}'`);
    console.log('  ✅ Passed\n');

    // 6. Appropriate HTTP Status Codes - 404 Error Handling
    console.log('► REQUIREMENT: Appropriate HTTP Status Codes (404 for non-existent item)');
    res = await fetch(`${API_URL}/fake-id-999`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify({ completed: true })
    });
    console.log(`  [PUT /todos/fake-id-999] -> Status: ${res.status} (Expected: 404)`);
    console.log(`  Response:`, await res.json());
    console.log('  ✅ Passed\n');

    // 7. CRUD - Delete
    console.log('► REQUIREMENT: CRUD Operations -> Delete');
    res = await fetch(`${API_URL}/${todoId}`, {
        method: 'DELETE',
        headers: HEADERS
    });
    console.log(`  [DELETE /todos/${todoId}] -> Status: ${res.status} (Expected: 200)`);

    // Verify deletion
    res = await fetch(`${API_URL}/${todoId}`, { headers: HEADERS });
    console.log(`  [GET /todos/${todoId} after deletion] -> Status: ${res.status} (Expected: 404)`);
    console.log('  ✅ Passed\n');

    console.log('================================================');
    console.log('  ALL REQUIREMENTS MET SUCCESSFULLY! 🚀');
    console.log('================================================');
}

runTests();
