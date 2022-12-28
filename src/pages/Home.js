import { useState, useRef, useEffect, useContext } from 'react';
import request from '../utils/request';
import { Avatar, Box, CircularProgress, Stack, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { CurrentUserContext } from '../App';
import socketIOClient from 'socket.io-client';
import { Container, padding } from '@mui/system';
import Posts from '../components/Posts/Posts';

function Home() {
    const socketRef = useRef();
    const [posts, setPosts] = useState([]);
    const [postToSend, setPostToSend] = useState('');
    const [isLoading, setIsloading] = useState(false);
    const { currentUser } = useContext(CurrentUserContext);

    useEffect(() => {
        setIsloading(true);
        request
            .get('/posts')
            .then((res) => {
                setPosts(res.data.data.posts);
                setIsloading(false);
            })
            .catch((e) => console.log(e));
    }, []);
    // console.log('posst nè');

    useEffect(() => {
        //  console.log('gọi lại hàm khởi tạo socket');
        socketRef.current = socketIOClient('https://whats-the-foxs.onrender.com');
        socketRef.current.on('sendDataServer', (data) => {
            // console.log(data);
            setPosts((prev) => [data, ...prev]);
        }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleSendPost = () => {
        const token = localStorage.getItem('token');
        // console.log('gọi hàm gửi bài viết', postToSend);
        if (postToSend.trim() !== '' && token !== null) {
            // console.log('guwir');
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
        <>
            <Container
                direction="row"
                sx={{ display: { xs: 'none', md: 'block' }, position: 'fixed', top: '120px', width: '30%' }}
            >
                <>
                    {!currentUser || (
                        <Avatar
                            alt="concao"
                            src={
                                currentUser.avatar ||
                                'https://toigingiuvedep.vn/wp-content/uploads/2021/11/hinh-anh-meo-bua-buon-cuoi-le-luoi.jpg'
                            }
                            sx={{ width: '220px', height: '220px' }}
                        />
                    )}
                </>
            </Container>
            <Stack direction="row" sx={{ display: 'flex', paddingTop: '85px' }}>
                <Container sx={{ flex: '30', width: '30%', display: { xs: 'none', md: 'block' } }}></Container>
                <Container sx={{ flex: '40', width: '40%' }}>
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
                                        sx={{
                                            overflowWrap: 'break-word',
                                            '& .MuiInputBase-input': {
                                                overflowWrap: 'break-word',
                                            },
                                        }}
                                        onKeyPress={handleKeypress}
                                    />

                                    <button style={{ backgroundColor: 'unset' }}>
                                        <SendIcon color="success" onClick={handleSendPost} />
                                    </button>
                                </Box>
                            )}
                        </>
                        <>
                            {!isLoading || (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </>
                        <Posts currentUser={currentUser} posts={posts} setPosts={setPosts}></Posts>
                    </Stack>
                </Container>
                <Container sx={{ flex: '30', width: '30%', display: { xs: 'none', md: 'block' } }}></Container>
            </Stack>
        </>
    );
}

export default Home;
