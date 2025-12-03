import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Fade from 'react-bootstrap/Fade';

const Profile = () => {
	const [userDetails, setUserDetails] = useState({});
	const [updatedDetails, setUpdatedDetails] = useState({});
	const {setUserName} = useAppContext();
	const [changed, setChanged] = useState('');
	const [editMode, setEditMode] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
        // Check for authentication and redirect if not authenticated
        const authtoken = sessionStorage.getItem('auth-token');
        
        if (!authtoken) {
            navigate('/app/login', { state: { from: location.pathname } });
        } else {
            fetchUserProfile();
        }
	}, [navigate, location.pathname]);

	const fetchUserProfile = async () => {
		try {
			const authtoken = sessionStorage.getItem('auth-token');

            // If no authtoken, don't proceed
            if (!authtoken) {
                return;
            }

			const email = sessionStorage.getItem('email');
			const firstName = sessionStorage.getItem('firstName') || '';
			const lastName = sessionStorage.getItem('lastName') || '';
			const name = sessionStorage.getItem('name') || '';
            
            const storedUserDetails = {
                firstName: firstName,
                lastName: lastName,
                name: name,
                email:email
            };

            setUserDetails(storedUserDetails);
            setUpdatedDetails(storedUserDetails);
		} catch (error) {
			console.error(error);
		}
	};

	const handleEdit = () => {
		setEditMode(true);
	};

	const handleInputChange = (e) => {
		setUpdatedDetails({
			...updatedDetails,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
        setChanged('');

		try {
			const authtoken = sessionStorage.getItem('auth-token');
			const email = sessionStorage.getItem('email');

			if (!authtoken || !email) {
				navigate('/app/login', { state: { from: location.pathname } });
				return;
			}

			const payload = { ...updatedDetails };
			const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${authtoken}`,
					'Content-Type': 'application/json',
					'email': email,
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
                const jsonData = await response.json();
				
                if (jsonData.user) {
                    if (jsonData.user.firstName) {
                        sessionStorage.setItem('firstName', jsonData.user.firstName);
                    }
                    if (jsonData.user.lastName) {
                        sessionStorage.setItem('lastName', jsonData.user.lastName);
                    }
                    const fullName = `${jsonData.user.firstName || ''} ${jsonData.user.lastName || ''}`.trim();
                    sessionStorage.setItem('name', fullName);
                    setUserName(fullName);

                    const updatedUserData = {
                        firstName: jsonData.user.firstName || '',
                        lastName: jsonData.user.lastName || '',
                        name: fullName,
                        email: jsonData.user.email || email
                    };

                    setUserDetails(updatedUserData);
                    setUpdatedDetails(updatedUserData);
                }
				
				setEditMode(false);
				// Display success message to the user
				setChanged('Profile updated successfully!');
				setTimeout(() => {
					setChanged('');
				}, 3000);

			} else {
                const errorData = await response.json();
                setChanged(errorData.error || 'Failed to update profile');
			}
		} catch (error) {
            setChanged(error.message);
			console.error(error);
		}
	};

	return (
		<Container className="mt-4">
			<Row>
				<Col xs={12} md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
					<Card>
						<Card.Body>
							{editMode ? (
								<Form onSubmit={handleSubmit}>
									<Stack direction="vertical" gap={3}>
										<Form.Group controlId="email">
											<Form.Label>Email</Form.Label>
											<Form.Control 
												type="email" 
												value={updatedDetails.email || ''} 
												disabled
												name="email"
											/>
										</Form.Group>
										<Form.Group controlId="firstName">
											<Form.Label>First name</Form.Label>
											<Form.Control 
												type="text"
												value={updatedDetails.firstName || ''}
												onChange={handleInputChange}
												name="firstName"
											/>
										</Form.Group>
										<Form.Group controlId="lastName">
											<Form.Label>Last name</Form.Label>
											<Form.Control
												type="text"
												value={updatedDetails.lastName || ''}
												onChange={handleInputChange}
												name="lastName"
											/>
										</Form.Group>
										<Stack direction="horizontal" gap={2} className="mt-3">
											<Button type="submit">Save</Button>
											<Button variant="outline-primary" onClick={() => setEditMode(false)}>Cancel</Button>
										</Stack>
									</Stack>

								</Form>
							) : (
								<Stack direction="vertical">
									<h3>Hi, {userDetails.name || `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim()}</h3>
									<Card.Text>Manage your GiftLink profile details.</Card.Text>
									<Card.Text><b>Email:</b> {userDetails.email}</Card.Text>
									<Card.Text><b>First name:</b> {userDetails.firstName}</Card.Text>
									<Card.Text><b>Last name:</b> {userDetails.lastName}</Card.Text>
									<Stack direction="horizontal" gap={2} className="mt-3">
										<Button variant="primary" onClick={handleEdit}>Edit</Button>
									</Stack>
									<Fade in={changed}>
										<div>
											{changed && (
												<Alert variant="success" className="mb-0 mt-3">{changed}</Alert>
											)}
										</div>
									</Fade>
								</Stack>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default Profile;
