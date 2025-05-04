import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom backend authentication
  const register = async (email, password, name, phone) => {
    try {
      const response = await axios.post('/api/auth/register', { 
        email, 
        password, 
        name, 
        phone 
      });
      setUser(response.data.user); // Make sure backend returns user data
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setUser(response.data.user); // Make sure backend returns user data
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  // Firebase Google authentication
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;
      
      // Send Firebase user data to your backend
      const response = await axios.post('/api/auth/google', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      });
      
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase if user logged in with Google
      if (user?.authProvider === 'google') {
        await auth.signOut();
      }
      
      // Clear your backend session
      await axios.post('/api/auth/logout');
      
      setUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in via Firebase
        // You might want to sync with your backend here
      }
    });

    // Check your custom backend authentication
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
        .then(response => setUser(response.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      register, 
      signInWithGoogle,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};