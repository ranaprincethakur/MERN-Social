import React, { useEffect, useState } from "react";
import "./Posts.css";
import Post from "../post/Post";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { posts } from "../../features/postSlice";
import { useParams } from "react-router-dom";

const Posts = () => {
  let PostsData = useSelector((state) => state.post.data);
  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector((state) => state.auth.data);
  useEffect(() => {
    timeline();
  }, []);
  //to get timeline posts
  const timeline = async () => {
    try {
      const response = await axios.get(`/api/post/${user?._id}/timeline`);
      const { totalPosts } = response.data;
      dispatch(posts(totalPosts));
    } catch (error) {
      console.log(error);
    }
  };
  if (!PostsData) return "No Posts";
  if (params.id)
    PostsData = PostsData.filter((post) => post.userId === params.id);
  return (
    <div className="Posts">
      {PostsData?.map((post, id) => (
        <Post key={id} data={post} />
      ))}
    </div>
  );
};

export default Posts;
