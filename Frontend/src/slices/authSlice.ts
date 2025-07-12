import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  token: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  token: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
