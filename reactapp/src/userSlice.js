// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId:'',
    userName: '',
    role: '',
    isAuthenticated: false,

  },
  reducers: {
    setUserInfo: (state, action) => {
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearUserInfo: (state) => {
        state.userId = "";
        state.userName = "";
        state.role = "";
        state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
