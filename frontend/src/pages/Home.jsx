// import React from "react";
// import Navbar from "../components/Public/navbar";
// import SinglePost from "../components/Posts/SinglePost";

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <SinglePost
//         author="Single Sock"
//         time="3 hours"
//         title="4 exams in 3 days, I'm exhausted."
//         content="I'm completely drained. I've been studying non-stop..."
//         tags={["tag 3", "tag 8"]}
//       />
//     </div>
//   );
// };

// export default Home;
import React from "react";
import Navbar from "../components/Public/navbar";
import SinglePost from "../components/Posts/SinglePost";
import "../css/Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="home-container">
      <Navbar /> {/* Navbar remains at the top */}
      {/* Left Sidebar (Fixed) */}
      <aside className="left-sidebar">
        <h2>Popular Tags</h2>
        <div className="tags">
          {[
            "tag 1",
            "tag 2",
            "tag 3",
            "tag 4",
            "tag 5",
            "tag 6",
            "tag 7",
            "tag 8",
            "tag 9",
          ].map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <button className="create-post">+ Create Post</button>
      </aside>
      {/* Right Section (Scrollable Posts) */}
      {/* <main className="posts-section"> */}
      <div className="posts-container">
        <SinglePost
          author="Single Sock"
          time="3 hours"
          title="4 exams in 3 days, I'm exhausted."
          content="I'm completely drained. I've been studying non-stop..."
          tags={["tag 3", "tag 8"]}
        />
        <SinglePost
          author="Playful Raccoon"
          time="6 hours"
          title="us bhai us"
          content="Just chilling today..."
          tags={["tag 2"]}
        />
        <SinglePost
          author="Skipping Stone"
          time="17 hours"
          title="Feeling homesick."
          content="Ever since I came to college I miss my family..."
          tags={["tag 1"]}
        />
        <SinglePost
          author="Skipping Stone"
          time="17 hours"
          title="Feeling homesick."
          content="Ever since I came to college I miss my family..."
          tags={["tag 1"]}
        />
        {/* Add more <SinglePost /> components as needed */}
      </div>
      {/* </main> */}
    </div>
  );
};

export default Home;
