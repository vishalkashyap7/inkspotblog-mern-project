import "./post.css";
import { Link } from "react-router-dom";

function MyComponent({ content }) {
  return (
    <div className="postDesc" dangerouslySetInnerHTML={{ __html: content }} />
  );
}

export default function Post1({ post }) {

  const PF = "http://localhost:5000/images/";//public folder
  return (
    <div className="post animated-div" data-aos="fade-up">
      {post.photo && <img className="postImg" src={PF + post.photo} alt="" />}
      <div className="postInfo">
        <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}
        </div>
        <Link to={`/post/${post._id}`} className="link">
          <span className="postTitle">{post.title}</span>
        </Link>
        <hr className="hrPost"/>
        <span className="postDate">
          {new Date(post.createdAt).toDateString()}
        </span>
      </div>
      <MyComponent content={post.desc} />
      {/* <p className="postDesc">{post.desc.substring(0, 200)}</p> */}
    </div>
  );
}