import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../App';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import request from '../utils/request';

function Resigter() {
    const [name, setName] = useState('');
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
    const handleResigter = async () => {
        // gọi api ko dùng axios
        await setIsLoading(true);
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

                <LoadingButton
                    id="submit"
                    variant="contained"
                    fullWidth
                    loading={isLoading}
                    startIcon={<HowToRegIcon></HowToRegIcon>}
                    loadingPosition="start"
                    onClick={handleResigter}
                    sx={{ fontWeight: '600', color: 'white', fontFamily: 'monospace', fontSize: '20px' }}
                >
                    Đăng ký
                </LoadingButton>
                <Snackbar
                    open={openAlert}
                    autoHideDuration={2000}
                    onClose={handleCloseAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ top: '60px!important' }}
                >
                    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                        Đăng ký không thành công! Vui lòng thử lại!!!
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}

export default Resigter;
