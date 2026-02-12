import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { setPosts } from "../redux/postSlice";
import { useDispatch } from 'react-redux'


const UseGetAllPost = () => {

    const { axios } = useAppContext();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const response = await axios.get('/api/v1/post/all');
                if (response.data.success) {
                    console.log("message from fetchAllPost in useGetAll", response.data.post, response)
                    dispatch(setPosts(response.data.post));
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to fetch posts"
                );
                console.log('error in UseGetAllPost',error)
            }

        }

        fetchAllPost();
    }, []);

}

export default UseGetAllPost;
