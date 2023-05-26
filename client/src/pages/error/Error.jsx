import React from 'react';
import "./error.css";
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-heading">404 - Page Not Found</h1>
      <p className="not-found-message">The page you are looking for does not exist.</p>
      <Link to="/" className="not-found-link">Go to Home Page</Link>
    </div>
  );
};

export default Error;
