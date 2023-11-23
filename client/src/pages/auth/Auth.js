import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../img/logo.png";
import { useDispatch } from "react-redux";
import { logIn } from "../../features/authSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Auth = () => {
  const [isSignUp, setSignUp] = useState(true);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    password: "",
    confirmpass: "",
    username: "",
  });

  const [confirmPass, setConfirmPass] = useState(true);

  //handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        if (data.password === data.confirmpass) {
          const response = await axios.post("/api/auth/register", data);
          if (response?.data?.success) {
            resetForm();
            setSignUp(false);
            toast.success("User Registered");
          }
        } else {
          setConfirmPass(false);
        }
      } else {
        const response = await axios.post("/api/auth/login", data);
        dispatch(logIn(response?.data));
        toast.success("User Logged In");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //reset Form
  const resetForm = () => {
    setConfirmPass(true);
    setData({
      firstname: "",
      lastname: "",
      password: "",
      confirmpass: "",
      username: "",
    });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="Auth">
      {/* Left side */}
      <div className="a-left">
        <img src={Logo} alt="" />
        <div className="Webname">
          <h1>PR Media</h1>
          <h6>Expolre the ideas throughout the world</h6>
        </div>
      </div>

      {/* Right Side */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h3>{isSignUp ? "Sign Up" : "Login"}</h3>
          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
              />
            </div>
          )}

          <div>
            <input
              type="text"
              className="infoInput"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={data.username}
            />
          </div>
          <div>
            <input
              type="password"
              className="infoInput"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={data.password}
            />
            {isSignUp && (
              <input
                type="password"
                className="infoInput"
                name="confirmpass"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={data.confirmpass}
              />
            )}
          </div>
          <span
            style={{
              visibility: confirmPass ? "hidden" : "visible",
              color: "red",
              fontSize: "12px",
              alignSelf: "flex-end",
              marginRight: "5px",
            }}
          >
            *Confirm password is not same
          </span>
          <div>
            <span
              style={{ fontSize: "12px", cursor: "pointer", color: "blue" }}
              onClick={() => {
                setSignUp((prev) => !prev);
                resetForm();
              }}
            >
              {isSignUp
                ? "Already have an account. Login"
                : "Don't have an account! Signup"}
            </span>
          </div>
          <button className="button infoButton" type="Submit">
            {isSignUp ? "Signup" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
