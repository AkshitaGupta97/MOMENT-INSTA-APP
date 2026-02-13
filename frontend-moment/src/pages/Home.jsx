
//import { Posts } from '../components/Posts';
import Stories from '../components/Stories';
import UseGetAllPost from '../hooks/useGetAllPost';
import PostAll from '../components/PostAll';

const Home = () => {
  UseGetAllPost();
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