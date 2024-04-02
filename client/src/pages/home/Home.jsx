import { useContext, useEffect, useMemo, useState } from "react";
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
  const { user, dispatch, url } = useContext(Context);
  // const maxButtons = 5;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { search } = useLocation();
  // console.log(search);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!search) {
          const res = await axios.get(`${url}/api/posts?page=${page}&limit=6`);
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const res = await axios.get(
            `${url}/api/posts${search}&page=${page}&limit=6`
          );
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages);
          console.log("loggged", res.data);
        }
      } catch (err) {
        toast.error("Server error, Please retry!", {
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    };
    fetchPosts();
  }, [search, url, page]);

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

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const getPageNumbers = useMemo(() => {
    const pageNumbers = [];
    const maxButtonsToShow = 5;
    const maxMobileButtonsToShow = 3;
    const totalPagesToShow = Math.min(maxButtonsToShow, totalPages);
    const isMobile = window.innerWidth <= 600;

    let startPage;
    let endPage;

    if (isMobile) {
      startPage = Math.max(page - Math.floor(maxMobileButtonsToShow / 2), 1);
      endPage = Math.min(startPage + maxMobileButtonsToShow - 1, totalPages);
      if (endPage - startPage < maxMobileButtonsToShow - 1) {
        startPage = Math.max(endPage - (maxMobileButtonsToShow - 1), 1);
      }
    } else {
      startPage = Math.max(page - Math.floor(totalPagesToShow / 2), 1);
      endPage = Math.min(startPage + totalPagesToShow - 1, totalPages);
      if (endPage - startPage < maxButtonsToShow - 1) {
        startPage = Math.max(endPage - (maxButtonsToShow - 1), 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }, [page, totalPages]);

  return (
    <>
      <Header />
      <div className="home">
        <Posts posts={posts} />

        {/* <Sidebar /> */}
        <p>
          Page {page} of {totalPages}
        </p>
        {/* pagination added here */}
        <div className="pagination">
          <div className="pageNavButton">
            <button onClick={handleFirstPage} disabled={page === 1}>
              First
            </button>
          </div>
          <div className="pageNavButton">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              <i class="fa-solid fa-angle-left"></i>
            </button>
          </div>
          {getPageNumbers.map((pageNum) => (
            <div
              className={
                pageNum === page
                  ? "pageNoButton activePage"
                  : "pageNoButton notshow"
              }
              onClick={() => handlePageClick(pageNum)}
            >
              <button key={pageNum}>{pageNum}</button>
            </div>
          ))}
          <div className="pageNavButton">
            <button onClick={handleNextPage} disabled={page === totalPages}>
              <i class="fa-solid fa-angle-right"></i>
            </button>
          </div>
          <div className="pageNavButton">
            <button onClick={handleLastPage} disabled={page === totalPages}>
              Last
            </button>
          </div>
        </div>
        
      </div>
    </>
  );
}
