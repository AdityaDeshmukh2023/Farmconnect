import './post.css';
import { MdMoreVert } from "react-icons/md";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { Users } from "../../dummyData";
import { useState, useRef, useEffect } from 'react';

export default function Post({ post }) {
    const [like, setLike] = useState(post.like);
    const [dislike, setDislike] = useState(post.dislike);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const videoRef = useRef(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);  

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

    const dislikeHandler = () => {
        if (!isDisliked) {
            setDislike(dislike + 1);
            if (isLiked) {
                setLike(like - 1);
                setIsLiked(false);
            }
        } else {
            setDislike(dislike - 1);
        }
        setIsDisliked(!isDisliked);
    };

    const handlePlayVideo = () => {
        if (videoRef.current && !hasUserInteracted) {
            videoRef.current.play().catch((error) => {
                console.error("Video play failed: ", error);
            });
            setHasUserInteracted(true);  
        }
    };

   
    useEffect(() => {
        const handleUserInteraction = () => {
            if (!hasUserInteracted) {
                handlePlayVideo();
            }
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('scroll', handleUserInteraction);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (videoRef.current && entry.isIntersecting && hasUserInteracted) {
                    videoRef.current.play().catch((error) => {
                        console.error("Video play failed: ", error);
                    });
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
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('scroll', handleUserInteraction);
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
                        <img
                            className="postProfileImg"
                            src={Users.filter((u) => u.id === post.userId)[0].profilePicture}
                            alt=""
                        />
                        <span className="postUserName">
                            {Users.filter((u) => u.id === post.userId)[0].username}
                        </span>
                        <span className="postDate">{post.date}</span>
                    </div>
                    <div className="postTopRight">
                        <MdMoreVert className="postIcon" />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <div className="videoContainer" onClick={handlePlayVideo}>
                        <video
                            controlsList="noplaybackrate nopause noplay"
                            controls
                            ref={videoRef}
                            src={post.photo}
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
                                <span className="optionCount">{post.comment}</span>
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