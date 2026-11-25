# IT Team Manager

A React application for managing startup team members. The project uses **React, Redux Toolkit, React Router, Firebase Authentication, and Progressive Web App (PWA) technologies**.

## Features

### Team Management
- View team members and their details.
- Add, edit, and delete team members.
- Change a member's status.
- Search members by name, last name, and description.
- Filter members by role and status.
- Sort by name and experience.
- Pagination using URL search parameters.
- Debounced search to reduce unnecessary requests.

### Authentication
- Sign up with email and password.
- Confirm password validation.
- Sign in with email and password.
- Sign in with Google.
- Persistent authentication sessions.
- Protected routes for authenticated users.
- Display authenticated user's email and UID.
- Logout functionality.

### Dashboard
- View team statistics.
- Filter members by status.
- Calculate average experience.
- Group members by role.
- Use reusable memoized selectors for derived data.

## Redux Toolkit Architecture

Redux Toolkit is used for centralized application state management.

The Redux store is configured using `configureStore` and provided to the application through React Redux's `Provider`.

### Redux Slices

The application contains three feature-based slices:

- **teamSlice** — manages the team list, pagination data, loading states, errors, and CRUD operations.
- **memberSlice** — manages the selected team member, member details loading, and update states.
- **dashboardSlice** — manages dashboard data, loading states, errors, and dashboard filters.

### Async Thunks

Asynchronous operations are implemented using `createAsyncThunk`.

Main operations include:

- `fetchTeam` — fetches the team list with search, filters, sorting, and pagination.
- `fetchMember` — fetches details of an individual team member.
- `fetchDashboard` — fetches data used for dashboard statistics.
- `addTeamMember` — creates a new team member.
- `editTeamMember` — updates an existing team member.
- `removeTeamMember` — deletes a team member.

Each asynchronous operation handles `pending`, `fulfilled`, and `rejected` states through `extraReducers`.

The application also handles loading indicators, errors, empty results, retry actions, and stale requests using request ID checks.

After successful mutations, affected data is refreshed to keep the team list and dashboard up to date.

### Selectors

Reusable selectors are used to access and derive Redux state.

The dashboard includes memoized selectors created with `createSelector`:

- `selectFilteredItems` — filters team members by status.
- `selectDashboardStats` — calculates dashboard statistics.
- `selectMembersByRole` — groups team members by role.

Memoization helps avoid unnecessary recalculations when the input state has not changed.

## State Management Structure

- Redux Toolkit manages shared application data.
- Local React state manages temporary UI state, such as form inputs and modal visibility.
- Firebase Authentication is managed separately through `AuthContext`.

Redux logic, API services, custom Redux hooks, and UI components are separated into different folders.

## API Structure

The project uses a simulated asynchronous API service.

The service provides:
- Random request delays.
- Simulated request errors.
- CRUD operations.
- Search, filtering, sorting, and pagination.
- Local data storage using `localStorage`.
- Cached data for offline access.

This simulates asynchronous API behavior but does not use a real remote team database.

UI components do not access `localStorage` directly.

## Authentication Structure

Firebase Authentication is managed through `AuthContext`.

The context provides:
- `signup()`
- `login()`
- `loginWithGoogle()`
- `logout()`
- `user`
- `loading`
- `error`

`ProtectedRoute` restricts access to protected application pages for unauthenticated users.

## Progressive Web App (PWA)

The application supports Progressive Web App functionality.

### PWA Features
- Web App Manifest.
- Installable application.
- Custom application icons.
- Service Worker registration.
- Application shell caching.
- Static asset caching.
- Offline fallback page.
- Cached team data for offline access.
- Network status indicator.

The Service Worker uses caching strategies to help the application remain available when the internet connection is unavailable.

The offline page (`offline.html`) is used as a fallback when the requested page cannot be loaded from the network or available cache.

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/smkvass/jvs-tasks.git
cd "it-team-app 2"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Use your own Firebase project values.

The `.env.local` file must be excluded from Git. The `.env.example` file provides a configuration template.

### 4. Configure Firebase Authentication

In the Firebase Console:

1. Create a Firebase project.
2. Register a Web App.
3. Enable Email/Password authentication.
4. Enable Google authentication.
5. Configure authorized domains if needed.

### 5. Start the development server

```bash
npm run dev
```

### 6. Build the application

```bash
npm run build
```

### 7. Preview the production build

```bash
npm run preview
```

## Deployment

Deployment URL: ****

GitHub Repository: https://github.com/smkvass/jvs-tasks

## Technologies Used

- React
- Redux Toolkit
- React Redux
- React Router
- Firebase Authentication
- Vite
- JavaScript
- CSS
- Progressive Web App (PWA)
- Service Workers
- LocalStorage

## Notes

- Do not commit `.env.local` or files containing real Firebase credentials.
- Use `.env.example` as a configuration template.
- Firebase Authentication requires a correctly configured Firebase project.
- Team data is stored locally and is not synchronized through a remote database.
