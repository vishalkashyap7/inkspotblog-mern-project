import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../../context/Context";
import "./singlePost.css";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function MyComponent({ content }) {
  return (
    <div
      className="singlePostDesc"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default function SinglePost() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, url } = useContext(Context);
  const path = location.pathname.split("/")[2]; //just splitted the path for id as post url is followed by id

  const [post, setPost] = useState({});
  const PF = `${url}/images/`;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(`${url}/api/posts/` + path);
      // console.log(res);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [path, url]); //when post path ie _id changed then run fetch again

  const handleDelete = async () => {
    try {
      await axios.delete(`${url}/api/posts/${post._id}`, {
        data: { username: user.username },
        headers: {
          token: "bearer " + localStorage.getItem("accessToken"),
        },
      });

      toast.success("Post deleted", {
        position: "bottom-center",
        autoClose: 2500,
      });
      // window.location.replace("/");
      navigate("/");
    } catch (err) {
      toast.error("Post delete failure", {
        position: "bottom-center",
        autoClose: 2500,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/posts/${post._id}`,
        {
          username: user.username,
          title,
          desc,
        },
        {
          headers: {
            token: "bearer " + localStorage.getItem("accessToken"),
          },
        }
      );

      toast.success("Post updated", {
        position: "bottom-center",
        autoClose: 2500,
      });
      setUpdateMode(false);
    } catch (err) {
      toast.error("Post update failure", {
        position: "bottom-center",
        autoClose: 2500,
      });
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={PF + post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <div className="singlePostEditIcon">
                  <i
                    className="singlePostIcon fa-solid fa-pencil edi"
                    onClick={() => setUpdateMode(true)}
                  ></i>
                </div>
                <div className="singlePostDeleteIcon">
                  <i
                    className="singlePostIcon fa-solid fa-trash del"
                    onClick={handleDelete}
                  ></i>
                </div>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.username}`} className="link">
              <b> {post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <ReactQuill
            theme="snow"
            className="singlePostDescInput"
            value={desc}
            onChange={setDesc}
          />
        ) : (
          // <textarea
          //   className="singlePostDescInput"
          //   value={desc}
          // onChange={(e) => setDesc(e.target.value)}
          // />
          <MyComponent content={desc} />
          // <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}
