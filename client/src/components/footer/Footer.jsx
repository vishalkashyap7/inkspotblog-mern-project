import React from 'react';
import "./footer.css";

const Footer = () => {
    const yr = new Date().getFullYear();
  return (<div className='footer'>
    <div>Copyright &#x24B8; {yr} Vishal Kashyap</div>
    <div><a href="https://www.linkedin.com/in/vishal-kashyap-447a451ba" target='blank' className='linkedinButton'><i className="fa-brands fa-linkedin fa-2xl"></i></a><a href="https://github.com/vishalkashyap247" target='blank' className='githubButton'><i className="fa-brands fa-github fa-2xl"></i></a></div>
  </div>
  )
}

export default Footer