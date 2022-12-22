import { useState, useRef, useEffect, useContext } from 'react';
import request from '../utils/request';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { CurrentUserContext } from '../App';

import socketIOClient from 'socket.io-client';

function Home() {
    const socketRef = useRef();
    const [posts, setPosts] = useState([]);
    const [postToSend, setPostToSend] = useState('');
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        request
            .get('/posts')
            .then((res) => setPosts(res.data.data.posts))
            .catch((e) => console.log(e));
    }, []);
    console.log('posst nè');

    useEffect(() => {
        console.log('gọi lại hàm khởi tạo socket');
        socketRef.current = socketIOClient('https://whats-the-fox.onrender.com');
        socketRef.current.on('sendDataServer', (data) => {
            console.log(data);
            setPosts((prev) => [data, ...prev]);
        }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleSendPost = () => {
        const token = localStorage.getItem('token');
        console.log('gọi hàm gửi bài viết', postToSend);
        if (postToSend.trim() !== '' && token !== null) {
            console.log('guwir');
            const msg = {
                content: postToSend,
                token: token,
            };
            socketRef.current.emit('sendDataClient', msg);

            setPostToSend('');
        }
    };

    return (
        <>
            <div style={{ overflow: 'auto', height: 450, width: 700, margin: '0 auto' }}>
                {posts.map((post) => (
                    <div key={post._id || post.content} style={{ backgroundColor: '#ccc', margin: 10 }}>
                        <div style={{ fontWeight: 700 }}>
                            <img
                                src={
                                    post.author.avatar ||
                                    'https://toigingiuvedep.vn/wp-content/uploads/2021/11/hinh-anh-meo-bua-buon-cuoi-le-luoi.jpg'
                                }
                                alt="avt"
                                style={{ width: 20, height: 20 }}
                            ></img>
                            {post.author.name}
                        </div>
                        <div style={{ overflowWrap: 'break-word' }}>{post.content}</div>
                    </div>
                ))}
            </div>

            <>
                {!currentUser || (
                    <Box
                        position="fixed"
                        sx={{ display: 'flex', alignItems: 'flex-end', bottom: 20, right: 10, left: 10 }}
                    >
                        <TextField
                            id="input-with-sx"
                            label="What does the Fox say???"
                            variant="standard"
                            fullWidth
                            autoFocus
                            value={postToSend}
                            onChange={(e) => setPostToSend(e.target.value)}
                            autoComplete="off"
                            sx={{ overflowWrap: 'break-word' }}
                        />

                        <button style={{ backgroundColor: 'unset' }}>
                            <SendIcon color="success" onClick={handleSendPost} />
                        </button>
                    </Box>
                )}
            </>
        </>
    );
}

export default Home;
