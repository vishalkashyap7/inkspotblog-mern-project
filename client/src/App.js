import Home from "./pages/home/Home";
import TopBar from "./components/topbar/TopBar";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useContext, useEffect } from "react";
import { Context } from "./context/Context";
import Error from "./pages/error/Error";
import Search from "./pages/search/Search";
import Footer from "./components/footer/Footer";
import VerifyOtp from "./pages/verify/VerifyOtp";
import "./App.css";
import About from "./pages/about/About";


//aos
import AOS from 'aos';
import 'aos/dist/aos.css';
import ResetPassword from "./pages/resetPassword/ResetPassword";


function App() {
  useEffect(() => {
    AOS.init();
  }, []);
  const { user } = useContext(Context);


  return (
    <Router>
      <TopBar />
      <Routes>
        <Route exact path="/" element={<Home />}>
        </Route>
        <Route path="/register" element={user ? <Home /> : <Register />}></Route>
        <Route path="/login" element={user ? <Home /> : <Login />}></Route>
        <Route path="/write" element={user ? <Write /> : <Login />}></Route>
        <Route path="/settings" element={user ? <Settings /> : <Register />}></Route>
        <Route path="/post/:postId" element={<Single />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/verifyotp" element={<VerifyOtp />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route exact path="/resetpwd" element={<ResetPassword />}></Route>
        <Route path="/resetpwd/:token" element={<ResetPassword />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

//check settings page css for disable button css
export default App;