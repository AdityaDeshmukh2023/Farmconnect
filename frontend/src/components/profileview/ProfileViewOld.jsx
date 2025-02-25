import "./profileview.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../services/LocalStorageService";
import { useDispatch } from "react-redux";
import { unSetUserToekn } from "../../features/authSlice";
import { unSetUserInfo } from "../../features/userSlice";
import { getToken } from "../../services/LocalStorageService";
import { useGetFarmerProfileQuery } from "../../services/farmerProfileApi";

export default function ProfileView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access_token } = getToken();
  const [profileImageError, setProfileImageError] = useState(false);

  // Fetch profile data
  const { data: profileData, isLoading, error } = useGetFarmerProfileQuery(access_token);

  // Handle errors (404 = profile not found, 401 = unauthorized)
  useEffect(() => {
    if (error) {
      console.error("Profile fetch error:", error);

      if (error.status === 404) {
        console.error("Profile not found. Redirecting to profile input...");
        navigate("/application/profile-input", { replace: true });
      } else if (error.status === 401) {
        alert("Error in fetching profile. Unauthorized access.");
        navigate("/application/land", { replace: true });
      }
    }
  }, [error, navigate]);

  // Redirect if image fails to load
  useEffect(() => {
    if (profileImageError) {
      console.error("Profile picture failed to load. Redirecting to profile input...");
      navigate("/application/profile-input", { replace: true });
    }
  }, [profileImageError, navigate]);

  // Handle loading state
  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  // Logout handler
  const handleLogout = async () => {
    removeToken();
    dispatch(unSetUserToekn());
    dispatch(unSetUserInfo());
    navigate("/auth", { replace: true });
  };

  return (
    <div className="container-profile">
      <h2>Farmer Profile</h2>

      {/* Profile Picture Section */}
      <div className="profile-picture-section">
        <div className="profile-pic-wrapper">
          <img
            src={profileData?.profile_picture ? `http://127.0.0.1:8000/${profileData.profile_picture}` : "/default-profile.png"}
            alt="Profile"
            className="profile-pic-preview"
            onError={() => setProfileImageError(true)} // Set error state when image fails to load
          />
        </div>
      </div>

      {/* Profile Details */}
      <div id="profileDetails" className="profile-details">
        {profileData &&
          Object.entries(profileData).map(([key, value]) => {
            if (key !== "profile_picture") {
              return (
                <div className="profile-detail" key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </div>
              );
            }
            return null;
          })}
      </div>

      {/* Buttons */}
      <button className="btn edit-btn" onClick={() => navigate("/application/profile-input")}>
        Edit Profile
      </button>
      {/* <button className="btn change-pass-btn" onClick={() => navigate("/application/change-password")}>
        <p className="change-pass-p">Change Password</p>
      </button> */}
      <button className="btn logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
