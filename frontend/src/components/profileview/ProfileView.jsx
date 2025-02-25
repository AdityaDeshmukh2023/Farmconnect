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

  useEffect(() => {
    if (error) {
      console.error("Profile fetch error:", error);
      if (error.status === 404) {
        navigate("/application/profile-input", { replace: true });
      } else if (error.status === 401) {
        alert("Unauthorized access.");
        navigate("/application/land", { replace: true });
      }
    }
  }, [error, navigate]);

  useEffect(() => {
    if (profileImageError) {
      navigate("/application/profile-input", { replace: true });
    }
  }, [profileImageError, navigate]);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  const handleLogout = () => {
    removeToken();
    dispatch(unSetUserToekn());
    dispatch(unSetUserInfo());
    navigate("/auth", { replace: true });
  };

  return (
    <div className="profile-container">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-picture">
          <img
            src={profileData?.profile_picture ? `http://127.0.0.1:8000/${profileData.profile_picture}` : "/default-profile.png"}
            alt="Profile"
            onError={() => setProfileImageError(true)}
          />
        </div>
        <div className="profile-info">
          <h2>{profileData?.name || "User"}</h2>
          <div className="profile-stats">
            <span><strong>{profileData?.post_count || 0}</strong> Posts</span>
            <span><strong>{profileData?.followers_count || 0}</strong> Followers</span>
            <span><strong>{profileData?.following_count || 0}</strong> Following</span>
          </div>
          <button className="btn edit-btn" onClick={() => navigate("/application/profile-input")}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Bio */}
      <div className="profile-bio">
        <p><strong>Bio:</strong> {profileData?.bio || "No bio available"}</p>
      </div>

      {/* Profile Details Section */}
      <div className="profile-details">
  {profileData &&
    Object.entries(profileData).map(([key, value]) => {
      if (
        ![
          "profile_picture",
          "bio",
          "posts",
          "followers_count",
          "following_count",
          "post_count",
          "email",
        ].includes(key)
      ) {
        return (
          <div className="profile-detail" key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
          </div>
        );
      }
      return null;
    })}
</div>


      {/* Logout Button */}
      <button className="btn logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
