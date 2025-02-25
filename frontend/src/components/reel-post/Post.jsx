import "./post.css";
import { MdMoreVert } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

export default function Post({ post }) {
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const videoRef = useRef(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    if (isDisliked) {
      setDislike(dislike - 1);
      setIsDisliked(false);
    }
  };

  const dislikeHandler = () => {
    setDislike(isDisliked ? dislike - 1 : dislike + 1);
    setIsDisliked(!isDisliked);
    if (isLiked) {
      setLike(like - 1);
      setIsLiked(false);
    }
  };

  const handlePlayVideo = () => {
    if (videoRef.current && !hasUserInteracted) {
      videoRef.current.play().catch((error) => console.error("Video play failed:", error));
      setHasUserInteracted(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current && entry.isIntersecting && hasUserInteracted) {
          videoRef.current.play().catch((error) => console.error("Video play failed:", error));
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [hasUserInteracted]);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img className="postProfileImg" src="" alt="User" />
            <span className="postUserName">{post.email}</span>
          </div>
          <div className="postTopRight">
            <MdMoreVert className="postIcon" />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          <div className="videoContainer" onClick={handlePlayVideo}>
            <video
              controlsList="noplaybackrate nopause noplay"
              controls
              ref={videoRef}
              src={`http://127.0.0.1:8000/.${post.rdoc}`}
              className="postVideo"
            ></video>
            <div className="videoOptions">
              <div className={`videoOption ${isLiked ? "iactive" : ""}`} onClick={likeHandler}>
                <AiFillLike className="vicon likeIcon" />
                <span className="optionCount">{like}</span>
              </div>
              <div className={`videoOption ${isDisliked ? "iactive" : ""}`} onClick={dislikeHandler}>
                <AiFillDislike className="vicon dislikeIcon" />
                <span className="optionCount">{dislike}</span>
              </div>
              <div className="videoOption">
                <FaRegComment className="vicon commentIcon" />
                <span className="optionCount">0</span>
              </div>
              <div className="videoOption">
                <IoMdShareAlt className="vicon shareIcon" />
                <span className="optionCount">Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
