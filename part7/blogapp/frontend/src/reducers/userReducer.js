import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import storage from "../services/storage";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      storage.saveUser(user);
      dispatch(setUser(user));
    } catch (error) {
      throw error;
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    storage.removeUser();
    dispatch(clearUser());
  };
};

export const loadUserFromStorage = () => {
  return (dispatch) => {
    const user = storage.loadUser();
    if (user) {
      dispatch(setUser(user));
    }
  };
};

export default userSlice.reducer;
