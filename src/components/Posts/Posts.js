import { memo } from 'react';
import Post from './Post';

function Posts({ posts, currentUser, setPosts }) {
    return (
        <>
            {posts.map((post) => {
                console.log('rerender');
                return (
                    <Post
                        key={post._id || post.content}
                        post={post}
                        currentUser={currentUser}
                        posts={posts}
                        setPosts={setPosts}
                    ></Post>
                );
            })}
        </>
    );
}

export default memo(Posts);
