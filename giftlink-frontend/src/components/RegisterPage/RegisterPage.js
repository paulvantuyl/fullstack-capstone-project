import React, { useState } from 'react';
import { urlConfig } from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';

import './RegisterPage.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErr, setShowErr] = useState(''); 
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn } = useAppContext();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        // Get the intended destination from location state, default to '/app'
        const from = location.state?.from || '/app';
        console.log('from: ', from);
        
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            // Set method
            method: 'POST',
            // Set headers
            headers: {
                'Content-Type': 'application/json',
            },
            // Set body to send user details
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        const jsonData = await response.json();
        console.log('jsonData: ', jsonData);
        console.log('error: ', jsonData.error);

        if (jsonData.authtoken) {
            sessionStorage.setItem('auth-token', jsonData.authToken);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('name', firstName);
            if (jsonData.userName) {
                sessionStorage.setItem('name', jsonData.userName);
            }
            setIsLoggedIn(true);
            // Redirect to the intended destination or '/app' if none
            navigate(from, { replace: true });
        }
        if (jsonData.error) {
            setShowErr(jsonData.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                    <Card className="auth-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Register for GiftLink</h2>
                            <Card.Text className="text-center mb-4">Don't have an account? It's free to join!</Card.Text>
                            <Stack direction="vertical" gap={3}>
                                {showErr && (
                                    <Alert variant="danger">{showErr}</Alert>
                                )}
                                <Form onSubmit={handleRegister}>
                                    <Stack direction="vertical" gap={3}>
                                        <Form.Group controlId="firstName">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="lastName">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </Form.Group>
                                        <Stack direction="horizontal" gap={2} className="mt-3">
                                            <Button variant="primary" type="submit">Register</Button>
                                            <div className="ms-auto align-middle">
                                                <p className="mb-0">Already a member? <Nav.Link as={NavLink} to="/app/login">Login</Nav.Link></p>
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

export default RegisterPage;
