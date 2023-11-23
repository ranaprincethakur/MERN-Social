import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { follow, unfollow } from "../../features/authSlice";
import { Link } from "react-router-dom";

const User = ({ person }) => {
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.data);
  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );
  const handleFollow = async () => {
    if (!following) {
      try {
        const response = await axios.put(`/api/user/${person._id}/follow`, {
          currentUserId: user._id,
        });
        console.log(response);
        if (response?.data?.success) {
          dispatch(follow(person?._id));
          setFollowing(true);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.put(`/api/user/${person._id}/unfollow`, {
          currentUserId: user._id,
        });
        if (response?.data?.success) {
          dispatch(unfollow(person?._id));
          setFollowing(false);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="follower">
      <div>
        <Link
          style={{ textDecoration: "none", color: "inherit" }}
          to={`/profile/${person?._id}`}
        >
          <img
            src={
              person?.profilePicture
                ? serverPublic + person?.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            alt=""
            className="followerImg"
          />
        </Link>
        <div className="name">
          <span>{person.firstname}</span>
          <span>{person.username}</span>
        </div>
      </div>
      <button
        className={
          following ? "button fc-button UnfollowButton" : "button fc-button "
        }
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
