import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSaveReelMutation } from "../../services/farmerReelApi";
import { useSelector } from "react-redux";
import "./agroloopcreate.css";

const CreateReel = () => {
  const navigate = useNavigate();
  const [videoSrc, setVideoSrc] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({ status: false, msg: "", type: "" });

  const mydata = useSelector((state) => state.user_info);
  const email = mydata['email'] || "";

  const [saveProfile] = useSaveReelMutation();

  const handlePostReel = async (e) => {
    e.preventDefault();

    if (!videoSrc) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please upload a video!",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Title",
        text: "Please add a catchy title!",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    // if (!email) {
    //   setError({ status: true, msg: "User email not found!", type: "error" });
    //   return;
    // }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("email", email);
    formData.append("desc", description);
    formData.append("rdoc", videoSrc);

    try {
      const res = await saveProfile(formData);

      if (res?.data?.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Reel Posted!",
          html: `<strong>Title:</strong> ${title}<br><strong>Description:</strong> ${description}`,
          confirmButtonColor: "#28a745",
        }).then(() => {
          navigate("/application/agriloop");
        });

        // Reset fields after successful upload
        setVideoSrc(null);
        setTitle("");
        setDescription("");

        // Free up the memory used by the video preview
        if (videoSrc) {
          URL.revokeObjectURL(videoSrc);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Failed!",
          text: res?.error?.message || "Failed to upload reel!",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred!",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoSrc(file);
    }
  };

  return (
    <div className="reelCreateWrapper">
      <div className="reel-create-container">
        <header className="reel-create-header">
          <h1>Create Reel</h1>
        </header>
        <main className="reel-create-main">
          <div className="upload-section">
            <label htmlFor="reel-video-upload" className="create-upload-btn">
              Select Video
              <input
                type="file"
                id="reel-video-upload"
                accept="video/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
            <div className={`video-preview ${videoSrc ? "visible" : ""}`}>
              {videoSrc && (
                <video
                  id="reel-video-preview"
                  controls
                  poster={`${process.env.PUBLIC_URL}/assets/agro-loop/placeholder-video.png`}
                  src={URL.createObjectURL(videoSrc)}
                ></video>
              )}
            </div>
          </div>
          <div className="details-section">
            <input
              type="text"
              id="reel-title"
              className="reel-title-input"
              placeholder="Add a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              id="reel-description"
              className="reel-description-input"
              placeholder="Write a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {error.status && <p className={`error-msg ${error.type}`}>{error.msg}</p>}
            <button className="post-reel-btn" onClick={handlePostReel}>
              Post Reel
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateReel;