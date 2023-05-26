import axios from "axios";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import "./login.css";
import { toast } from "react-toastify";
import GoogleLogin from "./GoogleLogin";

export default function Login() {
  const userRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching, url } = useContext(Context); //both are destructured from the useContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" }); //isFetching true kr dega
    try {
      const res = await axios.post(`${url}/api/auth/login`, {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user }); //we can access to type by action.type and ... action.payload
      toast.success("Login success", {
        position: "bottom-center",
        autoClose: 2500,
      });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
      toast.error("wrong credentials", {
        position: "bottom-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <div className="loginContainer">
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            className="loginInput"
            placeholder="Enter your username"
            ref={userRef}
          />
          <label>Password</label>
          <input
            type="password"
            className="loginInput"
            placeholder="Enter your password"
            ref={passwordRef}
          />
          <p className="reginlogin">
            Don't have an account?{" "}
            <Link className="link regButton" to="/register">
              register here
            </Link>
          </p>
          <button className="loginButton" type="submit" disabled={isFetching}>
            Login <i className="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>
        <div className="middleLine">
          <div className="cuttedLine"></div>
          <span className="orText">or</span>
          <div className="cuttedLine"></div>
        </div>
        <div className="googleSignIn">
          {/* <h2>Hello Google</h2> */}
          <GoogleLogin />
        </div>
      </div>
      {/* <button className="loginRegisterButton">
        <Link className="link" to="/register">
          Register
        </Link>
      </button> */}
    </div>
  );
}
