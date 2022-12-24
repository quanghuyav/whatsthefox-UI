import { Button, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import request from '../utils/request';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../App';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    //  console.log(currentUser);

    const handleLogin = () => {
        // gọi api dùng axios
        request
            .post('/auth/login', { email: userName, password: password })
            .then((res) => {
                const { token } = res.data.data;
                localStorage.setItem('token', token);
                setCurrentUser(res.data.data);
                navigate('/');
            })
            .catch((err) => console.log('loi', err));
    };

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', height: '3000px' }}>
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
                    Đăng nhập
                </Typography>
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
                    sx={{ fontWeight: '600', color: 'white', fontFamily: 'monospace', fontSize: '20px' }}
                    onClick={handleLogin}
                >
                    Đăng nhập
                </Button>
            </Stack>
        </div>
    );
}

export default Login;
