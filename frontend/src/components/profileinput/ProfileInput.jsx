import './profileinput.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSaveProfileMutation } from '../../services/farmerProfileApi';
import { getToken } from '../../services/LocalStorageService';
import { Alert, Typography } from '@mui/material';

export default function ProfileInput() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    location: "",
    landSize: "",
    landType: "irrigated",
    crops: "",
    livestock: "",
    fertilizers: "",
    pesticides: "",
    irrigation: "sprinkler",
    seedBrand: "",
    annualCrops: "",
    profilePicture: null,
  });
  const [profilePreview, setProfilePreview] = useState("");
  const [server_error, setServerError] = useState({});
  const [server_msg, setServerMsg] = useState({});
  const [fileError, setFileError] = useState("");
  const [saveProfile] = useSaveProfileMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("farmerData"));
    if (savedData) {
      setFormData(savedData);
      // For preview, if profilePicture was stored as a URL, use that.
      setProfilePreview(savedData.profilePicture || "");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFileError(""); // Clear any previous file errors
    const file = e.target.files[0];
    if (file) {
      // Validate file type to ensure it's an image
      if (!file.type.startsWith("image/")) {
        setFileError("Please upload a valid image file.");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should not exceed 5MB.");
        return;
      }
      // Instead of converting to base64, store the file object
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("contact", formData.contact);
    data.append("location", formData.location);
    data.append("land_size", formData.landSize);
    data.append("land_type", formData.landType);
    data.append("crops", formData.crops);
    data.append("livestock", formData.livestock);
    data.append("fertilizers", formData.fertilizers);
    data.append("pesticides", formData.pesticides);
    data.append("irrigation", formData.irrigation);
    data.append("seed_brand", formData.seedBrand);
    data.append("annual_crops", formData.annualCrops);
    if (formData.profilePicture) {
      data.append("profile_picture", formData.profilePicture);
    }

    // Get the access token for authenticated API call
    const { access_token } = getToken();

    try {
      // Pass the FormData (here as "farmer") along with access_token
      const res = await saveProfile({ farmer: data, access_token });

      if (res.error) {
        // Check if error is due to unauthorized access (401)
        if (res.error.status === 401) {
          setServerError({ non_field_errors: ["Unauthorized access. Please log in again."] });
          // Optionally, redirect the user to the login page
          // navigate("/auth");
        } else {
          setServerError(res.error.data.errors);
        }
        setServerMsg({});
        return;
      }

      if (res.data) {
        setServerMsg(res.data);
        setServerError({});
        // Save data locally if needed
        localStorage.setItem("farmerData", JSON.stringify(formData));
        // Redirect and force a full page refresh so that the profile-view page fetches updated data
        navigate("/application/profile-view");
        window.location.reload();
      }
    } catch (err) {
      setServerError({ non_field_errors: ["An unexpected error occurred. Please try again later."] });
    }
  };

  return (
    <div className="container-profile">
      <h2>Farmer Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-pic-wrapper">
            <label htmlFor="profilePicture" className="profile-pic-label">
              <div
                className="profile-pic-preview"
                style={{
                  backgroundImage: `url(${profilePreview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <span>Upload Profile Picture</span>
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </div>
          {fileError && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {fileError}
            </Typography>
          )}
        </div>

        {/* Personal Information */}
        <section>
          <h3>Personal Information</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
          {server_error.name && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {server_error.name[0]}
            </Typography>
          )}
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            required
          />
          {server_error.age && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {server_error.age[0]}
            </Typography>
          )}
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            pattern="[0-9]{10}"
            required
          />
          {server_error.contact && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {server_error.contact[0]}
            </Typography>
          )}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter village/city and state"
            required
          />
          {server_error.location && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {server_error.location[0]}
            </Typography>
          )}
        </section>

        {/* Farm Details */}
        <section>
          <h3>Farm Details</h3>
          <input
            type="number"
            name="landSize"
            value={formData.landSize}
            onChange={handleInputChange}
            placeholder="Land Size (in acres)"
            required
          />
          {server_error.landSize && (
            <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>
              {server_error.landSize[0]}
            </Typography>
          )}
          <select
            name="landType"
            value={formData.landType}
            onChange={handleInputChange}
          >
            <option value="irrigated">Irrigated</option>
            <option value="rainfed">Rainfed</option>
            <option value="dry">Dry</option>
          </select>
          <textarea
            name="crops"
            value={formData.crops}
            onChange={handleInputChange}
            placeholder="Crops Grown"
          ></textarea>
          <textarea
            name="livestock"
            value={formData.livestock}
            onChange={handleInputChange}
            placeholder="Livestock"
          ></textarea>
        </section>

        {/* Farming Practices */}
        <section>
          <h3>Farming Practices</h3>
          <textarea
            name="fertilizers"
            value={formData.fertilizers}
            onChange={handleInputChange}
            placeholder="Fertilizers Used"
          ></textarea>
          <textarea
            name="pesticides"
            value={formData.pesticides}
            onChange={handleInputChange}
            placeholder="Pesticides Used"
          ></textarea>
          <select
            name="irrigation"
            value={formData.irrigation}
            onChange={handleInputChange}
          >
            <option value="sprinkler">Sprinkler</option>
            <option value="drip">Drip</option>
            <option value="manual">Manual</option>
            <option value="flood">Flood</option>
          </select>
          <input
            type="text"
            name="seedBrand"
            value={formData.seedBrand}
            onChange={handleInputChange}
            placeholder="Seed Brand"
            required
          />
          <input
            type="number"
            name="annualCrops"
            value={formData.annualCrops}
            onChange={handleInputChange}
            placeholder="Annual Crops per Year"
            required
          />
        </section>

        <button type="submit" className="btn btn-save">
          Save Profile
        </button>

        {/* Display non-field errors or success messages */}
        {server_error.non_field_errors && (
          <Alert severity="error">{server_error.non_field_errors[0]}</Alert>
        )}
        {server_msg.msg && (
          <Alert severity="success">{server_msg.msg}</Alert>
        )}
      </form>
    </div>
  );
}
