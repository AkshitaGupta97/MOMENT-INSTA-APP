import { useState } from "react";
import Logo from "./Logo"
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const SignUp = () => {

    const { axios } = useAppContext();
    const [loading, setLoading] = useState(false);

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const signUpHandler = async (e) => {
        e.preventDefault();
        try {
            // console.log("signUpHandler -> Signup page -> ", input);
            setLoading(true);

            const response = await axios.post(
                "/api/v1/user/register",
                input,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("signup respose => ", response.data);
            if(response.data.success){
                toast.success(response.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }

        } catch (error) {
            console.log("signUpHandler -> Signup page -> ", error);
            toast.error(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
            <form onSubmit={signUpHandler}
                className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl flex flex-col gap-6 p-10 rounded-2xl max-w-md w-full mx-4">
                <div className="text-center">
                    <Logo />
                    <p className="text-gray-600 text-lg">Create your account</p>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm  text-gray-700 mb-2">Username</label>
                    <input
                        value={input.username} onChange={changeEventHandler}
                        className="w-full text-gray-700 px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        id="name"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">Email</label>
                    <input
                        value={input.email} onChange={changeEventHandler}
                        className="w-full text-gray-700 px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm text-gray-700 mb-2">Password</label>
                    <input
                        value={input.password} onChange={changeEventHandler}
                        className="w-full px-4 py-3 text-gray-700 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg mt-4 hover:from-blue-700 hover:to-purple-700 transition duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default SignUp