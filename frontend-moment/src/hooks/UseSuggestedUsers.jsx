import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { useDispatch } from 'react-redux'
import { setSuggestedUser } from "../redux/authSlice";

const UseGetSuggestedUser = () => {

    const { axios } = useAppContext();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUser = async () => {
            try {
                const response = await axios.get('/api/v1/user/suggested');
                if (response.data.success) {
                    console.log("message from fetchSuggestedUser in useGetSuggestedUser", response.data.users, response)
                    dispatch(setSuggestedUser(response.data.users));
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                    "Failed to fetch suggested users"
                );
                console.log('error in UseGetSuggestedUser',error)
            }

        }

        fetchSuggestedUser();
    }, []);

}

export default UseGetSuggestedUser;
