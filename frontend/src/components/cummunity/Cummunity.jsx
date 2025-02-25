import './cummunity.css';
import CommunityPost from '../cummunity-post/CummunityPost';
import { useEffect, useState } from "react";
import Share from '../share/Share';
import { useGetFarmerPostQuery } from '../../services/farmerPostApi';
import { getToken } from "../../services/LocalStorageService";

export default function Cummunity() {
  const [posts, setPosts] = useState([]);
  const { access_token = "" } = getToken();
  
  // Fetch posts with refetching
  // const { data, isSuccess } = useGetFarmerPostQuery(access_token, {
  //   pollingInterval: 2000, // Fetch data every 5 seconds (Adjust as needed)
  // });
  const { data, isSuccess } = useGetFarmerPostQuery(access_token);
  useEffect(() => {
    if (data && isSuccess) {
      // console.log("Fetched data:", data);
      setPosts(data.candidates || data);
    }
  }, [data, isSuccess]);
// console.log(posts);
  return (
    <div className='feed'>
      <div className="feedWrapperLeft">
        {/* <button onClick={refetch} className="refreshButton">Refresh Posts</button> Manual Refresh */}
        {posts?.map((post) => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </div>
      <div className="feedWrapperRight">
        <Share />
      </div>
    </div>
  );
}
