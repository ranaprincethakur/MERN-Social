import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import { Modal } from "antd";
import ProfileForm from "../profileModal/ProfileForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";
import { posts } from "../../features/postSlice";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [profileUser, setProfileUser] = useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth.data);
  const profileUserId = params.id;
  const modelClose = () => {
    modalOpened ? setModalOpened(false) : setModalOpened(true);
  };

  //handleLogOut
  const handleLogOut = () => {
    dispatch(posts(null));
    dispatch(logIn(null));
  };

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
      } else {
        try {
          const response = await axios.get(`/api/user/${profileUserId}`);
          const profileUser = response?.data?.user;
          setProfileUser(profileUser);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchProfileUser();
  }, [user, profileUserId]);
  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>Profile Info</h4>
        {user?._id === profileUserId && (
          <div>
            <UilPen
              width="2rem"
              height="1.2rem"
              onClick={() => setModalOpened(true)}
            />
            <Modal onCancel={modelClose} footer={null} open={modalOpened}>
              <ProfileForm modelClose={modelClose} />
            </Modal>
          </div>
        )}
      </div>

      <div className="info">
        <span>
          <b>Status </b>
        </span>
        <span>{profileUser?.relationship}</span>
      </div>

      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{profileUser?.livesin}</span>
      </div>

      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>{profileUser?.worksAt}</span>
      </div>
      {profileUser?._id === user?._id && (
        <button className="button lg-button" onClick={handleLogOut}>
          Logout
        </button>
      )}
    </div>
  );
};

export default InfoCard;
