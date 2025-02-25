import { useState } from 'react';
import './cummunity-post.css';
import { MdMoreVert } from "react-icons/md";
import { useLikeFarmerPostMutation } from '../../services/farmerPostApi';
import { getToken } from '../../services/LocalStorageService';
import { useFollowFarmerProfileMutation } from '../../services/farmerProfileApi';


// Function to format date
const formatDate = (isoDate) => {
  if (!isoDate) return "Unknown Date";
  const dateObj = new Date(isoDate);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

export default function CummunityPost({ post = {} }) { 
  const [likePost] = useLikeFarmerPostMutation();
  const [followUser] = useFollowFarmerProfileMutation();
  const { access_token } = getToken();
  const [err ,setErr] = useState("");
  // Follow button state
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = async (postId) => {
    if (!postId) return;
    try {
      const response = await likePost({ uid: postId, access_token });
      if (response.data) {
        console.log(`Liked post with ID: ${postId}`);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Follow button click handler
  const handleFollow = async (userId) => {
    if(!userId) return;
    try{
      const resp = await followUser({user : userId,access_token});
      if(resp.data){
        console.log(`Started Following ${post.username}`);
      }else{
        console.log(resp.error.data.error);
        setErr(resp.error.data.error);
      }
    } catch(error){
      console.log("Error in following :",post.username)
    }
    setIsFollowing((prev) => !prev); // Toggle the state
  };

  return (
    <div className='cpost'>
      <div className="cpostWrapper">
        <div className="cpostTop">
          <div className="cpostTopLeft">
            <img className='cpostProfileImg' 
              src={post.profile_picture ? `http://127.0.0.1:8000/${post.profile_picture}` : "/assets/default-profile.png"} 
              alt="Profile" 
            />
            <span className="cpostUserName">{post.username || "Unknown User"}</span>
            <span className="cpostDate">{formatDate(post.date)}</span>
            <span><button 
              className={`followButton ${isFollowing ? 'following' : ''}`} 
              onClick={() => handleFollow(post.user)}
            >
              {isFollowing ? "Following" : "Follow"}
            </button></span>
            <span className='err'>{err}</span>
          </div>
          <div className="cpostTopRight">
            <MdMoreVert className='cpostIcon' />
          </div>
        </div>
        <div className="cpostCenter">
          <span className="cpostText">{post.description || "No description available"}</span>
          {post.photo && (
            <img 
              src={post.photo.startsWith("http") ? post.photo : `http://127.0.0.1:8000/${post.photo}`} 
              alt="Post" 
              className="cpostImg" 
            />
          )}
        </div>
        <div className="cpostBottom">
          <div className="cpostBottomLeft" onClick={() => handleLike(post.id)}>
            <img className='clikeIcon' src="/assets/like.png" alt="Like" />
            <img className='clikeIcon' src="/assets/heart.png" alt="Heart" />
            <span className="cpostLikeCounter">{post.total_likes || 0} people like it</span>
          </div>
          <div className="cpostBottomRight">
            <span className="cpostCommentText">{post.total_comment || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
