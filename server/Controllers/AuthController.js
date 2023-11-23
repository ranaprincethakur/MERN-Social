import UserModel from "../Modals/userModel.js";
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

//for new registration
export const registerUser = async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    // validations

    if (!username) {
      return res.send({
        success: false,
        message: "Username is required",
      });
    }
    if (!firstname) {
      return res.send({
        success: false,
        message: "Firstname is required",
      });
    }
    if (!lastname) {
      return res.send({
        success: false,
        message: "Lastname is required",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Password is required",
      });
    }

    //check user
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Username already taken",
      });
    }

    const hashedpass = await hashPassword(password);

    const newUser = new UserModel({
      username,
      password: hashedpass,
      firstname,
      lastname,
    });
    await newUser.save();
    res.status(200).send({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while registring",
    });
  }
};

// for login

export const UserLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check user
    const details = await UserModel.findOne({ username });
    if (!details) {
      return res.status(404).send({
        success: false,
        message: "User is not registered",
      });
    }

    const match = await comparePassword(password, details.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign(
      {
        username: details.username,
        id: details._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    if (match) {
      const { password, ...user } = details._doc;
      res.status(200).send({
        success: true,
        message: "User Login Successfully",
        user,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while login",
    });
  }
};
