import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts/`;
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let data = await response.json();
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts: ' + error.message);
            }
        };
        
        fetchGifts();
    }, [navigate]);

    // Task 2: Navigate to details page
    const goToDetailsPage = (giftId) => {
        // Write your code below this line
        navigate(`/app/gifts/${giftId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        // Write your code below this line
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "success" : "warning";
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-6 col-lg-4">
                        <Card className="mb-4">
                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}
                            <Card.Img 
                                variant="top"
                                src={
                                    gift.image ? (
                                        gift.image
                                    ) : (
                                        "holder.js/100px180?text=No image available"
                                    )
                                }
                                alt={gift.name}
                                className="object-fit-cover image-placeholder"
                            />

                            <Card.Body>
                                {/* // Task 5: Display gift name */}
                                {/* // Write your code below this line */}
                                <Card.Title>{gift.name}</Card.Title>
                                <Card.Text>
                                    <Badge bg={getConditionClass(gift.condition)}>{gift.condition}</Badge>
                                </Card.Text>
                                <Card.Text>
                                    {/* // Task 6: Display formatted date */}
                                    {/* // Write your code below this line */}
                                    <span className="small text-secondary">
                                        {formatDate(gift.date_added)}
                                    </span>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="p-3">
                                <Button
                                    onClick={() => goToDetailsPage(gift.id)}
                                    variant="secondary"
                                >
                                    View Details
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
