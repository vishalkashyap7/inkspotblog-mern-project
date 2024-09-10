// import { useEffect } from "react";

import { OrbitProgress } from "react-loading-indicators";
import Post from "../post/Post1";
import "./posts.css";

export default function Posts({ posts }) {

  return (
    <div className="posts">
      {
        posts.length === 0 && <div className="loading-div"><OrbitProgress color="red" size="medium" text="" textColor="" /></div>
      }
      {posts.map((p,i) => (
        <Post key={i} post={p} />
      ))}
    </div>
  );
}