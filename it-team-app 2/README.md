# IT Team Manager
A React application for managing startup team members. The project uses React Router, Firebase Authentication, a simulated asynchronous API, and TanStack Query for server-state caching.

## Features
### Team Management
- View team members and their details.
- Add, edit, and delete team members.
- Change a member's status.
- Search members by name or description.
- Filter by role and status.
- Sort by name and experience.
- Pagination using URL search parameters.

### Authentication
- Sign up with email and password.
- Confirm password validation.
- Sign in with email and password.
- Sign in with Google.
- Persistent authentication sessions.
- Protected profile page.
- Display authenticated user's email and UID.
- Logout functionality.

### Data Fetching and Caching
- TanStack Query for data fetching and caching.
- Separate query keys for team lists and individual members.
- Automatic cache invalidation after create, update, and delete operations.
- Loading, error, and empty states.
- Retry failed requests.

## Project Setup
### 1. Clone the repository

```bash
git clone <https://github.com/smkvass/jvs-tasks/tree/main/it-team-app%202>
cd it-team-app
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

The `.env.local` file is excluded from Git. The `.env.example` file provides a template.

### 4. Configure Firebase Authentication

In the Firebase Console:

1. Create a Firebase project.
2. Register a Web App.
3. Enable Email/Password authentication.
4. Enable Google authentication.
5. Configure the authorized domains if needed.

### 5. Start the development server

```bash
npm run dev
```

## Caching Strategy

The project uses TanStack Query to manage and cache team data.

Default query settings:

- `staleTime: 60 seconds` — data is considered fresh for one minute.
- `gcTime: 5 minutes` — inactive cached data is kept for five minutes.
- `retry: 1` — failed queries are retried once.

Query keys:

- `["team", queryString]` — team list with search, filters, sorting, and pagination.
- `["team-member", id]` — individual team member.

After creating, updating, or deleting a member, the team queries are invalidated to refresh the relevant data.

After updating an individual member, its cached data is updated using `setQueryData`.

## API Structure

The project uses a simulated asynchronous API service.

The service provides:
- Random request delays.
- Simulated request errors.
- CRUD operations.
- Search, filtering, sorting, and pagination.

Data is stored in localStorage through the service layer. This simulates asynchronous API behavior but is not a real remote backend.

UI components do not access localStorage directly.

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

`ProtectedRoute` restricts access to authenticated users.

## Deployment

Deployment URL: **Add your deployed application URL here.**

## Notes

- Do not commit `.env.local` or other files containing real environment configuration.
- Use `.env.example` as a configuration template.
- Firebase Authentication requires a correctly configured Firebase project.