import { Alert, Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import request from '../utils/request';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../App';
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };
    //  console.log(currentUser);

    const handleLogin = async () => {
        // gọi api dùng axios
        await setIsLoading(true);
        await request
            .post('/auth/login', { email: userName, password: password })
            .then((res) => {
                const { token } = res.data.data;
                localStorage.setItem('token', token);
                setCurrentUser(res.data.data);
                navigate('/');
            })
            .catch(handleOpenAlert);
        await setIsLoading(false);
    };

    return (
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', paddingTop: '85px' }}>
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
                <LoadingButton
                    id="submit"
                    variant="contained"
                    loading={isLoading}
                    loadingPosition="start"
                    startIcon={<LoginIcon></LoginIcon>}
                    fullWidth
                    sx={{ fontWeight: '600', color: 'white', fontFamily: 'monospace', fontSize: '20px' }}
                    onClick={handleLogin}
                >
                    Đăng nhập
                </LoadingButton>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={2000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ top: '60px!important' }}
                >
                    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                        Sai thông tin đăng nhập
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}

export default Login;
