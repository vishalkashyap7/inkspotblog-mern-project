import "./post.css";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { useContext } from "react";

function MyComponent({ content }) {
  return (
    <div className="postDesc" dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default function Post1({ post }) {
  const { url } = useContext(Context);

  const PF = `${url}/images/`; //public folder
  return (
    <div className="post animated-div" data-aos="fade-up">
      <Link to={`/post/${post._id}`} className="link">
      {post.photo && <img className="postImg" src={PF + post.photo} alt="" />}
        <div className="postInfo">
          <div className="postCats">
            {post.categories.map((c) => (
              <span className="postCat">{c.name}</span>
            ))}
          </div>
          <span className="postTitle">{post.title}</span>
          <hr className="hrPost" />
          <span className="postDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        <MyComponent content={post.desc} />
      </Link>

      {/* <p className="postDesc">{post.desc.substring(0, 200)}</p> */}
    </div>
  );
}
