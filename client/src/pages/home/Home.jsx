import { useContext, useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
// import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import axios from "axios";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { Context } from "../../context/Context";
import jwtDecode from "jwt-decode";

export default function Home() {
  const { user, dispatch } = useContext(Context);

  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  // console.log(search);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts" + search);
        setPosts(res.data);
      } catch (err) {
        toast.error("Server error, Please retry!", {
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    };
    fetchPosts();
  }, [search]);

  //just checking the token is still valid or not
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("accessToken");
      const decodedToken = jwtDecode(token);
      const expiryTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (expiryTime < currentTime) {
        // console.log("Token has expired.");
        toast.error("Login token has expired, Login again", {
          position: "bottom-center",
          autoClose: 2500,
        });
        dispatch({ type: "LOGOUT" });
      }
    }
  });

  return (
    <>
      <Header />
      <div className="home">
        <Posts posts={posts} />
        {/* <Sidebar /> */}
      </div>
    </>
  );
}
