import "./settings.css";
// import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';


//for delete button
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Settings() {
  const navigate = useNavigate();
  const { user, dispatch, url, isFetching } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);//do user want to change password or not
  const [confPass, setConfPass] = useState("");//for confirming

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    // console.log("checked item is ", isChecked);
  };

  const PF = `${url}/images/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("checked item is ", isChecked);

    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      // username,
      // email,
      ...(isChecked && { password:password })
    };
    // console.log("handle submit clicked", user.username, currentPassword);

    // const passRes = await axios.post(
    //   "${url}/api/auth/checkpassword",
    //   {
    //     username: user.username,
    //     password: currentPassword,
    //   }
    // );

    // console.log("checkpass router response", passRes.data.data);
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post(`${url}/api/upload`, data);
      } catch (err) {}
    }
    // if (passRes.data.data) {
      try {
        const res = await axios.put(
          `${url}/api/users/` + user._id,
              updatedUser,
              {
                headers: {
                  token: "bearer " + localStorage.getItem("accessToken"),
                  password: confPass
                }
              }
        );
        setConfPass("");
        setPassword("");
        console.log("set new ");
        dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
        toast.success("Profile has been updated", {
          position: "bottom-center",
          autoClose: 3000,
        });
      } catch (err) {
        setConfPass("");
        setPassword("");
        dispatch({ type: "UPDATE_FAILURE" });
        toast.error("Update Failure", {
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    // } else {
      // toast.warning("Your password is wrong, Please retry", {
      //   position: "bottom-center",
      //   autoClose: 2500,
      // });
    // }
  };

  //delete button
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // console.log("password is ", confPass);
    setOpen(false);
  };

  
  //to delete the account // very important //two middleware works here, verify token and verify password
  const handleDelete = async () => {
    // console.log("handle delete called", confPass);
    dispatch({ type: "FETCH_START" });

    try {
      await axios.delete(`${url}/api/users/${user._id}`, {
        data: { userId: user._id},
        headers: {
          token: "bearer " + localStorage.getItem("accessToken"),
          password: confPass
        },
      });
      setConfPass("");
      setPassword("");
      dispatch({ type: "FETCH_STOP" });
      dispatch({ type: "LOGOUT" });
      toast.success("User deleted successfully", {
        position: "bottom-center",
        autoClose: 2500,
      });
      // window.location.replace("/");
      navigate("/");
    } catch (err) {
      setConfPass("");
      setPassword("");
      dispatch({ type: "FETCH_STOP" });
      toast.error("User delete failure", {
        position: "bottom-center",
        autoClose: 2500,
      });
    }
  };

  // console.log("user is ",user);
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          
          <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete account permanently</DialogTitle>
          <DialogContent>
            <DialogContentText>
              By deleting account all your posts also delete<br/>
              This process can't undone!<br/>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Confirm your password"
              type="password"
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              fullWidth
            // error={passwordError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error">
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              // src={file ? URL.createObjectURL(file) : PF + user.profilePic}
              src={file ? URL.createObjectURL(file) : (user.profilePic.substring(0,1) !== 'h' ? PF+user.profilePic: user.profilePic)}
              alt=""
            />
            <Tooltip title="Change photo">
            <label className="settingsAddIcon" htmlFor="fileInput" >
              <i className="settingsPPIcon far fa-user-circle"></i>
            </label>
            </Tooltip>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              />
          </div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={"true"}
            className="changeEmail"
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={"true"}
            className="changeEmail"
          />

          <label>Want to change password?</label>
          <div>
            <label className="switch">
              <input type="checkbox" onChange={handleCheckboxChange} />
              <span className="slider round"></span>
            </label>
          </div>
          {isChecked && (
            <>
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}
          <label>Current Password</label>
          <input
            type="password"
            value={confPass}
            onChange={(e) => setConfPass(e.target.value)}
            required
          />
          <button className="settingsSubmit" type="submit"  disabled={isFetching}>
            Update <i className="fa-solid fa-rotate"></i>
          </button>
          <p className="forgotPwd">
            <Link className="link regButton" to="/resetpwd">
              Forgot password?
            </Link>
          </p>
        </form>
        <span className="settingsDeleteTitle">
            <Button variant="contained" color="error" onClick={handleClickOpen} disabled={isFetching}>
              Delete Account <i className="fa-solid fa-eraser"></i>
            </Button>
          </span>
      </div>

      {/* <Sidebar /> */}
    </div>
  );
}
