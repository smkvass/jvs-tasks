import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import UpdateNotification from "./components/UpdateNotification";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <UpdateNotification />
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);


if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then(registration => {
        console.log("SW registered:", registration.scope);
      })
      .catch(error => {
        console.error("SW registration error:", error);
      });
  });
}


