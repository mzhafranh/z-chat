import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface userLoginParams {
    username: string;
}

interface UserState {
    username: string | null;
    isAuthenticated: boolean;
    error: string | null
}

const initialState: UserState = {
    username: null,
    isAuthenticated: false,
    error: null
};

export const loginUser = createAsyncThunk(
    'user/userLogin',
    async ({ username }: userLoginParams, { dispatch }) => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const data = await response.json();
                dispatch(setError(data.error || "Login failed"));
                return;
            }

            const { token } = await response.json();
            localStorage.setItem("authToken", token);
            dispatch(setError("")); // Clear any previous errors
            dispatch(login(username))
            window.location.href = '/chat';
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
        setError: (state, action) => {state.error = action.payload}
    },
});

export const { login, logout, setError } = userSlice.actions;
export default userSlice.reducer;
