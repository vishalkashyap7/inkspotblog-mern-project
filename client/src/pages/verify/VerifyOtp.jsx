import axios from "axios";
import { useContext, useState } from "react";
// import { Link } from "react-router-dom";
import "./verifyOtp.css";
import { Context } from "../../context/Context";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const { dispatch, url } = useContext(Context);
  const navigate = useNavigate();
  const { user } = useContext(Context);


  const [username, setUsername] = useState(user?user.username:"");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError(false);
    // dispatch({ type: "REGISTER_START" });
    try {
      // console.log(username,email, password, "trying to register");
      const res = await axios.post(`${url}/api/auth/verify`, {
        username : username,
        otp
      });
      
      // console.log(res, "reguster jsx");
      //   localStorage.setItem("accessToken", res.data.accessToken);
      // console.log(res.data.message, "res from the server");
      
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data.user });
      toast.success(res.data.message, {
        position: "bottom-center",
        autoClose: 2500,
      });
      res.data && navigate('/');
      
    } catch (err) {
    //   dispatch({ type: "REGISTER_FAILURE" });
      toast.error(err.response.data.message, {
        position: "bottom-center",
        autoClose: 2500,
      });
      // navigate('/');
    }
  };
  return (
    <div className="register">
      <span className="verifyTitle">Verify your OTP here</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="registerInput"
          value={username}
          placeholder="Enter your username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>One time password</label>
        <input
          type="text"
          value={otp}
          className="registerInput"
          placeholder="Enter your otp"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="registerButton" type="submit" >
          Verify
        </button>
      </form>
    </div>
  );
}