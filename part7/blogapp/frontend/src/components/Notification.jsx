import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  if (!notification) return null;

  return <Alert variant="success">{notification}</Alert>;
};

export default Notification;
