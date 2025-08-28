"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/firebase/firebase.config";
import axios from "axios";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null); // ✅ use Firebase User
  const [loading, setLoading] = useState<boolean>(true);

  const provider = new GoogleAuthProvider();

  const createUser = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData: {
    displayName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser) throw new Error("No authenticated user");
    return updateProfile(auth.currentUser, updatedData);
  };

  const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      await axios.post("/logout");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // ✅ directly store Firebase user

        if (firebaseUser.email) {
          try {
            await axios.post(
              "/jwt",
              { email: firebaseUser.email },
              { withCredentials: true }
            );
          } catch (err) {
            console.error("JWT error:", err);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    logIn,
    logOut,
    createUser,
    updateUser,
    resetPassword,
    logInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
