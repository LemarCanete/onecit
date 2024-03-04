'use client'
import { auth } from "@/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useReducer, useState } from "react";
import { useCookies } from "react-cookie";

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
    const [cookies] = useCookies(['id']);
    const userId = cookies['id'];

    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    }

    const chatReducer = (state, action) =>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId: userId > action.payload.uid ? userId + action.payload.uid : action.payload.uid + userId
                }

            default: 
                return state;
        }
    }

    const [state,  dispatch] = useReducer(chatReducer, INITIAL_STATE)

    return(
        <ChatContext.Provider value={{data: state, dispatch}}>
            {children}
        </ChatContext.Provider>
    )
}