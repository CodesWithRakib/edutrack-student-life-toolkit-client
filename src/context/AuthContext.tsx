import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User, UserCredential } from "firebase/auth";
export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  updateUser: (updatedData: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  logIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  sendVerificationEmail: (user?: User | null) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
