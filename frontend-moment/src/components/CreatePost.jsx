
const CreatePost = ({iscreateOpen, setiscreateOpen}) => {
    const createPostHandler = (e) => {
        e.preventDefault();
        // Logic to create a post goes here
        console.log("Post created!");
    }
  return (
    <div className={`${iscreateOpen ? "block" : "hidden"} fixed w-[40%]  inset-0 flex justify-center items-center z-50`}>

       <div className="absolute left-1/2 ml-4 top-1/2 border  border-amber-300 bg-gray-700 p-6 rounded-lg shadow-lg w-full">

            <div className="  flex justify-between items-center  ">
                <div className={`font-bold text-white border-b border-spacing-1 border-amber-300 mb-2 text-xl`}>CreatePost</div>
                <button onClick={() => setiscreateOpen(!iscreateOpen)} className=" active:scale-95 text-amber-300 px-2 py-1 text-2xl rounded-lg shadow-lg"> X </button>
            </div>
            <div>
                <form onSubmit={createPostHandler} >
                    <input type="text" placeholder="Create a post..." className="bg-gray-600 text-white p-2 rounded-lg shadow-lg w-full" />
                </form>
            </div>

        </div>

    </div>
  )
}

export default CreatePost