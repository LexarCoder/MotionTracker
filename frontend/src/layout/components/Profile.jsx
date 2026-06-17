

import React, { useState } from "react";
import { Camera, Edit2, Save, X } from "lucide-react";
import "../Style/Profile.scss";

// Reusable Input Component
const InputField = ({
  label,
  value,
  name,
  edit,
  onChange,
  type = "text",
  readOnly = false,
  placeholder = "",
}) => (
  <div className="input-wrapper">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!edit || readOnly}
      placeholder={placeholder}
      className="input-field"
    />
  </div>
);

// Reusable Textarea Component
const TextareaField = ({
  label,
  value,
  name,
  edit,
  onChange,
  placeholder = "",
}) => (
  <div className="textarea-wrapper">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!edit}
      placeholder={placeholder}
      className="textarea-field"
      maxLength="250"
    />
    <div className="char-count">{value.length}/250</div>
  </div>
);

// Reusable Select Component
const SelectField = ({ label, value, name, edit, onChange, options = [] }) => (
  <div className="select-wrapper">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!edit}
      className="select-field"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Main Profile Component
const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    contact: "9876543210",
    dob: "1995-03-15",
    gender: "Male",
    bio: "Passionate developer with expertise in React and modern web technologies.",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    country: "India",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  });

  const [originalUser, setOriginalUser] = useState(user);

  const validateForm = () => {
    const newErrors = {};

    if (!user.firstName.trim()) newErrors.firstName = "First name is required";
    if (!user.lastName.trim()) newErrors.lastName = "Last name is required";

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(user.contact)) {
      newErrors.contact = "Contact must be 10 digits (Indian number only)";
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(user.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    if (user.bio.length > 250)
      newErrors.bio = "Bio cannot exceed 250 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setUser({ ...user, [name]: numbersOnly });
    } else if (name === "pincode") {
      const numbersOnly = value.replace(/[^0-9]/g, "").slice(0, 6);
      setUser({ ...user, [name]: numbersOnly });
    } else if (name === "bio") {
      setUser({ ...user, [name]: value.slice(0, 250) });
    } else {
      setUser({ ...user, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setOriginalUser(user);
    setIsEdit(true);
    setErrors({});
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEdit(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEdit(false);
    setErrors({});
  };

  return (
    <div className="profile-wrapper">
      {/* Sidebar Section */}
      <div className="profile-sidebar">
        <div className="sidebar-content">
          <div className="avatar-container">
            <img
              src={user.avatar}
              alt="Profile Avatar"
              className="avatar-image"
            />
            {isEdit && (
              <label className="camera-overlay">
                <Camera size={24} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
          <div className="avatar-info">
            <h2 className="avatar-name">
              {user.firstName} {user.lastName}
            </h2>
            <p className="avatar-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="profile-main">
        {/* Header */}
        <div className="profile-header">
          <div className="header-left">
            <h1 className="header-title">Profile Settings</h1>
            <p className="header-subtitle">Manage your account information</p>
          </div>
          <div className="header-right">
            {!isEdit ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                <Edit2 size={16} />
                Edit
              </button>
            ) : (
              <>
                <button className="btn btn-success" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Forms Content */}
        <div className="profile-forms">
          {/* Personal Information */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-row">
              <InputField
                label="First Name"
                name="firstName"
                value={user.firstName}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>

            {(errors.firstName || errors.lastName) && (
              <div className="error-message">
                {errors.firstName || errors.lastName}
              </div>
            )}

            <div className="form-row">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={user.email}
                edit={isEdit}
                readOnly={true}
                onChange={handleInputChange}
              />
              <InputField
                label="Contact Number"
                name="contact"
                value={user.contact}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="10-digit number"
              />
            </div>

            {errors.contact && (
              <div className="error-message">{errors.contact}</div>
            )}

            <div className="form-row">
              <InputField
                label="Date of Birth"
                name="dob"
                type="date"
                value={user.dob}
                edit={isEdit}
                onChange={handleInputChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                value={user.gender}
                edit={isEdit}
                onChange={handleInputChange}
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />
            </div>

            <div className="form-full">
              <TextareaField
                label="Bio"
                name="bio"
                value={user.bio}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && <div className="error-message">{errors.bio}</div>}
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h3 className="section-title">Location Information</h3>

            <div className="form-row">
              <InputField
                label="City"
                name="city"
                value={user.city}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Enter city"
              />
              <InputField
                label="State"
                name="state"
                value={user.state}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Enter state"
              />
            </div>

            <div className="form-row">
              <InputField
                label="Pincode"
                name="pincode"
                value={user.pincode}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="6-digit pincode"
              />
              <InputField
                label="Country"
                name="country"
                value={user.country}
                edit={isEdit}
                onChange={handleInputChange}
                placeholder="Enter country"
              />
            </div>

            {errors.pincode && (
              <div className="error-message">{errors.pincode}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;