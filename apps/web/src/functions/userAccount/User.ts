import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";
interface UserAccount {
  username?: string;
  userLoggedIn: boolean;
  email?: string;
}
interface auth {
  userLoggedIn: boolean;
}

const initialStateOfUserAccount: UserAccount = {
  userLoggedIn: false,
  username: "",
  email: "",
};
export const userAccountSlicer = createSlice({
  name: "UserAccount",
  initialState: initialStateOfUserAccount,
  reducers: {
    addAccount: (state, action: PayloadAction<UserAccount>) => {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.userLoggedIn = action.payload.userLoggedIn;
    },
    removeAccount: (state, action: PayloadAction<UserAccount>) => {
      state.email = "";
      state.username = "";
      state.userLoggedIn = false;
    },
    authenticated: (state, action: PayloadAction<UserAccount>) => {
      state.userLoggedIn = action.payload.userLoggedIn;
    },
  },
});

export const { addAccount, authenticated, removeAccount } =
  userAccountSlicer.actions;

export const userAccountReducer = userAccountSlicer.reducer;
