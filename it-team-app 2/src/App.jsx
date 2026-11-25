/*
import {createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "./layouts/RootLayout";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const MemberDetails = lazy(() => import("./pages/MemberDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
import ProtectedRoute from "./components/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Loader />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "team",
        element: (
          <Suspense fallback={<Loader />}>
            <Team />
          </Suspense>
        ),
      },
      {
        path: "team/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <MemberDetails />
          </Suspense>
        ),
      },
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        ),
      },
      {
  path: "signup",
  element: (
    <Suspense fallback={<Loader />}>
      <Signup />
    </Suspense>
  ),
},
{
  path: "profile",
  element: (
    <ProtectedRoute>
      <Suspense fallback={<Loader />}>
        <Profile />
      </Suspense>
    </ProtectedRoute>
  ),
},
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
*/

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import RootLayout from "./layouts/RootLayout";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoutes";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const MemberDetails = lazy(() => import("./pages/MemberDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Signup = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));

function withSuspense(Component) {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
}

function withProtection(Component) {
  return (
    <ProtectedRoute>
      {withSuspense(Component)}
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: withSuspense(Home),
      },
      {
        path: "about",
        element: withSuspense(About),
      },
      {
        path: "team",
        element: withProtection(Team),
      },
      {
        path: "team/:id",
        element: withProtection(MemberDetails),
      },
      {
        path: "dashboard",
        element: withProtection(Dashboard),
      },
      {
        path: "login",
        element: withSuspense(Login),
      },
      {
        path: "signup",
        element: withSuspense(Signup),
      },
      {
        path: "profile",
        element: withProtection(Profile),
      },
      {
        path: "*",
        element: withSuspense(NotFound),
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

