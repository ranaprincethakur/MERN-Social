import UserModel from "../Modals/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
//get a user
export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const details = await UserModel.findById(id);
    if (!details) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    if (details) {
      const { password, ...user } = details._doc;
      res.status(200).send({
        success: true,
        message: "User found",
        user,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error while getting user",
      error,
    });
  }
};

//update a user
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { currentUserId, currentUserAdminStatus, password } = req.body;

    if (password) {
      req.body.password = await hashPassword(password);
    }

    if (id === currentUserId || currentUserAdminStatus) {
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({
        success: true,
        message: "User Updated Successfully",
        user,
        token,
      });
    } else {
      res.status(403).send({
        success: false,
        message: "Access Denied!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating",
    });
  }
};

//Delete user account
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;
    if (currentUserId === id || currentUserAdminStatus) {
      await UserModel.findByIdAndDelete(id);

      res.status(200).send({
        success: true,
        message: "User Deleted Successfully",
      });
    } else {
      res.status(403).send({
        success: true,
        message: "Access Denied",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting account",
    });
  }
};

//Follow a user

export const followUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { currentUserId } = req.body;
    if (currentUserId === id) {
      return res.status(403).status({
        success: false,
        message: "Action Forbidden",
      });
    } else {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });

        res.status(200).send({
          success: true,
          message: "User Followed",
        });
      } else {
        res.status(403).send({
          success: false,
          message: "User already followed",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while following",
    });
  }
};

//unfollow a user

export const unFollowUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { currentUserId } = req.body;
    if (currentUserId === id) {
      return res.status(403).status({
        success: false,
        message: "Action Forbidden",
      });
    } else {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });

        res.status(200).send({
          success: true,
          message: "User Unfollowed",
        });
      } else {
        res.status(403).send({
          success: false,
          message: "User already Unfollowed",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while Unfollowing",
    });
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();

    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while getting all users",
    });
  }
};
