import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

export default function NavbarComponent() {
    const navigate = useNavigate();

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
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
