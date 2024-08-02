/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NOTIFY":
      return action.payload;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  const [notification, notiDispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[notification, notiDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};
export { NotificationContext };
export default NotificationContext;
