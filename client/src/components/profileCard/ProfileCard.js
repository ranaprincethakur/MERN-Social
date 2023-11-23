import React, { useEffect, useState } from "react";
import "./profileCard.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { profile } from "../../features/authSlice";

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const params = useParams();
  const posts = useSelector((state) => state.post.data);
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    if (!profileUserId || profileUserId === user._id) {
      getUser(user._id);
      dispatch(profile(profileUser));
    } else if (profileUserId !== user) {
      getUser(profileUserId);
    }
  }, []);

  const getUser = async (id) => {
    try {
      const response = await axios.get(`/api/user/${id}`);

      setProfileUser(response?.data?.user);
    } catch (error) {
      console.log(error);
    }
  };

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={
            profileUser?.coverPicture
              ? serverPublic + profileUser.coverPicture
              : serverPublic + "defaultCover.jpg"
          }
          alt="Cover"
        />
        <img
          src={
            profileUser?.profilePicture
              ? serverPublic + profileUser.profilePicture
              : serverPublic + "defaultProfile.png"
          }
          alt="Profile"
        />
      </div>

      <div className="ProfileName">
        <span>
          {profileUser?.firstname} {profileUser?.lastname}
        </span>
        <span>
          {profileUser?.worksAt ? profileUser?.worksAt : "Write about yourself"}
        </span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{profileUser?.following.length}</span>
            <span>Followings</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{profileUser?.followers.length}</span>
            <span>Followers</span>
          </div>

          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>
                  {
                    posts?.filter((post) => post.userId === profileUser?._id)
                      .length
                  }
                </span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={`/profile/${profileUser?._id}`}
          >
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;
