
const ChatMessages = ({ selectedUser }) => {
    
    return (
        <div className="overflow-y-auto flex-1 p-4">

            {/*Messages  */}
            <div className="flex flex-col gap-3">
                {
                    [1,2,3,4].map((msg) => {
                        return (
                            <div className={`flex `}>
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