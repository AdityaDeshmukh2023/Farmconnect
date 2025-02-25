import Post from '../reel-post/Post';
import './feed.css';
import { Posts, Users } from "../../dummyData";
import Following from '../followings/Following';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
  
  const navigate = useNavigate();
  const handleButtonClick=()=>{
    
    navigate('/application/create-agroloop')
  }
  return (
    <div className="feedleft">
    
      <div className="feedWrapperLeft">
        
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
     
      <div className="feedRight">
      <button className="createButton" onClick={handleButtonClick}>+ Create</button>
        <div className="feedWrapperRight">
          <div className="followingSection">
            <div className="followingTitle">
              <span>Following</span>
            </div>
            <ul className="rightbarFriendList">
              {Users.map((u) => (
                <Following key={u.id} user={u} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}