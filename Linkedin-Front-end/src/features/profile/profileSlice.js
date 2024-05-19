import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        details: null,
        client: null,
        token: null,
    },
    reducers: {
        setProfile: (state, action) => {
            state.token = action.payload.token;
            state.client = action.payload.client;
            state.details = action.payload.details;
        },
    },
})

export const selectProfile = (state) => state.profile;

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions

export default profileSlice.reducer
