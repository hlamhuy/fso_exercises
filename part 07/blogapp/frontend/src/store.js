// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blog: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
});
