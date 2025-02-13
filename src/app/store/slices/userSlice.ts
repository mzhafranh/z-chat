import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

interface autoLoginParams {
    refreshToken: string | null;
}

interface userLoginParams {
    username: string;
}

interface verifyTokenParams {
    token: string;
}

interface deleteTokenParams {
    token: string | null;
    username: string;
}

interface UserState {
    username: string;
    isAuthenticated: boolean;
    token: string | null;
    error: string | null
}

const initialState: UserState = {
    username: "",
    isAuthenticated: false,
    token: null,
    error: null
};

export const autoLogin = createAsyncThunk(
    'user/autoLogin',
    async ({refreshToken}: autoLoginParams, { dispatch, rejectWithValue }) => {
        try {
            if (!refreshToken) {
                return;
            } else {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return 
                        }
                        return 
                    }
                });

                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    const data = await response.json();
                    dispatch(setError(data.error || "Login failed"));
                    return false;
                }
                const { accessToken, newRefreshToken, user } = await response.json();
                localStorage.setItem("refreshToken", newRefreshToken);
                localStorage.setItem("authToken", accessToken);
                localStorage.setItem("zchatuser", user.username);
                dispatch(setError("")); // Clear any previous errors
                dispatch(login(user.username))
                return true
            }
        } catch (err) {
            dispatch(setError("An error occurred while logging in."));
            console.error(err);
        }
    }
)

export const loginUser = createAsyncThunk(
    'user/userLogin',
    async ({ username }: userLoginParams, { dispatch }) => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const data = await response.json();
                dispatch(setError(data.error || "Login failed"));
                return;
            }

            const data = await response.json();
            localStorage.setItem("authToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("zchatuser", data.user.username);
            dispatch(setError(""));
            dispatch(login(username))
            return data
        } catch (err) {
            dispatch(setError("An error occurred while logging in."));
            console.error(err);
        }
    }
)

export const verifyToken = createAsyncThunk(
    'user/userLogin',
    async ({ token }: verifyTokenParams, { dispatch }) => {
        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}`,"Content-Type": "application/json" },
            });

            if (!response.ok) {
                const data = await response.json();
                dispatch(setError(data.error || "Token Verification Failed"));
                return false;
            } else {
                return true;
            }
        } catch (err) {
            dispatch(setError("An error occurred while logging in."));
            console.error(err);
        }
    }
)

export const deleteToken = createAsyncThunk(
    'user/deleteToken',
    async ({ token, username }: deleteTokenParams, { dispatch }) => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}`,"Content-Type": "application/json" },
                body: JSON.stringify({
                   username
                })
            });

            if (!response.ok) {
                const data = await response.json();
                dispatch(setError(data.error || "Token Verification Failed"));
                return false;
            } else {
                return true;
            }
        } catch (err) {
            dispatch(setError("An error occurred while logging in."));
            console.error(err);
        }
    }
)


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.username = "";
            state.isAuthenticated = false;
        },
        setError: (state, action) => { state.error = action.payload }        
    },
});

export const { login, logout, setError } = userSlice.actions;
export default userSlice.reducer;
