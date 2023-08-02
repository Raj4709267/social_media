import React, { useEffect } from "react";
import axios from "axios";
import { baseURL } from "../../Config/CommonConfig";
import ImageUpload from "../PostForm/UploadImage";

const Dashboard = () => {
  const handlePostSubmit = (post) => {
    // Here, you can implement the logic to send the post content and image to your backend server or wherever you want to store the posts.
    axios
      .post(`${baseURL}/post`, post)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handlePostSubmit();
  }, []);
  return (
    <div>
      <button>Posts</button>
      <ImageUpload />
    </div>
  );
};

export default Dashboard;
