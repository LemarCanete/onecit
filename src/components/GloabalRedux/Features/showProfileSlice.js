import { createSlice } from '@reduxjs/toolkit'

export const showProfileSlice = createSlice({
    name: 'profile',
    initialState: {
        value: false
    },
    reducers: {
        profileToggle: state => {
            state.value = !state.value;
        }
    }
})

export const {profileToggle} = showProfileSlice.actions
export default showProfileSlice.reducer