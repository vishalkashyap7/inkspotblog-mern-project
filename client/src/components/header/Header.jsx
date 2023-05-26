import "./header.css";

// //aos
// import AOS from 'aos';
// import 'aos/dist/aos.css';



export default function Header() {
  // useEffect(() => {
  //   AOS.init();
  // }, []);

  return (
    <div className="header">
      <div className="gradientHome">
      <div className="headerTitles">
        <span className="headerTitleLg animated-div"  data-aos="slide-left">InkSpotBlog</span>
      </div>
      {/* <img
        className="headerImg"
        src="https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        alt=""
      /> */}

      </div>
    </div>
  );
}