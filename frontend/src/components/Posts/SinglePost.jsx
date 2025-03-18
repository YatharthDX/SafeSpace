// import React, { useState } from "react";
// import {
//   FaRegUser,
//   FaRegThumbsUp,
//   FaRegComment,
//   FaShare,
//   FaHeart,
//   FaRegHeart,
// } from "react-icons/fa";
// import "../../css/SinglePost.css";

// const SinglePost = ({ author, time, title, content, tags }) => {
//   const [liked, setLiked] = useState(false);

//   return (
//     <div className="post-container">
//       <div className="post-header">
//         <FaRegUser className="profile-icon" />
//         <h3 className="post-author">{author}</h3>
//       </div>
//       <p className="post-time">{time} ago</p>

//       <h2 className="post-title">{title}</h2>
//       <p className="post-content">{content}</p>

//       <div className="post-tags">
//         {tags.map((tag, index) => (
//           <span key={index} className="tag">
//             {tag}
//           </span>
//         ))}
//       </div>

//       <div className="post-actions">
//         <span className="action-icon" onClick={() => setLiked(!liked)}>
//           {liked ? <FaHeart color="black" /> : <FaRegHeart />}
//         </span>
//         {/* <FaRegThumbsUp className="action-icon" /> */}
//         <FaRegComment className="action-icon" />
//         {/* <FaShare className="action-icon" /> */}
//       </div>
//     </div>
//   );
// };

// export default SinglePost;
import React, { useState } from "react";
import { FaRegUser, FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa";
import "../../css/SinglePost.css";

const SinglePost = ({ author, time, title, content, tags }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="post-container">
      {/* Header Section: Profile Icon, Author, Time */}
      <div className="post-header">
        <div className="post-info">
          <FaRegUser className="profile-icon" />
          <h3 className="post-author">{author}</h3>
          <p className="post-time">{time} ago</p>
        </div>

        {/* Tags at the Top Right */}
        <div className="post-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Post Content */}
      <h2 className="post-title">{title}</h2>
      <p className="post-content">{content}</p>

      {/* Post Actions (Bottom Left) */}
      <div className="post-actions">
        <span className="action-icon" onClick={() => setLiked(!liked)}>
          {liked ? <FaHeart color="black" /> : <FaRegHeart />}
        </span>
        <FaRegComment className="action-icon" />
      </div>
    </div>
  );
};

export default SinglePost;
