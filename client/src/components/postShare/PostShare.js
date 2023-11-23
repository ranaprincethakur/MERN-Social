import React, { useState, useRef } from "react";
import "./PostShare.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  UilScenery,
  UilPlayCircle,
  UilLocationPoint,
  UilSchedule,
  UilTimes,
} from "@iconscout/react-unicons";
import { addpost } from "../../features/postSlice";

const PostShare = () => {
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const desc = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.data);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const params = useParams();
  const currentUser = params.id;

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target?.files[0];
      setImage(img);
    }
  };
  //on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      userId: user?._id,
      desc: desc.current.value,
    };
    if (image) {
      const data = new FormData();
      const filename = Date.now() + image.name;
      data.append("name", filename);
      data.append("file", image);
      newPost.image = filename;
      uploadimg(data);
    }
    upload(newPost);
    reset();
  };

  //upload post api
  const upload = async (data) => {
    try {
      const response = await axios.post("/api/post/", data);
      console.log(response);
      dispatch(addpost(response?.data?.newPost));
    } catch (error) {
      console.log(error);
    }
  };
  //upload image api
  const uploadimg = async (data) => {
    try {
      await axios.post("/api/upload", data);
    } catch (error) {
      console.log(error);
    }
  };

  //reset
  const reset = () => {
    setImage(null);
    desc.current.value = "";
  };

  return (
    <>
      {(!currentUser || currentUser === user?._id) && (
        <div className="PostShare">
          <img
            src={
              user?.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            alt=""
          />
          <div>
            <input
              type="text"
              placeholder="What's happening"
              ref={desc}
              required
            />
            <div className="postOptions">
              <div
                className="option"
                style={{ color: "var(--photo)" }}
                onClick={() => imageRef.current.click()}
              >
                <UilScenery />
                Photo
              </div>
              <div className="option" style={{ color: "var(--video)" }}>
                <UilPlayCircle />
                Video
              </div>{" "}
              <div className="option" style={{ color: "var(--location)" }}>
                <UilLocationPoint />
                Location
              </div>{" "}
              <div className="option" style={{ color: "var(--shedule)" }}>
                <UilSchedule />
                Shedule
              </div>
              <button className="button ps-button" onClick={handleSubmit}>
                Share
              </button>
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  name="myImage"
                  ref={imageRef}
                  onChange={onImageChange}
                />
              </div>
            </div>
            {image && (
              <div className="previewImage">
                <UilTimes
                  onClick={() => {
                    setImage(null);
                    imageRef.current.value = null;
                  }}
                />
                <img src={URL.createObjectURL(image)} alt="" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostShare;
