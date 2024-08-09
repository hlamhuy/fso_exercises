import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/userReducer";
import { showNotification } from "../reducers/notificationReducer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser({ username, password }));
      dispatch(showNotification(`Welcome back, ${username}`, 5));
    } catch (error) {
      dispatch(showNotification("Wrong credentials", 5));
    }
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Username:
          <input
            type="text"
            data-testid="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            data-testid="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;
