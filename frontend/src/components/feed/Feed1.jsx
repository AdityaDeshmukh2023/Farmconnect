import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../reel-post/Post";
import "./feed.css";
import {useGetFarmerReelQuery} from '../../services/farmerReelApi'
export default function Feed() {
  const [posts, setPosts] = useState([]); // Store API data
  const navigate = useNavigate();
  const {data,isSuccess} = useGetFarmerReelQuery()
  useEffect(()=>{
    if(data && isSuccess){
      setPosts(data.candidates)
    }
  },[data,isSuccess])

  const handleButtonClick = () => {
    navigate("/application/create-agroloop");
  };

  return (
    <div className="feedleft">
      <div className="feedWrapperLeft">
        {posts.map((candidate, index) => (
          <Post key={index} post={candidate} />
        ))}
      </div>

      <div className="feedRight">
        <button className="createButton" onClick={handleButtonClick}>
          + Create
        </button>
      </div>
    </div>
  );
}
