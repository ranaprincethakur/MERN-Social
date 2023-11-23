import PostModel from "../Modals/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Modals/userModel.js";

//Create new Post
export const createPost = async (req, res) => {
  try {
    const newPost = new PostModel(req.body);
    await newPost.save();
    res.status(200).send({
      success: true,
      message: "Post Created",
      newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while posting",
      error,
    });
  }
};

//get a post

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostModel.findById(id);
    if (post) {
      res.status(200).send({
        success: true,
        message: "Post found",
        post,
      });
    } else if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getiing post",
    });
  }
};

//update a post

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send({
        success: true,
        message: "Post updated successfully",
      });
    } else {
      res.status(403).send({
        status: false,
        message: "Action forbidden",
      });
    }
  } catch (error) {
    res.send(500).send({
      success: false,
      message: "Error while updating post",
      error,
    });
  }
};

//Delete a post

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).send({
        success: true,
        message: "Post deleted successfully",
      });
    } else {
      res.status(403).send({
        success: false,
        message: "Action forbidden",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting post",
      error,
    });
  }
};

//like/ dislike post

export const likePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;

    const post = await PostModel.findById(id);
    const user = await UserModel.findById(userId);

    if (!post.likes.includes(userId) && user) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).send({
        success: true,
        message: "Post liked",
      });
    } else if (post.likes.includes(userId) && user) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).send({
        success: true,
        message: "Post Unliked",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Action Forbidden",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while like/dislike",
    });
  }
};

//Get Timeline post

export const getTimelinePosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
        },
      },
    ]);
    const totalPosts = currentUserPosts.concat(
      ...followingPosts[0].followingPosts
    );
    totalPosts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).send({
      success: true,
      totalPosts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting timeline",
      error,
    });
  }
};
