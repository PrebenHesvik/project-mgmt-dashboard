import { useNavigate } from "react-router";
import { fetchToken, setToken } from "../utils/Auth";
import { useState, useContext } from "react";
import axios from "axios";
import qs from "qs";
import { CurrentUserContext } from "../context/UserContext";

export default function Login() {
  const { setCurrentEmployeeId, setCurrentEmployee, setCurrentEmployeeRegion } =
    useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    const params = qs.stringify({
      username: username,
      password: password,
    });

    const headers = {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        params,
        headers
      );
      if (response.data.access_token) {
        setToken(response.data.access_token);
        setCurrentEmployeeId(response.data.employee.employee_id);
        setCurrentEmployee(response.data.employee.name);
        setCurrentEmployeeRegion(response.data.employee.region_name);
        navigate("/inspections");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div id="login-form-container">
      <div>
        {fetchToken() !== null ? (
          <p>you are logged in</p>
        ) : (
          <div>
            <form id="login-form">
              <h1 className="login-title">Velkommen</h1>
              <div className="login-form-control">
                <label style={{ marginRight: 10 }}>Input Username</label>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="login-form-control">
                <label style={{ marginRight: 10 }}>Input Password</label>
                <input
                  type="text"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button id="login-btn" type="button" onClick={submitLogin}>
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
