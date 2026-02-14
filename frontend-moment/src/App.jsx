import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Home from "./pages/Home";
import Profile from "./components/Profile";
import Feed from "./components/Feed";
import Layout from "./components/Layout";
import ExploreUsers from "./components/ExploreUser";

const App = () => {
  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        style={{ zIndex: 9999 }}
      />


      <div className="w-full min-h-screen bg-gradient-to-r from-gray-600  to-gray-800 ">
        <Routes>
          
          <Route element={<Layout />} >
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/exploreUsers" element={<ExploreUsers />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </>

  )

}

export default App