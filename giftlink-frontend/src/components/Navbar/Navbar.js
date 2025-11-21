import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function NavbarComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, setIsLoggedIn, userName,setUserName } = useAppContext();

    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');
        if (authTokenFromSession) {
            if (isLoggedIn && nameFromSession) {
                setUserName(nameFromSession);
            }
        } else {
            sessionStorage.removeItem('auth-token');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('email');
            setIsLoggedIn(false);
            setUserName('');
            navigate('/app/login', { state: { from: location.pathname } });
        }
    }, [isLoggedIn, setIsLoggedIn, setUserName, navigate, location.pathname]);

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
