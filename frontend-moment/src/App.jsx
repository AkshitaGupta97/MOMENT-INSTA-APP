import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Home from "./pages/Home";
import Profile from "./components/Profile";

const App = () => {
  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        style={{ zIndex: 9999 }}
      />


      <div className="w-full h-screen bg-gradient-to-r from-gray-600  to-gray-800 ">
        <Routes>
          
          <Route path="/" element={<Home />}>
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </div>
    </>

  )

}

export default App