import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";

const ProfileForm = ({ modelClose }) => {
  const { user } = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    currentUserId: user._id,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  //Event handler for updating state on form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Event handler for file input changes
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      event.target.name === "profileImg"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let UserData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
      await uploadimg(data);
    }
    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("file", coverImage);
      // setFormData({ ...formData, coverPicture: fileName });
      UserData.coverPicture = fileName;
      await uploadimg(data);
    }
    await updateUser(UserData);
    setProfileImage(null);
    setCoverImage(null);
  };

  //upload image api
  const uploadimg = async (data) => {
    try {
      await axios.post("/api/upload/", data);
    } catch (error) {
      console.log(error);
    }
  };

  //update user api
  const updateUser = async (data) => {
    try {
      const response = await axios.put(`/api/user/${user?._id}`, formData);
      dispatch(logIn(response.data));
      modelClose();
      reset();
    } catch (error) {
      console.log(error);
      modelClose();
    }
  };

  //reset
  const reset = () => {
    setFormData({
      currentUserId: user._id,
    });
    // desc.current.value = "";
  };

  return (
    <>
      <form className="infoForm" onSubmit={handleSubmit}>
        <h3>Profile Info</h3>
        <div>
          <input
            type="text"
            className="infoInput"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            type="text"
            className="infoInput"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="worksAt"
            value={formData.worksAt}
            placeholder="Works At"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="livesin"
            placeholder="Lives In"
            value={formData.livesin}
            onChange={handleChange}
          />
          <input
            type="password"
            className="infoInput"
            name="password"
            placeholder="Updated Password"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            className="infoInput"
            name="relationship"
            placeholder="Relatinship Status"
            value={formData.relationship}
            onChange={handleChange}
          />
        </div>
        <div>
          Profile Photo
          <input type="file" name="profileImg" onChange={handleFileChange} />
          Cover Photo
          <input type="file" name="coverImg" onChange={handleFileChange} />
        </div>
        <button type="submit" className="button infoButton ">
          Update
        </button>
      </form>
    </>
  );
};

export default ProfileForm;
