import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const YourComponent = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="container" data-aos="fade-up">
      <div className="animated-div">Content 1</div>
      <div className="animated-div">Content 2</div>
      <div className="animated-div">Content 3</div>
    </div>
  );
};

export default YourComponent;
