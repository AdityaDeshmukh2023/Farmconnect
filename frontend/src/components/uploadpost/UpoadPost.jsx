import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./uploadpost.css"; // Uses styles similar to GreenScan
import { useSavePostMutation } from "../../services/farmerPostApi";
import { getToken } from "../../services/LocalStorageService";

const UploadPost = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Stores the actual file
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [savePost] = useSavePostMutation();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview for UI
      setImageFile(file); // Actual file to be uploaded
    }
  };

  const handlePost = async () => {
    if (!imageFile || !description.trim()) {
      setMessage("❌ Please upload an image and add a description!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", imageFile);
    formData.append("description", description);

    const { access_token } = getToken();

    try {
      const res = await savePost({ post: formData, access_token });

      if (res.error) {
        setMessage("❌ Failed to upload post. Try again!");
        return;
      }

      setMessage("✅ Upload Successful! Redirecting...");
      setTimeout(() => {
        navigate("/application/community"); // Redirect after success
      }, 2000);
    } catch (err) {
      setMessage("❌ An error occurred. Please try again.");
    }
  };

  return (
    <div className="greenscan community-upload">
      <section className="hero">
        <div className="content">
          <h1>Community Sharing</h1>
          <p>Share your experiences and connect with our community!</p>
          <button
            className="cta-button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Upload Image
          </button>
        </div>
        <img
          src="/assets/community/community.png"
          alt="Community Sharing"
          className="hero-image"
        />
      </section>

      <section className="upload-section">
        <div
          className="upload-area"
          onClick={() => document.getElementById("fileInput").click()}
        >
          {image ? (
            <img src={image} alt="Preview" className="preview-image" />
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <p>Drag & drop an image here or click to upload</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <textarea
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button className="cta-button" onClick={handlePost}>
          Post
        </button>

        {message && <p className="upload-message">{message}</p>}
      </section>
    </div>
  );
};

export default UploadPost;
