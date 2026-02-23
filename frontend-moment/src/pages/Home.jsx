
//import { Posts } from '../components/Posts';
import Stories from '../components/Stories';
import useGetAllPost from '../hooks/UseGetAllPost';
import PostAll from '../components/PostAll';

const Home = () => {
  useGetAllPost();
  return (
    <>
      <div className="flex-shrink-0 pt-2">
        <Stories />
      </div>
      <div className='overflow-y-auto'>
        <PostAll />
      </div>
    </>
  )
}

export default Home