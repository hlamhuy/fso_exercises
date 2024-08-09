import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/userReducer";
import { showNotification } from "../reducers/notificationReducer";

const Menu = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showNotification(`Bye, ${user.name}!`, 5));
  };

  const style = {
    paddingRight: 5,
  };
  const containerStyle = {
    backgroundColor: "#fff000",
    padding: "10px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
  };
  return (
    <div style={containerStyle}>
      <Link to="/" style={style}>
        Blogs
      </Link>
      <Link to="/users" style={style}>
        Users
      </Link>
      {user && (
        <>
          <div>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Menu;
