import React from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase-config";

const searchUserInput = async (search) => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const filteredUsers = [];

    usersSnapshot.forEach((doc) => {
        const user = doc.data();
        if (
            user.firstname.toLowerCase().includes(search.toLowerCase()) ||
            user.lastname.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.schoolid.toLowerCase().includes(search.toLowerCase())
        ) {
            filteredUsers.push(user);
        }
    });

    return filteredUsers;
};

export default searchUserInput;
