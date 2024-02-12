'use client'
import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./Features/darkModeSlice";
import showProfileReducer from "./Features/showProfileSlice";

export default configureStore({
    reducer: {
        darkMode: darkModeReducer,
        profile: showProfileReducer,
    }
  })