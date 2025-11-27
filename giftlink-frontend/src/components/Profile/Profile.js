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
// import './Profile.css'

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
			const email = sessionStorage.getItem('email');
			const name=sessionStorage.getItem('name');
			if (name || authtoken) {
				const storedUserDetails = {
					name: name,
					email:email
				};

				setUserDetails(storedUserDetails);
				setUpdatedDetails(storedUserDetails);
			}
		} catch (error) {
			console.error(error);
			// Handle error case
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
					'Email': email,
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				setUserName(updatedDetails.name);
				sessionStorage.setItem('name', updatedDetails.name);
				setUserDetails(updatedDetails);
				setEditMode(false);
				// Display success message to the user
				setChanged('Name Changed Successfully!');
				setTimeout(() => {
					setChanged('');
					navigate('/');
				}, 1000);

			} else {
				// Handle error case
				throw new Error('Failed to update profile');
			}
		} catch (error) {
			console.error(error);
			// Handle error case
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
												value={userDetails.email} 
												disabled
												name="email"
											/>
										</Form.Group>
										<Form.Group controlId="name">
											<Form.Label>First name</Form.Label>
											<Form.Control 
												type="text"
												value={updatedDetails.name}
												onChange={handleInputChange}
												name="name"
											/>
										</Form.Group>
										<Stack direction="horizontal" gap={2} className="mt-3">
											<Button type="submit">Save</Button>
											<Button variant="outline-primary" onClick={() => setEditMode(false)}>Cancel</Button>
										</Stack>
									</Stack>

								</Form>
							) : (
								<Stack direction="vertical" >
									<h3>Hi, {userDetails.name}</h3>
									<Card.Text>Manage your GiftLink profile details.</Card.Text>
									<Card.Text><b>Email:</b> {userDetails.email}</Card.Text>
									<Stack direction="horizontal" gap={2} className="mt-3">
										<Button variant="primary" onClick={handleEdit}>Edit</Button>
									</Stack>
									<Fade in={changed}>
										<div>
											{changed && (
												<Alert variant="success">{changed}</Alert>
											)}
										</div>
									</Fade>
									
									{/* <span style={{ color: 'green', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{changed}</span> */}
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
