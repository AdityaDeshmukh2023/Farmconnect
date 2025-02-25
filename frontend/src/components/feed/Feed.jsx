import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../reel-post/Post";
import "./feed.css";
import { useGetFarmerReelQuery } from "../../services/farmerReelApi";
import Following from "../followings/Following";
import { useGetFarmerFollowingQuery } from "../../services/farmerPostApi";
import { getToken } from "../../services/LocalStorageService";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  // const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  // Fetch reels
  const { data: reelData, isSuccess: isReelSuccess } = useGetFarmerReelQuery();

  // Fetch token asynchronously
  const { access_token = "" } = getToken();
  // setAccessToken(access_token);
  // Fetch followings once token is available
  const { data: followingData } =
    useGetFarmerFollowingQuery(access_token);

  useEffect(() => {
    if (reelData && isReelSuccess) {
      setPosts(reelData.candidates || []);
    }
  }, [reelData, isReelSuccess]);

  useEffect(() => {
    if (followingData) {
      setUsers(followingData); // Extract Followings array
    }
  }, [followingData]);
  

  const handleButtonClick = () => {
    navigate("/application/create-agroloop");
  };
// console.log(users)
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
        <div className="feedWrapperRight">
          <div className="followingSection">
            <div className="followingTitle">
              <span>Following</span>
            </div>
            <ul className="rightbarFriendList">
              {users ? (
                users.map((user) => <Following key={user.name} user={user} />)
              
              ) : (
                <p>No followings yet</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
