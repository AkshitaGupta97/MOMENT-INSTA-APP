import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

const UseGetUserProfile = (userId) => {
    const { axios } = useAppContext();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/v1/user/${userId}/profile`);

                if (response.data.success) {
                    dispatch(setUserProfile(response.data.user));
                }

                console.log("from fetchUserProfile", response.data);
            } catch (error) {
                console.log("Error fetching user profile:", error);
                toast.error("Failed to fetch user profile");
            }
        };

        fetchUserProfile();
    }, [userId, axios, dispatch]);
};

export default UseGetUserProfile;
