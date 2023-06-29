import axios from "axios";
import { useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  //   const message = token ? 'Resetting password...' : 'Forgot password...';
  //   console.log("message", message);
  const userRef = useRef();
  const { dispatch, isFetching, url } = useContext(Context); //both are destructured from the useContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "FETCH_START" }); //isFetching true kr dega
    if (!token) {
      try {
        await axios.post(`${url}/api/auth/resetpwd`, {
          username: userRef.current.value,
        });

        dispatch({ type: "FETCH_STOP" }); //we can access to type by action.type and ... action.payload
        const value = userRef.current.value;
        if (value.includes("@") && value.includes(".")) {
          toast.success(
            "If this email exists then you must receive an email",
            {
              position: "bottom-center",
              autoClose: false,
            }
          );
        } else {
          toast.success(
            "If this username exists then you must receive an email",
            {
              position: "bottom-center",
              autoClose: false,
            }
          );
        }
      } catch (err) {
        dispatch({ type: "FETCH_STOP" });
        toast.error("Server Error! Try again", {
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    } else {
      // console.log("token is", token);
      //write login to verify the token and reset the password
      if (confirmPasswordRef.current.value !== passwordRef.current.value) {
        dispatch({ type: "FETCH_STOP" }); //we can access to type by action.type and ... action.payload
        toast.error("Both password are different", {
          position: "bottom-center",
          autoClose: 2500,
        });
      } else {
        try {
          // const res = 
          await axios.post(
            `${url}/api/auth/updatepwd`,
            {
              username: userRef.current.value,
              password: passwordRef.current.value,
              cnfPassword: confirmPasswordRef.current.value,
            },
            {
              headers: {
                token: "bearer " + token,
              },
            }
          );
          dispatch({ type: "FETCH_STOP" }); //we can access to type by action.type and ... action.payload
          
          toast.success("Password updated successfully", {
            position: "bottom-center",
            autoClose: 2500,
          });
          navigate("/login");
        } catch (err) {
          // console.log();
          dispatch({ type: "FETCH_STOP" }); //we can access to type by action.type and ... action.payload
          toast.error(err.response.data, {
            position: "bottom-center",
            autoClose: 2500,
          });
        }
      }
    }
  };

  return (
    <div className="login">
      <span className="loginTitle">Reset Password</span>
      <div className="loginContainer">
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>Email or username</label>
          <input
            type="text"
            className="loginInput"
            placeholder="email / username"
            ref={userRef}
            required
          />
          {token && (
            <>
              <label>Password</label>
              <input
                type="password"
                className="loginInput"
                placeholder="Enter your password"
                ref={passwordRef}
                required
              />
              <label>Confirm password</label>
              <input
                type="password"
                className="loginInput"
                placeholder="Confirm password"
                ref={confirmPasswordRef}
                required
              />
            </>
          )}
          <button className="loginButton" type="submit" disabled={isFetching}>
            Submit
          </button>
          <p className="reginlogin">
            Don't have an account?{" "}
            <Link className="link regButton" to="/register">
              register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
