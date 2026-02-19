import { useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const UseGetAllMessage = () => {
    const {axios} = useAppContext();
    const dispatch = useDispatch();

    const {selectedUser} = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllMessage = async() => {
            try {
                const response = await axios.get(`/api/v1/message/all/${selectedUser?._id}`)
                if(response.data.success) {
                    dispatch(setMessages(response.data.messages))
                }
            } catch (error) {
                console.log('use get all message', error);
            }
        }

        fetchAllMessage();
    }, [selectedUser]);
}

export default UseGetAllMessage;