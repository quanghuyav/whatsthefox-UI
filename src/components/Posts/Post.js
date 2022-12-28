import { Avatar, Button, Divider, IconButton, Popover, Stack, TextField, Typography } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { memo, useRef, useState } from 'react';
import request from '../../utils/request';

function Post({ post, currentUser, posts, setPosts }) {
    const handleDeletePost = async (post) => {
        const token = await localStorage.getItem('token');
        request
            .delete(`/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setPosts(posts.filter((item) => item !== post));
            })
            .catch('thất bại rồi');
    };

    const handleEditPost = async () => {
        const token = await localStorage.getItem('token');
        await request
            .put(
                `/posts/${postEdit._id}`,
                {
                    content: editElement.current.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => {
                setPosts(
                    posts.map((post) => {
                        if (post._id === postEdit._id) {
                            post.content = editElement.current.value;
                        }
                        return post;
                    }),
                );
            })
            .catch('thất bại rồi');
        handleClose();
    };
    // Hiện phần edit post
    const [anchorEl, setAnchorEl] = useState(null);
    const [postEdit, setPostEdit] = useState([]);

    const editElement = useRef();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    let date = new Date(post.createdAt);
    return (
        <Stack spacing={1} sx={{ backgroundColor: 'white', padding: '10px !important', borderRadius: '12px' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={0.5}>
                    <Avatar
                        alt="concao"
                        src={
                            post.author.avatar ||
                            'https://toigingiuvedep.vn/wp-content/uploads/2021/11/hinh-anh-meo-bua-buon-cuoi-le-luoi.jpg'
                        }
                    />

                    <Stack spacing={0.5}>
                        <div style={{ fontWeight: 700, fontSize: '18px', color: '#3898ff' }}>{post.author.name}</div>
                        <div style={{ fontSize: '12px', color: '#65676B' }}>{`${date.getDate()}/${
                            date.getMonth() + 1
                        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</div>
                    </Stack>
                </Stack>
                <>
                    {!currentUser || currentUser.userName !== post.author.email || (
                        <div>
                            <IconButton
                                color="secondary"
                                onClick={(event) => {
                                    setAnchorEl(event.currentTarget);
                                    setPostEdit(post);
                                }}
                            >
                                <EditIcon></EditIcon>
                            </IconButton>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Stack direction="row">
                                    <TextField
                                        sx={{ p: 1 }}
                                        defaultValue={postEdit.content}
                                        inputRef={editElement}
                                    ></TextField>
                                    <IconButton color="secondary" onClick={() => handleEditPost()}>
                                        <EditIcon></EditIcon>
                                    </IconButton>
                                </Stack>
                            </Popover>
                            <IconButton color="secondary" onClick={() => handleDeletePost(post)}>
                                <CloseIcon></CloseIcon>
                            </IconButton>
                        </div>
                    )}
                </>
            </Stack>
            <div style={{ overflowWrap: 'break-word' }}>{post.content}</div>
            <Divider light />
            <Stack spacing={1} direction="row">
                <Button
                    color="secondary"
                    sx={{
                        fontWeight: 600,
                        width: '30%',
                        fontSize: '14px',
                        textTransform: 'unset',
                    }}
                    variant="text"
                >
                    <ThumbUpOffAltIcon sx={{ marginRight: '5px' }} fontSize="small"></ThumbUpOffAltIcon>
                    <span>{'Thích'}</span>
                </Button>
                <Button
                    color="secondary"
                    sx={{
                        fontWeight: 600,
                        width: '40%',
                        fontSize: '14px',
                        textTransform: 'unset',
                    }}
                    variant="text"
                >
                    <ChatBubbleOutlineIcon sx={{ marginRight: '5px' }} fontSize="small"></ChatBubbleOutlineIcon>
                    <span>{'Bình luận'}</span>
                </Button>
                <Button
                    color="secondary"
                    sx={{
                        fontWeight: 600,
                        width: '30%',
                        fontSize: '14px',
                        textTransform: 'unset',
                    }}
                    variant="text"
                >
                    <MailOutlineIcon sx={{ marginRight: '5px' }} fontSize="small"></MailOutlineIcon>
                    <span>{'Gửi'}</span>
                </Button>
            </Stack>
        </Stack>
    );
}

export default memo(Post);
