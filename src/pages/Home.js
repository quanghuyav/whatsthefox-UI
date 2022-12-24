import { useState, useRef, useEffect, useContext } from 'react';
import request from '../utils/request';
import { Avatar, Box, Button, Stack, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { CurrentUserContext } from '../App';

import socketIOClient from 'socket.io-client';
import { Container, padding } from '@mui/system';

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
    const handleKeypress = (e) => {
        //it triggers by pressing the enter key
        if (e.key === 'Enter') {
            handleSendPost();
        }
    };

    return (
        <Stack direction="row" sx={{ display: 'flex', backgroundColor: '#F5F6F7', paddingTop: '85px' }}>
            <Container sx={{ flex: '25', width: '25%', display: { xs: 'none', md: 'block' } }}></Container>
            <Container sx={{ flex: '50', width: '50%' }}>
                <Stack spacing={1} sx={{ display: 'flex' }}>
                    <>
                        {!currentUser || (
                            <Box
                                sx={{
                                    zIndex: 0,
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                }}
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
                                    onKeyPress={handleKeypress}
                                />

                                <button style={{ backgroundColor: 'unset' }}>
                                    <SendIcon color="success" onClick={handleSendPost} />
                                </button>
                            </Box>
                        )}
                    </>
                    {posts.map((post) => (
                        <Stack
                            spacing={1}
                            key={post._id || post.content}
                            sx={{ backgroundColor: 'white', padding: '10px !important', borderRadius: '12px' }}
                        >
                            <Stack direction="row" spacing={0.5}>
                                <Avatar
                                    alt="concao"
                                    src={
                                        post.author.avatar ||
                                        'https://toigingiuvedep.vn/wp-content/uploads/2021/11/hinh-anh-meo-bua-buon-cuoi-le-luoi.jpg'
                                    }
                                />

                                <Stack spacing={0.5}>
                                    <div style={{ fontWeight: 700, fontSize: '18px', color: '#3898ff' }}>
                                        {post.author.name}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#65676B' }}>{post.createdAt}</div>
                                </Stack>
                            </Stack>
                            <div style={{ overflowWrap: 'break-word' }}>{post.content}</div>
                        </Stack>
                    ))}
                </Stack>
            </Container>
            <Container sx={{ flex: '25', width: '25%', display: { xs: 'none', md: 'block' } }}></Container>
        </Stack>
    );
}

export default Home;
