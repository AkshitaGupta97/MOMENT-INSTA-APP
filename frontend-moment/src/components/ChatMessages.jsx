import { useSelector } from "react-redux"
import UseGetAllMessage from "../hooks/UseGetAllMessage";

const ChatMessages = ({ selectedUser }) => {

    UseGetAllMessage();

    const {messages} = useSelector(store => store.chat);

    return (
        <div className="overflow-y-auto flex-1 p-4">

            {/*Messages  */}
            <div className="flex flex-col gap-3">
                {
                    messages && messages.map((msg) => {
                        return (
                            <div key={msg._id} className={`flex `}>
                                <div className=''>
                                    {msg}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ChatMessages