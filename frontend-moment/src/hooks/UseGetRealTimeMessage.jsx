import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const UseGetRealTimeMessage = () => {
    const dispatch = useDispatch();
    const {socket} = useSelector(store => store.socketio);
    const {messages} = useSelector(store=> store.chat);
    useEffect(() => {
       socket?.on('newMessage', (newMsg) => {
        dispatch(setMessages([...messages, newMsg]));
       });
       // clean up if user is off line then off the connection
       return () => {
        socket?.off('newMessage');
       }
    }, [messages, setMessages]);
};

export default UseGetRealTimeMessage;