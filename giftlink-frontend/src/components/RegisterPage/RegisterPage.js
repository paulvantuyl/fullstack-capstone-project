import React, { useEffect, useState } from 'react';
import { urlConfig } from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const authToken = sessionStorage.getItem('auth-token');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErr, setShowErr] = useState(''); 
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn } = useAppContext();
    
    // Get the intended destination from location state, default to '/app'
    const from = location.state?.from || '/app';
    
    const handleRegister = async () => {
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
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', email);
            setIsLoggedIn(true);
            // Redirect to the intended destination or '/app' if none
            navigate(from);
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
                            <Stack direction="vertical" gap={3}>
                                {showErr && (
                                    <Alert variant="danger">{showErr}</Alert>
                                )}
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
                                    <Button variant="primary" onClick={handleRegister}>Register</Button>
                                    <div className="ms-auto align-middle">
                                        <p className="mb-0">Already a member? <a href="/app/login">Login</a></p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
