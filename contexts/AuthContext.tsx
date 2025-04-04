"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "@/config/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  signOut,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  sendEmailVerification,
  reauthenticateWithCredential,
} from "firebase/auth";
import useAutoLogout from "@/hooks/useAutoLogout";
import useAlert from "@/hooks/alert/useAlert";

type StateType = {
  [key: string]: any;
};

type AuthContextType = {
  state: StateType;
  setState: (newState: StateType) => void;
  currentUser: User | null;
  handleSignIn: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignInWithGoogle: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignUp: ({ email, password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleSignOut: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleResetPassword: ({ setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdatePassword: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleUpdateEmail: ({ email, setIsLoading }: { [key: string]: any }) => Promise<void>;
  handleLinkEmailPasswordAccount: ({
    email,
    password,
    setIsLoading,
  }: {
    [key: string]: any;
  }) => Promise<void>;
  handleReauthenticate: ({ password, setIsLoading }: { [key: string]: any }) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const adminRoutes = ["/admin", "/admin/login", "/admin/register", "/admin/forgot-password"];

export default function AuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [state, setState] = useState<StateType>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { successAlert, errorAlert } = useAlert();

  const handleSignIn = async ({ email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      successAlert("You’ve signed in successfully!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleSignIn= request error");
    }
    setIsLoading(false);
  };

  const handleSignInWithGoogle = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      successAlert("You’ve signed in successfully!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleSignInWithGoogle= request error");
    }
    setIsLoading(false);
  };

  const handleSignUp = async ({ email = "", password = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      handleEmailVerification({ user: res.user });
      successAlert("You’ve signed up successfully!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleSignUp= request error");
    }
    setIsLoading(false);
  };

  const handleSignOut = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // successAlert("You’ve signed out successfully!");
      sessionStorage.setItem("isSignedOut", "true");
      router.push("/admin/login");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleSignOut= request error");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async ({ email = "", setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      successAlert("Password reset link sent! Check your email.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleResetPassword= request error");
    }
    setIsLoading(false);
  };

  const handleUpdateEmail = async ({ email = "", setIsLoading = (_: boolean) => {} }) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await updateEmail(currentUser, email);
      // handleEmailVerification({ user: res.user });
      successAlert("Your email has been updated successfully!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleUpdateEmail= request error");
    }
    setIsLoading(false);
  };

  const handleUpdatePassword = async ({ password = "", setIsLoading = (_: boolean) => {} }) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await updatePassword(currentUser, password);
      successAlert("Your password has been updated successfully!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleUpdatePassword= request error");
    }
    setIsLoading(false);
  };

  const handleLinkEmailPasswordAccount = async ({
    email = "",
    password = "",
    setIsLoading = (_: boolean) => {},
  }) => {
    if (!currentUser) return;
    setIsLoading(true);
    const credential = EmailAuthProvider.credential(email, password);
    try {
      await linkWithCredential(currentUser, credential);
      successAlert("Successfully linked email/password account!");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleLinkEmailPasswordAccount= request error");
    }
    setIsLoading(false);
  };

  const handleEmailVerification = async ({
    user,
    setIsLoading = () => {},
  }: {
    user: User;
    setIsLoading?: (_: boolean) => void;
  }) => {
    setIsLoading(true);
    try {
      await sendEmailVerification(user, {
        url: `${window.location.origin}/dashboard`,
      });
      successAlert("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleEmailVerification= request error");
    }
    setIsLoading(false);
  };

  const handleReauthenticate = async ({ password = "", setIsLoading = (_: boolean) => {} }) => {
    if (!currentUser || !currentUser.email) return;
    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      successAlert("reauthenticated successfully");
      console.log("reauthenticated successfully");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=handleReauthenticate= request error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && adminRoutes.includes(pathname)) {
        router.push("/admin/dashboard");
      } else if (!user) {
        if (pathname === "/admin") {
          router.push("/admin/login");
        } else if (pathname.startsWith("/admin") && !adminRoutes.includes(pathname)) {
          router.push("/admin/login");
        }
      }
    });
    return () => unsubscribe();
  }, [handleSignOut]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  useAutoLogout(30 * 60 * 1000);

  if (!currentUser && pathname.startsWith("/admin") && !adminRoutes.includes(pathname))
    return <LoadingScreen />;

  return (
    <AuthContext.Provider
      value={{
        state,
        ...state,
        setState,
        currentUser,
        handleSignIn,
        handleSignInWithGoogle,
        handleSignUp,
        handleSignOut,
        handleResetPassword,
        handleUpdatePassword,
        handleUpdateEmail,
        handleLinkEmailPasswordAccount,
        handleReauthenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black"></div>
    </div>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
