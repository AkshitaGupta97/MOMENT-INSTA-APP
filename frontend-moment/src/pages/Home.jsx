
//import { Posts } from '../components/Posts';
import Stories from '../components/Stories';
import PostAll from '../components/PostAll';
import useGetAllPost from '../hooks/useGetAllPost';

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