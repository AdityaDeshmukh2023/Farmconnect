import { useState } from 'react';
import './cummunity-post.css';
import { MdMoreVert } from "react-icons/md";
import { useLikeFarmerPostMutation,useDislikeFarmerPostMutation } from '../../services/farmerPostApi';
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
  const [DislikePost] = useDislikeFarmerPostMutation();
  const [followUser] = useFollowFarmerProfileMutation();
  const { access_token } = getToken();
  const [err, setErr] = useState("");

  // State for Like Count & Like Status
  const [likeCount, setLikeCount] = useState(post.total_likes || 0);
  const [dislikeCount, setDisLikeCount] = useState(post.total_dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);

  // Follow button state
  const [isFollowing, setIsFollowing] = useState(false);

  const handleLike = async (postId) => {
    if (!postId) return;
    
    // Toggle Like State
    setIsLiked((prev) => !prev);
    
    // Update Like Count Instantly
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

    try {
      await likePost({ uid: postId, access_token });
      console.log(`Liked post with ID: ${postId}`);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDisLike = async (postId) => {
    if (!postId) return;
    
    // Toggle DisLike State
    setIsDisLiked((prev) => !prev);
    
    // Update DisLike Count Instantly
    setDisLikeCount((prevCount) => (isDisLiked ? prevCount - 1 : prevCount + 1));

    try {
      await DislikePost({ uid: postId, access_token });
      console.log(`DisLiked post with ID: ${postId}`);
    } catch (error) {
      console.error("Error Disliking post:", error);
    }
  };

  // Follow button click handler
  const handleFollow = async (userId) => {
    if (!userId) return;
    try {
      const resp = await followUser({ user: userId, access_token });
      if (resp.data) {
        console.log(`Started Following ${post.username}`);
      } else {
        console.log(resp.error.data.error);
        setErr(resp.error.data.error);
      }
    } catch (error) {
      console.log("Error in following:", post.username);
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
            <button 
              className={`followButton ${isFollowing ? 'following' : ''}`} 
              onClick={() => handleFollow(post.user)}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
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
          <div className="cpostBottomLeft" >
            <img 
              className='clikeIcon' 
              src={isLiked ? "/assets/like.png" : "/assets/like.png"} 
              alt="Like" 
              onClick={() => handleLike(post.id)}
            />
            <img className='clikeIcon' src="/assets/heart.png" alt="Heart" 
            onClick={() => handleLike(post.id)}
            />
           
            <span className="cpostLikeCounter"
            onClick={() => handleLike(post.id)}>{likeCount} people like it</span>

            <img className='cdislikeIcon' src="/assets/dislike.png" alt="Dislike"  onClick={() => handleDisLike(post.id)}/>
            <span className="cpostLikeCounter" onClick={() => handleDisLike(post.id)}>{dislikeCount} people dislike it</span>

          </div>
          <div className="cpostBottomRight">
            <span className="cpostCommentText">{post.total_comment || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
