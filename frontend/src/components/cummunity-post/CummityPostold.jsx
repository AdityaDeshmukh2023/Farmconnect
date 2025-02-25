import './cummunity-post.css';
import { MdMoreVert } from "react-icons/md";
import { Users } from "../../dummyData";
import { useState} from 'react';


export default function CommunityPost({post}) {
     const [like, setLike] = useState(post.like);
        const [dislike, setDislike] = useState(post.dislike); 
        const [isLiked, setIsLiked] = useState(false);
        const [isDisliked, setIsDisliked] = useState(false); 
        
    
        const likeHandler = () => {
            if (!isLiked) {
                setLike(like + 1);
                if (isDisliked) {
                    setDislike(dislike - 1);
                    setIsDisliked(false);
                }
            } else {
                setLike(like - 1);
            }
            setIsLiked(!isLiked);
        };
    

    
    
       
  return (
    <div className='cpost'>
    <div className="cpostWrapper">
        <div className="cpostTop">
            <div className="cpostTopLeft">
                <img className='cpostProfileImg' src={Users.filter(u=>u.id === post.userId)[0].profilePicture} alt="" />
                <span className="cpostUserName">{Users.filter(u=>u.id === post.userId)[0].username}</span>
                <span className="cpostDate">{post.date}</span>
            </div>
            <div className="cpostTopRight">
            <MdMoreVert className='cpostIcon'/>

            </div>
        </div>
        <div className="Center">
            <span className="cpostText">
                {post?.desc}
            </span>
            <img src= {post.photo} alt="" className="cpostImg" />
        </div>
        <div className="cpostBottom">
            <div className="cpostBottomLeft">
                <img className='clikeIcon' src="/assets/like.png" alt="" onClick={likeHandler}/>
                <img className='clikeIcon' src="/assets/heart.png" alt="" onClick={likeHandler}/>
                <span className="cpostLikeCounter">{like} people like it</span>
                
            </div>
            <div className="cpostBottomRight">
                <span className="cpostCommentText">{post.comment} comments</span>
            </div>
        </div>
    </div>
</div>
  )
}