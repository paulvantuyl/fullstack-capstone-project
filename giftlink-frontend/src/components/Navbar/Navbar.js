import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function NavbarComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
    
    // Sync the logged in state and username with the session storage
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        
        if (authTokenFromSession) {
            // If we have a token, sync the logged in state
            if (!isLoggedIn) {
                setIsLoggedIn(true);
            }
            // Set username if we have it
            if (nameFromSession && nameFromSession !== userName) {
                setUserName(nameFromSession);
            }
        } else {
            // Clear state if no token is found
            if (isLoggedIn) {
                setIsLoggedIn(false);
            }
            if (userName) {
                setUserName('');
            }
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName, userName]);
    
    // Separate effect to handle redirects when token is missing on protected routes
    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const isPublicPage = location.pathname.includes('/login') ||
            location.pathname.includes('/register') ||
            location.pathname.includes('/app') ||
            location.pathname === '/';

        // Only redirect if there's no token and we're on a protected route
        if (!authTokenFromSession && !isPublicPage) {
            navigate('/app/login', { state: { from: location.pathname } });
        }
    },[location.pathname, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('email');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app', { state: { from: location.pathname } });
    }

    const profileSection = () => {
        navigate('/app/profile');
    }

    return (
        <Navbar expand="lg" className="navbar bg-body-tertiary">
            <Container>
                <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>GiftLink</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => {
                            navigate('/home.html');
                            window.location.reload();
                        }}>Home</Nav.Link>
                        <Nav.Link onClick={() => navigate('/app')}>Gifts</Nav.Link>
                        <Nav.Link onClick={() => navigate('/app/search')}>Search</Nav.Link>
                    </Nav>

                    <Form className="d-flex">
                        {isLoggedIn ? (
                            <>
                                <Button variant="link me-2" onClick={profileSection}>
                                    Welcome, {userName}
                                </Button>
                                <Button variant="outline-primary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline-primary me-2" onClick={() => navigate('/app/login')}>
                                    Login
                                </Button>
                                <Button variant="outline-primary" onClick={() => navigate('/app/register')}>
                                    Register
                                </Button>
                            </>
                        )}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
