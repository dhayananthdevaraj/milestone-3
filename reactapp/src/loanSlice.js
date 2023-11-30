// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loanSlice = createSlice({
  name: 'loan',
  initialState: {
  loanType:""

  },
  reducers: {
    setLoanInfo: (state, action) => {
        state.loanType = action.payload.loanType;
       
    },
    clearLoanInfo: (state) => {
        state.loanType = ""
    },
  },
});

export const { setLoanInfo, clearLoanInfo } = loanSlice.actions;
export default loanSlice.reducer;
