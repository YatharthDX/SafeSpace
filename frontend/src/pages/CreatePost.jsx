import React, { useState } from "react";
import { FaImage, FaMicrophone } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { BsTag } from "react-icons/bs";
import "../css/CreatePost.css";
import Navbar2 from "../components/Public/navbar2";
import { createPost, classifyText, classifySeverity } from "../api/posts";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../chat-services/pyapi";
import { jwtDecode } from "jwt-decode"; // Import the library

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [severityTag, setSeverityTag] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Available tags
  const availableTags = [
    "anxiety",
    "motivation",
    "stress",
    "academic",
    "social",
    "relationships",
    "family",
    "health",
    "career",
    "work-life balance",
    "self-care",
  ];

  // Handle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle image selection with preview generation
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Generate a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission including direct image inclusion in the post data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Basic validation
      if (!title.trim()) {
        setError("Please enter a title");
        setIsSubmitting(false);
        return;
      }

      if (!content.trim()) {
        setError("Please enter some content");
        setIsSubmitting(false);
        return;
      }

      if (content.trim().length < 10) {
        setError("Content must be at least 10 characters long");
        setIsSubmitting(false);
        return;
      }

      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setError("Please log in to create a post");
        setIsSubmitting(false);
        return;
      }

      // Check for hate speech in content and title
      const contentClassification = await classifyText({ text: content });
      if (contentClassification === "HATE") {
        setError("Please refrain from using hate speech in your post");
        setIsSubmitting(false);
        return;
      }
      const titleClassification = await classifyText({ text: title });
      if (titleClassification === "HATE") {
        setError("Please refrain from using hate speech in your title");
        setIsSubmitting(false);
        return;
      }

      // Create post data with the image field if available
      const postData = {
        title,
        content,
        author_id: currentUser._id,
        author: currentUser.name,
        relevance_tags: selectedTags,
        severity_tag: (await classifySeverity({ text: content })) || "medium", // Default to medium if not set
        image: imagePreview || null, // Include image if one is selected
      };

      // Create the post directly with the image field
      await createPost(postData);

      // Reset form and navigate to home
      setTitle("");
      setContent("");
      setSelectedTags([]);
      setSeverityTag("");
      setImageFile(null);
      setImagePreview(null);
      navigate("/home");
    } catch (err) {
      // More specific error handling
      if (err.response?.status === 401) {
        setError("Please log in to create a post");
      } else {
        setError(err.message || "Failed to create post. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const role = jwtDecode(localStorage.getItem("token")).role;
  console.log(role);

  return (
    <div className="create-post-page">
      <Navbar2 />
      <div className="create-post-content">
        <div className="create-post-container">
          {/* Header */}
          <div className="create-post-header">
            <button className="back-button" onClick={() => navigate("/home")}>
              <IoMdArrowBack />
            </button>
            <h2>Create Post</h2>
          </div>

          <div className="create-post-body">
            {/* Post Form */}
            <div className="post-form-section">
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <input
                  type="text"
                  className="post-title-input"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <div className="post-content-container">
                  <textarea
                    className="post-content-input"
                    placeholder="How are you feeling....."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>

                  <div className="post-media-actions">
                    {role !== "student" && (
                      <label className="media-button">
                        <FaImage />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                )}

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
                  <button
                    type="submit"
                    className="post-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
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
                    className={`tag-item ${
                      selectedTags.includes(tag) ? "selected" : ""
                    }`}
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
