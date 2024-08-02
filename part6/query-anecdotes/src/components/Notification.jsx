import { NotificationContext } from "../NotificationContext";
import { useContext } from "react";

const Notification = () => {
  const [notification] = useContext(NotificationContext);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display: notification ? "block" : "none",
  };

  return <div style={style}>{notification}</div>;
};

export default Notification;
