// import { useEffect } from "react";

import Post from "../post/Post1";
import "./posts.css";

export default function Posts({ posts }) {

  return (
    <div className="posts">
      {
        posts.length === 0 && <p>Oops! It seems you've landed on the last page, but there's no content available here.</p>
      }
      {posts.map((p,i) => (
        <Post key={i} post={p} />
      ))}
    </div>
  );
}