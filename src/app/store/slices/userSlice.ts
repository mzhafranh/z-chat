import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import jwt from 'jsonwebtoken';

interface userLoginParams {
    username: string;
}

interface UserState {
    username: string | null;
    isAuthenticated: boolean;
    token: string | null;
    error: string | null
}

const initialState: UserState = {
    username: null,
    isAuthenticated: false,
    token: null,
    error: null
};

export const autoLogin = createAsyncThunk(
    'user/autoLogin',
    async ({ }, { dispatch }) => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            console.log(refreshToken)
            if (!refreshToken) {
                console.log("Auto Login: No Refresh Token Detected")
                return;
            } else {
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            console.log('Token expired');
                            return 
                        }
                        console.log('Invalid token');
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
                    return;
                }

                const { accessToken, user } = await response.json();
                localStorage.setItem("authToken", accessToken);
                dispatch(setError("")); // Clear any previous errors
                dispatch(login(user.username))
                
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

            const { refreshToken, accessToken } = await response.json();
            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken)
            console.log('sampai sebelum set error')
            dispatch(setError("")); // Clear any previous errors
            dispatch(login(username))
            
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
        login: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.username = null;
            state.isAuthenticated = false;
        },
        setError: (state, action) => { state.error = action.payload }
    },
});

export const { login, logout, setError } = userSlice.actions;
export default userSlice.reducer;
