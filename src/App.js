import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import { publicRoutes } from './routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import request from './utils/request';
import Protected from './routes/Protected';
import Home from './pages/Home';

const orangeTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#ff9e38',
        },
        secondary: {
            main: '#3898ff',
        },
        warning: {
            main: '#fcff38',
        },
    },
});

export const CurrentUserContext = createContext();

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // get current user
    useEffect(() => {
        const token = localStorage.getItem('token');
        //console.log('rerender');
        request
            .get('/auth', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => setCurrentUser(res.data.data.user))
            .catch((e) => console.log(e));
    }, []);

    //console.log('hello', currentUser);
    return (
        <Router>
            <div className="App">
                <CurrentUserContext.Provider value={{ currentUser: currentUser, setCurrentUser: setCurrentUser }}>
                    <ThemeProvider theme={orangeTheme}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <Header />
                                        <Home />
                                    </>
                                }
                            />
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Protected isLoggedIn={!!currentUser}>
                                                <Header />
                                                <Page />
                                            </Protected>
                                        }
                                    />
                                );
                            })}
                        </Routes>
                    </ThemeProvider>
                </CurrentUserContext.Provider>
            </div>
        </Router>
    );
}

export default App;
