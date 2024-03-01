'use client'
import { createContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase-config";  // Assuming you have a reference to your Firestore database
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If a user is logged in, you can fetch additional data from Firestore or other sources
        const userDocRef = doc(db, "users", user.uid);  // Assuming you have a 'users' collection in Firestore
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setCurrentUser({ ...user, ...userData });
        } else {
          setCurrentUser(user);
        }
      } else {
        // If the user is logged out, you might want to reset the currentUser
        setCurrentUser({});
      }
    });

    return () => {
      unsub();
    };
  }, []);
  console.log(currentUser)


  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
