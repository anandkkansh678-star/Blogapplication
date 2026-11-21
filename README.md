# InkWell Blog Application

A responsive college mini-project made with **HTML, CSS and vanilla JavaScript**.

## Run in VS Code
1. Extract `inkwell_blog_app.zip`.
2. Open the `inkwell_blog_app` folder in VS Code.
3. Open `index.html` in a browser, or use the **Live Server** extension and click **Go Live**.

## Features
- Editorial-style responsive blog homepage
- Dummy posts loaded asynchronously through a mock API layer
- Search by title, excerpt or author
- Category filters: Technology, Lifestyle, Creativity
- Publish a new post (added to the in-memory mock data)
- Like button, newsletter demo, dark mode and mobile navigation
- Loading / API connection status

## How the backend is simulated
In `script.js`, the `API` object has asynchronous methods:
- `getPosts()` — simulates `GET /api/posts`
- `createPost(post)` — simulates `POST /api/posts`
- `subscribe(email)` — simulates a newsletter API request

Each method waits before returning data, so the UI behaves like it is fetching from a backend. The dummy data is stored in the `mockPosts` array. **This is a frontend simulation, not a real server or database.** New posts remain in memory and reset when the page is refreshed.

## Suggested project explanation for viva
"The frontend is developed using HTML5, CSS3 and JavaScript. JavaScript uses an asynchronous mock API service to imitate backend GET and POST requests. The application fetches dummy blog records, displays them dynamically, and supports searching, category filtering, and creating posts. In a future version, the mock API can be replaced with a Node.js/Express REST API and MongoDB database."
