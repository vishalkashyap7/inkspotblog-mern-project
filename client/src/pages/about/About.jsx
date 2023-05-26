import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="about">
      <div className="top animated-div" data-aos="fade-up">
        <div className="topTitle">
          <h3>Features</h3>
        </div>
        <ul className="ulofabout">
          <li>Sign-in using Google</li>
          <li>E-mail authentication using OTP</li>
          <li>JWT token gives extra layer of security</li>
          <li>Create/Delete account anytime</li>
          <li>Search option</li>
          <li>
            Username and password autometically generated for the Google sign-in
            users and will send these credentials into your mail
          </li>
          <li>Can change profile image</li>
          <li>Write/Update/Delete post anytime</li>
          <li>Can add image in your blog</li>
        </ul>
      </div>
      <div className="top animated-div" data-aos="fade-up">
        <div className="topTitle">
          <h3>Used</h3>
        </div>
        <ul className="ulofabout">
          <li>MongoDB</li>
          <li>Express</li>
          <li>ReactJS</li>
          <li>NodeJS</li>
          <li>JWT Token</li>
          <li>Nodemailer</li>
          <li>React-toastify</li>
        </ul>
      </div>
      <div className="infoAbout animated-div" data-aos="fade-up">
        <p>Your valuable feedback and suggestions are most welcome.</p><br/>
        <p>
          This is the v1.0 of this website. We will soon come with new and
          exciting features!
        </p>
      </div>
    </div>
  );
};

export default About;
