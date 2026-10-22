# IT Team Manager

React + Vite app on top of the fake async API (Promises, random delays, random errors, localStorage).

- `useEffect` loads the list and the selected item's details (with cleanup, no race conditions)
- Create / Edit / Remove, "Start / Complete task" action, Reload button, search
- loading / error / empty / success states
- only `useState` and `useEffect`, no custom hooks, no debounce, no fetching libraries
- components never touch `localStorage` (only `src/api/fakeApi.js` does)

Run: `npm install && npm run dev`. Deploy: push to `main` (GitHub Pages workflow included; set Settings → Pages → Source: GitHub Actions).
To reset data: delete the `fake-init-data` key in localStorage.
