import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
			// Task 1: Check for authentication and redirect
            navigate('/app/login');
            console.log('No authentication token found');
        }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
				// Task 2: Fetch gift details
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		// Task 3: Scroll to top on component mount
		window.scrollTo(0, 0);

    }, [navigate, productId]);


    const handleBackClick = () => {
		// Task 4: Handle back click
		navigate(-1)
	};

	//The comments have been hardcoded for this project.
    const comments = [
        {
            author: "John Doe",
            comment: "I would like this!"
        },
        {
            author: "Jane Smith",
            comment: "Just DMed you."
        },
        {
            author: "Alice Johnson",
            comment: "I will take it if it's still available."
        },
        {
            author: "Mike Brown",
            comment: "This is a good one!"
        },
        {
            author: "Sarah Wilson",
            comment: "My family can use one. DM me if it is still available. Thank you!"
        }
    ];

    if (error) return <Container><Row><Col className="my-5"><Alert variant="danger">{error}</Alert></Col></Row></Container>;
    if (loading) return <Container><Row><Col className="my-5"><Alert variant="primary">Loading...</Alert></Col></Row></Container>;
    if (!gift) return <Container><Row><Col className="my-5"><Alert variant="warning">Gift not found</Alert></Col></Row></Container>;

    return (
        <Container>
            <Row>
                <Col className="my-5">
                    <Button variant="secondary" onClick={handleBackClick}>Back</Button>
                </Col>
            </Row>

            <div className="mt-5">
                <Card className="product-details-card">
                    <Card.Header>{gift.name}</Card.Header>
                    <Card.Body>
                        <Card.Img
                            variant="top"
                            src={
                                gift.image ? (
                                    // Task 5: Display gift image
                                    // insert code here
                                    gift.image
                                ) : (
                                    "holder.js/100px180?text=No image available"
                                )
                            }
                            alt={gift.name}
                            className="object-fit-cover image-placeholder"
                        />
                        {/* Task 6: Display gift details */}
                        <Card.Text><strong>Category:</strong> {gift.category}</Card.Text>
                        <Card.Text><strong>Condition:</strong> {gift.condition}</Card.Text>
                        <Card.Text><strong>Date Added:</strong> {formatDate(gift.date_added)}</Card.Text>
                        <Card.Text><strong>Age (Years):</strong> {gift.age_years}</Card.Text>
                        <Card.Text><strong>Description:</strong> {gift.description}</Card.Text>
                    </Card.Body>
                </Card>
                <Stack className="comments-section mt-4">
                    <h3 className="mb-3">Comments</h3>
                    {/* Task 7: Render comments section by using the map function to go through all the comments */}
                    {comments.map((comment, index) => (
                        <Card key={index} bg="info"className="mb-3">
                            <Card.Body>
                                <Card.Text className="comment-author"><strong>{comment.author}:</strong></Card.Text>
                                <Card.Text className="comment-text">{comment.comment}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </Stack>
            </div>
        </Container >
    );
}

export default DetailsPage;
