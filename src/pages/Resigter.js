import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../App';
import request from '../utils/request';

function Resigter() {
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const handleResigter = async () => {
        // gọi api ko dùng axios
        var avatar;
        await fetch('https://randomfox.ca/floof')
            .then((res) => res.json())
            .then((res) => {
                avatar = res.image;
            })
            .catch((err) => {
                console.log('loi call api avatar fox', err);
            });

        await request
            .post('/auth/resigter', { name: name, email: userName, password: password, avatar: avatar })
            .then((res) => {
                const { token } = res.data.data;
                localStorage.setItem('token', token);
                setCurrentUser(res.data.data);
                navigate('/');
            })
            .catch((err) => console.log('loi', err));
    };

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Stack component={'form'} spacing={3} width={'50vw'} minWidth={300} sx={{}}>
                <Typography
                    color="secondary"
                    align="center"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: 24,
                        marginTop: '30px',
                    }}
                >
                    Đăng ký
                </Typography>
                <TextField
                    id="name-input"
                    fullWidth
                    label="Họ và tên"
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    id="username-input"
                    label="Tên đăng nhập"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setUserName(e.target.value)}
                />
                <TextField
                    id="password-input"
                    type={'password'}
                    fullWidth
                    label="Mật khẩu"
                    variant="outlined"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    id="submit"
                    variant="contained"
                    fullWidth
                    onClick={handleResigter}
                    sx={{ fontWeight: '600', color: 'white', fontFamily: 'monospace', fontSize: '20px' }}
                >
                    Đăng ký
                </Button>
            </Stack>
        </div>
    );
}

export default Resigter;
