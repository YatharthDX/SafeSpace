import React from 'react';

const PostsList = ({ posts }) => {
    return (
        <div className="posts-section">
            {posts.length === 0 ? (
                <div className="empty-state">no posts yet</div>
            ) : (
                <div className="posts-list">
                    {posts.map((post) => (
                        <div key={post.id} className="post-item">
                            {post.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostsList; 