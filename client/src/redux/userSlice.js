import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: null,
        role: null,
        token: null,
        isAuthenticated: false,
        tokenExpired: false,
    },
    reducers: {
        loginUser: (state, action) => {
            let {username, role, token} = action.payload
            state.username = username
            state.token = token
            state.role = role
            state.isAuthenticated = true
            state.tokenExpired = false
        },
        logoutUser: (state) => {
            state.username = null
            state.token = null
            state.role = null
            state.isAuthenticated = false
            state.tokenExpired = false
        },
        expireToken: (state) => {
            state.username = null
            state.token = null
            state.role = null
            state.isAuthenticated = false
            state.tokenExpired = true
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginUser, logoutUser, expireToken } = userSlice.actions

export default userSlice.reducer