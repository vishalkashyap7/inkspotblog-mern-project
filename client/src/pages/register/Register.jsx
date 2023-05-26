import axios from "axios";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./register.css";
import { Context } from "../../context/Context";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from "../login/GoogleLogin";

export default function Register() {
  const { dispatch, isFetching, url } = useContext(Context);
  const navigate = useNavigate();
  const usernameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTER_START" });
    try {
      const res = await axios.post(`${url}/api/auth/register`, {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data.user });
      localStorage.setItem("accessToken", res.data.accessToken);

      toast.success("Account created successfully", {
        position: "bottom-center",
        autoClose: 2500,
      });

      res.data && navigate('/verifyotp');
      
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE" });
      toast.error("Failed to create account", {
        position: "bottom-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <div className="registerContainer">
        <form className="registerForm" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            className="registerInput"
            placeholder="Enter your username"
            ref={usernameRef}
          />
          <label>Email</label>
          <input
            type="text"
            className="registerInput"
            placeholder="Enter your email"
            ref={emailRef}
          />
          <label>Password</label>
          <input
            type="password"
            className="registerInput"
            placeholder="Enter your password"
            ref={passwordRef}
          />
          <p className="reginlogin">
            already have an account?{" "}
            <Link className="link regButton" to="/login">
              login here
            </Link>
          </p>
          <button className="registerButton" type="submit" disabled={isFetching}>
            Register <i className="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>
        <div className="middleLine">
          <div className="cuttedLine"></div>
          <span className="orText">or</span>
          <div className="cuttedLine"></div>
        </div>
        <div className="googleSignIn">
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
}


// export default function Register() {
//   const { dispatch, isFetching } = useContext(Context);
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   // const [error, setError] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // setError(false);
//     dispatch({ type: "REGISTER_START" });
//     try {
//       // console.log(username,email, password, "trying to register");
//       const res = await axios.post("${url}/api/auth/register", {
//         username,
//         email,
//         password,
//       });

//       // console.log(res, "reguster jsx");
//       dispatch({ type: "REGISTER_SUCCESS", payload: res.data.user });
//       localStorage.setItem("accessToken", res.data.accessToken);

//       toast.success("Account created successfully", {
//         position: "bottom-center",
//         autoClose: 2500,
//       });

//       res.data && navigate('/verifyotp');
      
//     } catch (err) {
//       dispatch({ type: "REGISTER_FAILURE" });
//       toast.error("Failed to create account", {
//         position: "bottom-center",
//         autoClose: 2500,
//       });
//     }
//   };
//   return (
//     <div className="register">
//       <span className="registerTitle">Register</span>
//       <div className="registerContainer">
//       <form className="registerForm" onSubmit={handleSubmit}>
//         <label>Username</label>
//         <input
//           type="text"
//           className="registerInput"
//           placeholder="Enter your username"
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <label>Email</label>
//         <input
//           type="text"
//           className="registerInput"
//           placeholder="Enter your email"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <label>Password</label>
//         <input
//           type="password"
//           className="registerInput"
//           placeholder="Enter your password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <p className="reginlogin">
//             already have an account?{" "}
//             <Link className="link regButton" to="/login">
//               login here
//             </Link>
//           </p>
//         <button className="registerButton" type="submit" disabled={isFetching}>
//           Register <i className="fa-solid fa-right-to-bracket"></i>
//         </button>
//       </form>
//         <div className="middleLine">
//         <div className="cuttedLine"></div>
//         <span className="orText">or</span>
//         <div className="cuttedLine"></div>
//       </div>
//         <div className="googleSignIn">
//           {/* <h2>Hello Google</h2> */}
//           <GoogleLogin />
//         </div>
//       </div>
      
//       {/* <button className="registerLoginButton">
//         <Link className="link" to="/login">
//           Login
//         </Link>
//       </button> */}
//       {/* {error && <span style={{color:"red", marginTop:"10px"}}>Something went wrong!</span>} */}
//     </div>
//   );
// }