import React, { useState } from 'react';
import './LoginPage.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
function LoginPage() {

    //insert code here to create useState hook variables for email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // insert code here to create handleLogin function and include console.log
    const handleLogin = async () => {
        console.log("Inside handleLogin function");
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
                    <Card className="auth-card">
                        <Card.Body>
                            <h2 className="text-center mb-4">Log in to GiftLink</h2>

                            {/* insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                            <Stack direction="vertical" gap={3}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Form.Group>
                                {/* insert code here to create a button that performs the `handleLogin` function on click */}
                                <Stack direction="horizontal" gap={2} className="mt-3">
                                    <Button variant="primary" onClick={handleLogin}>Log in</Button>
                                    
                                    <div className="ms-auto align-middle">
                                        <p className="mb-0">Not a member yet? <a href="/app/register">Register</a></p>
                                    </div>
                                </Stack>
                            </Stack>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    )//end of return
}

export default LoginPage;
