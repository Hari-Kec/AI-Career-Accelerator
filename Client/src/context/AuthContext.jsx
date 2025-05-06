import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  // Custom backend authentication
  const register = async (email, password, name, phone,id) => {
    try {
      const response = await axios.post(
        'https://ai-career-accelerator.onrender.com/api/auth/register', 
        { email, password, name, phone ,id}
      );
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://ai-career-accelerator.onrender.com/api/auth/login', 
        { email, password }
      );
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Firebase Google authentication
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;
      
      const response = await axios.post(
        'https://ai-career-accelerator.onrender.com/api/auth/google',
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        }
      );
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      }
      throw new Error('No token received');
    } catch (error) {
      console.error("Google sign-in error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Google sign-in failed');
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase if user logged in with Google
      if (user?.authProvider === 'google') {
        await auth.signOut();
      }
      
      // Clear backend session
      await axios.post(
        'https://ai-career-accelerator.onrender.com/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      // Clear local state
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local auth
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('authToken');
    }
  };

  // Check authentication state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(
            'https://ai-career-accelerator.onrender.com/api/auth/me',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUser(response.data.user);
          setAuthToken(token);
        } catch (error) {
          console.error("Auth check failed:", error);
          logout(); // Force logout if token is invalid
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Handle Firebase auth state if needed
      }
    });

    return () => unsubscribe();
  }, []);

  // Add axios interceptor for token refresh
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // If token expired (401) and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Attempt to refresh token
            const response = await axios.post(
              'https://ai-career-accelerator.onrender.com/api/auth/refresh',
              {},
              { withCredentials: true }
            );
            
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
              setAuthToken(response.data.token);
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      authToken,
      login, 
      register, 
      signInWithGoogle,
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};