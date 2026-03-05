
//import { Posts } from '../components/Posts';
import Stories from '../components/Stories';
import PostAll from '../components/PostAll';
import useTempGetAllPost from '../hooks/useGetAllPost.jsx';

const Home = () => {
  useTempGetAllPost();
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
