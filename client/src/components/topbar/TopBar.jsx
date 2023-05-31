import React from "react";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../../context/Context";
import "./topbar.css";

export default function TopBar() {
  const [threeBarClick, setThreeBarClick] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  function handleClick() {
    setThreeBarClick(!threeBarClick);
  }

  React.useEffect(() => {
    setActiveLink(location.pathname);
    setThreeBarClick(false);
  }, [location]);

  //   console.log("active link ", activeLink);
  const { user, dispatch, url } = useContext(Context);
  const PF = `${url}/images/`;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch({ type: "LOGOUT" });
  };
  return (
    <nav>
      <div>
        <Link className="textDec" to="/">
          <p className="topLeft">InkSpotBlog</p>
        </Link>
      </div>
      <div>
        <ul
          id="navbar"
          className={threeBarClick ? "#navbar actnvr" : "#navbar"}
        >
          {/* actnvr = active navbar if its active then change the right position as the css from -300px to 0px*/}
          <li>
            <Link
              className={activeLink === "/" ? "active linkNav" : "linkNav"}
              to="/"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              className={activeLink === "/about" ? "active linkNav" : "linkNav"}
              to="/about"
            >
              ABOUT
            </Link>
          </li>
          <li>
            <a
              className={
                activeLink === "/contact" ? "active linkNav" : "linkNav"
              }
              href="https://www.linkedin.com/in/vishal-kashyap-447a451ba" target="blank"
            >
              CONTACT
            </a>
          </li>
          <li>
            <Link
              className={activeLink === "/write" ? "active linkNav" : "linkNav"}
              to="/write"
            >
              WRITE
            </Link>
          </li>
          {user && (
            <li>
              <Link 
                className={
                  activeLink === "/logout" ? "active linkNav" : "linkNav"
                }
                onClick={handleLogout}
              >
                LOGOUT
              </Link>
            </li>
          )}
          {user ? (
            <div className="userIconTopBar">
              <Link
                // className={activeLink === "/settings" ? "linkNav" : "linkNav"}
                to="/settings"
              >
                <img
                  className="topImg circle-border"
                  src={
                    user.profilePic.substring(0, 1) !== "h"
                      ? PF + user.profilePic
                      : user.profilePic
                  }
                  alt=""
                />
              </Link>
            </div>
          ) : (
            <>
              <li>
                <Link
                  className={
                    activeLink === "/login" ? "active linkNav" : "linkNav"
                  }
                  to="/login"
                >
                  LOGIN
                </Link>
              </li>
              <li>
                <Link
                  className={
                    activeLink === "/register" ? "active linkNav" : "linkNav"
                  }
                  to="/register"
                >
                  REGISTER
                </Link>
              </li>
            </>
            //   </ul>
          )}
          <li>
            <Link
              className={
                activeLink === "/search"
                  ? "active linkNav inMob"
                  : "linkNav inMob"
              }
              to="/search"
            >
              <i className="topSearchIcon fa-solid fa-magnifying-glass fa-xl"></i>
            </Link>
          </li>
        </ul>
      </div>
      <div id="mobile">
        <div
          className={
            activeLink === "/search"
              ? "activeForSearch searchButtonNavbar"
              : "searchButtonNavbar whitee"
          }
        >
          <Link to="/search">
            <i className="okk fa-solid fa-magnifying-glass fa-xl"></i>
          </Link>
        </div>
        <div onClick={handleClick}>
          <i
            id="bar"
            className={
              threeBarClick
                ? "fa-solid fa-xmark fa-xl"
                : "fa-solid fa-bars fa-lg"
            }
          ></i>
        </div>
      </div>
    </nav>
  );
}
