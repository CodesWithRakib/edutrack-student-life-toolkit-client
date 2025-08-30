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
  sendEmailVerification,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/lib/firebase.config";

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

  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const sendVerificationEmail = (user?: User | null) => {
    const currentUser = user || auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found. Please log in first.");
    }

    return sendEmailVerification(currentUser);
  };

  const logOut = async () => {
    try {
      await signOut(auth);
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
      } else {
        setUser(null); // ✅ Set user to null when not authenticated
      }
      setLoading(false); // ✅ Always set loading to false
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
    signInWithGoogle,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
