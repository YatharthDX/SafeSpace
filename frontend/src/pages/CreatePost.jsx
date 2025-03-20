import React, { useState } from "react";
import { FaImage, FaMicrophone } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { BsTag } from "react-icons/bs";
import "../css/CreatePost.css";
import Navbar2 from "../components/Public/navbar2";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // Available tags
  const availableTags = [
    "tag 1", "tag 2", "tag 3", "tag 4", "tag 5",
    "tag 6", "tag 7", "tag 8", "tag 9"
  ];

  // Handle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create post object
    const newPost = {
      author: "Current User", // Would normally come from auth context
      time: new Date().toLocaleString(),
      title,
      content,
      tags: selectedTags
    };

    console.log("New post:", newPost);
    // Here you would typically send this to your API

    // Reset form
    setTitle("");
    setContent("");
    setSelectedTags([]);
  };

  return (
    <div className="create-post-page">
      <Navbar2 />
      <div className="create-post-content">
        <div className="create-post-container">
          {/* Header */}
          <div className="create-post-header">
            <button className="back-button">
              <IoMdArrowBack />
            </button>
            <h2>Create Post</h2>
          </div>

          <div className="create-post-body">
            {/* Post Form */}
            <div className="post-form-section">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="post-title-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="post-content-container">
                  <textarea
                    className="post-content-input"
                    placeholder="How are you feeling....."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>

                  <div className="post-media-actions">
                    <button type="button" className="media-button">
                      <FaImage />
                    </button>
                    <button type="button" className="media-button">
                      <FaMicrophone />
                    </button>
                  </div>
                </div>

                {/* Selected Tags Display */}
                <div className="selected-tags-section">
                  <h4>Added Tags</h4>
                  <div className="selected-tags-container">
                    {selectedTags.map((tag, index) => (
                      <span key={index} className="selected-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="post-submit-container">
                  <button type="submit" className="post-submit-button">
                    Post
                  </button>
                </div>
              </form>
            </div>

            {/* Tags Section */}
            <div className="tags-section">
              <div className="tags-header">
                <BsTag />
                <h3>Add Tags</h3>
              </div>

              <div className="tags-list">
                {availableTags.map((tag, index) => (
                  <div
                    key={index}
                    className={`tag-item ${selectedTags.includes(tag) ? "selected" : ""}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
