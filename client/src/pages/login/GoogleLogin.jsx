import axios from "axios";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "../../context/Context";

const GoogleLogin = () => {
  const { dispatch, url } = useContext(Context); //both are destructured from the useContext()
  //google signin botton callback
  const handleCallbackResponse = (response) => {
    const postData = async () => {
      dispatch({ type: "LOGIN_START" });//isFetching true kr dega
      try {
        const res = await axios.post(
          `${url}/api/auth/googlesignin`,
          { response }
        );
        // console.log(response, "response from google");
        localStorage.setItem("accessToken", res.data.accessToken);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user }); //we can access to type by action.type and ... action.payload
        toast.success("Login success", {
          position: "bottom-center",
          autoClose: 2500,
        });
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE" });
        toast.error(`${err}`,{
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    };
    postData();
  };

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id:
        "450520361659-ksnh3nullogb8hk5nufq0rrdipcjprnf.apps.googleusercontent.com",
      callback: handleCallbackResponse,
      cookie_policy: "single_host_origin",
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }); //[] check this later
  // google.accounts.id.prompt();//just prompt for the sigin

  return <div id="signInDiv"></div>;
};

export default GoogleLogin;
