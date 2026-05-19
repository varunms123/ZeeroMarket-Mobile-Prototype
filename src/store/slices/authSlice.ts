import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface UserState {
    email: string | null;
    role: 'buyer' | 'supplier' | 'admin' | null;
    isAuthenticated: boolean;
    isLoading: boolean,
}

const initialState: UserState = {
    email: null,
    role: null,
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{email: string; role: 'buyer' | 'supplier' | 'admin' }>) => {
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            state.isLoading = false;

            AsyncStorage.setItem('@user_session', JSON.stringify(action.payload)).catch((err) => 
                console.log('Failed to save session:', err)
            );
            
        },
        logoutSuccess: ( state ) => {
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            AsyncStorage.removeItem('@user_session').catch((err) => 
                console.log('Failed to clear session', err)
            );
        },
    },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export const initializeAuth = () => async (dispatch: AppDispatch) => {
    try{
        const activeSession = await AsyncStorage.getItem('@user_session');

        if(activeSession) {
            const parsedUserData = JSON.parse(activeSession);
            dispatch(loginSuccess(parsedUserData))
        } else {
            dispatch(authSlice.actions.logoutSuccess())
        } 
    } catch (err){
        console.error(err);
        dispatch(authSlice.actions.logoutSuccess());
    }
}

export default authSlice.reducer;