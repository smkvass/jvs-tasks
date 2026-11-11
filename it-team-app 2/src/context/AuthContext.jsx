import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../api/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signup(email, password) {
    setError("");

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function login(email, password) {
    setError("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function loginWithGoogle() {
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    setError("");

    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
