import React, { useEffect } from "react";
import PostFeed from "../../Components/PostForm/PostFeed";
import PostFeedItem from "../../Components/PostFeedItem/PostFeedItem";

const Home = () => {
  const dummyPosts = [
    // Example post data
    {
      id: 1,
      text: "First post!",
      image: null,
      date: "2023-07-20 12:34 PM",
    },
    {
      id: 2,
      text: "Second post with an image!",
      image: null, // Add your image file or URL here
      date: "2023-07-20 01:20 PM",
    },
    // Add more posts as needed
  ];
  return (
    <div>
      <PostFeed />
      {/* {dummyPosts.map((post) => (
        <PostFeedItem key={post.id} post={post} />
      ))} */}
      {/* <Dashboard /> */}
    </div>
  );
};

export default Home;
