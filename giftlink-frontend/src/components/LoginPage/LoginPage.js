import React, { useState } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

import './LoginPage.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-bootstrap/Fade';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErr, setShowErr] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn } = useAppContext();
    const bearerToken = sessionStorage.getItem('bearer-token');

    const handleLogin = async (e) => {
        e.preventDefault();
        // Get the intended destination from location state, default to '/app'
        const from = location.state?.from || '/app';
        console.log('from: ', from);

        console.log("Inside handleLogin function");
        setShowErr('');
        
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const jsonData = await response.json();
            console.log('error: ', jsonData.error);

            if (jsonData.authtoken) {
                sessionStorage.setItem('auth-token', jsonData.authtoken);
                sessionStorage.setItem('email', email);
                if (jsonData.userName) {
                    sessionStorage.setItem('name', jsonData.userName);
                }
                if (jsonData.firstName) {
                    sessionStorage.setItem('firstName', jsonData.firstName);
                }
                if (jsonData.lastName) {
                    sessionStorage.setItem('lastName', jsonData.lastName);
                }
                setIsLoggedIn(true);
                // Redirect to the intended destination or '/app' if none
                navigate(from, { replace: true });
            } else {
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                setShowErr(jsonData.error || 'Incorrect email or password. Please try again.');
                setTimeout(() => {
                    setShowErr('');
                }, 4000);
            }
        } catch (error) {
            console.log("Error fetching details: " + error.message);
            setShowErr('An error occurred. Please try again.');
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                    <Card className="auth-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Log in to GiftLink</h2>
                            <Stack direction="vertical" gap={3}>
                                <Form onSubmit={handleLogin}>
                                    <Stack direction="vertical" gap={3}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" value={email} onChange={(error) => setEmail(error.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" value={password} onChange={(error) => setPassword(error.target.value)} />
                                        </Form.Group>
                                        <Fade in={showErr}>
                                            <div>
                                                {showErr && (
                                                    <Alert variant="danger" className="text-center">
                                                        {showErr}
                                                    </Alert>
                                                )}
                                            </div>
                                        </Fade>
                                        <Stack direction="horizontal" gap={2} className="mt-3">
                                            <Button variant="primary" type="submit">Log in</Button>
                                            <div className="ms-auto align-middle">
                                                <p className="mb-0">Not a member yet? <Nav.Link as={NavLink} to="/app/register">Register</Nav.Link></p>
                                            </div>
                                        </Stack>
                                    </Stack>
                                </Form>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}

export default LoginPage;
