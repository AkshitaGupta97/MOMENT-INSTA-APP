import SignUp from "./components/SignUp"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (

    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        style={{ zIndex: 9999 }}
      />


      <div className="w-full h-screen bg-gray-900">
        <SignUp />
      </div>
    </>

  )

}

export default App