// import { useEffect } from "react";

import Post from "../post/Post1";
import "./posts.css";

export default function Posts({ posts }) {

  return (
    <div className="posts">
      {posts.map((p,i) => (
        <Post key={i} post={p} />
      ))}
    </div>
  );
}