import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import User from "../User/User";
import { useSelector } from "react-redux";
import axios from "axios";

const FollowersCard = () => {
  const { user } = useSelector((state) => state.auth.data);
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await axios.get("/api/user/");
        setPersons(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPersons();
  }, []);
  return (
    <div className="FollowersCard">
      <h3>People You may know</h3>

      {persons.map((person, id) =>
        person._id !== user._id ? <User person={person} key={id} /> : null
      )}
    </div>
  );
};

export default FollowersCard;
