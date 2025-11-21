import React, { useEffect, useState } from 'react';
//Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import { urlConfig } from '../../config.js';
//Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
import { useAppContext } from '../../context/AuthContext.js';
//Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.
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

    //insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    //Do these tasks inside the RegisterPage function, after the useStates definition
    //Task 4: Include a state for error message.
    const [showErr, setShowErr] = useState(''); 
    //Task 5: Create a local variable for `navigate` and `setIsLoggedIn`.
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsLoggedIn } = useAppContext();
    
    // Get the intended destination from location state, default to '/app'
    const from = location.state?.from || '/app';

    useEffect(() => {
        if (!authToken) {
            navigate('/app/register');
            console.log('No authentication token found');
        }
    }, []);
    
    // insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            //Task 6: Set method
            method: 'POST',
            //Task 7: Set headers
            headers: {
                'Content-Type': 'application/json',
            },
            //Task 8: Set body to send user details
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        });

        // Step 2 - Task 1
        const jsonData = await response.json();
        console.log('jsonData: ', jsonData);
        console.log('error: ', jsonData.error);

        // Step 2 - Task 2
        if (jsonData.authtoken) {
            sessionStorage.setItem('auth-token', jsonData.authToken);
            sessionStorage.setItem('name', firstName);
            sessionStorage.setItem('email', email);
            // Step 2 - Task 3
            setIsLoggedIn(true);
            // Step 2 - Task 4
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

                            {/* insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                            <Stack direction="vertical" gap={3}>
                                {/* Show error message to user if registration fails */}
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
                                {/* insert code here to create a button that performs the `handleRegister` function on click */}
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
    ); //end of return
}

export default RegisterPage;
