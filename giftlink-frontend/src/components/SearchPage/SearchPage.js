import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import './SearchPage.css';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const categories = ['All','Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['All', 'New', 'Like New', 'Older'];
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState([10]);
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const authToken = sessionStorage.getItem('auth-token');
        if (!authToken) {
            navigate('/app/search');
            console.log('No authentication token found');
        }

        // fetch all gifts
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                console.log(url);
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                let data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Error fetching gifts: ' + error.message);
            }
        };

        fetchGifts();
    }, [navigate]);

    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent form submission and page reload
        
        const baseUrl = `${urlConfig.backendUrl}/api/search`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        console.log('Search URL:', `${baseUrl}?${queryParams}`);

        try {
            const response = await fetch(`${baseUrl}?${queryParams}`);
            console.log('Response status:', response.status);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Search failed with status:', response.status, 'Error:', errorText);
                throw new Error(`Search failed with status ${response.status}`);
            }
            const data = await response.json();
            console.log('Search results:', data);
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const goToDetailsPage = (giftId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/gifts/${giftId}`);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h1 className="h2 visually-hidden">Search Gifts</h1>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Card className="filter-section mb-3">
                        <Card.Body>
                            <Form onSubmit={handleSearch}>
                                <h5 className="visually-hidden">Filters</h5>
                                    <Stack direction="vertical" gap={3}>
                                        {/* Task 7: Add text input field for search criteria*/}
                                        <Form.Group controlId="searchQuery" className="my-2 flex-grow-1">
                                            <Form.Label className="visually-hidden">Search</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                                                <Form.Control
                                                    type="search"
                                                    size="lg"
                                                    placeholder="Search gifts"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>

                                        <Form.Group controlId="categorySelect" className="flex-grow-1">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select aria-label="Category">
                                                {categories.map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group controlId="conditionSelect" className="flex-grow-1">
                                            <Form.Label>Condition</Form.Label>
                                            <Form.Select aria-label="Condition">
                                                {conditions.map((condition) => (
                                                    <option key={condition} value={condition}>{condition}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group controlId="ageRange" className="flex-grow-1 flex-column">
                                            {/* Task 4: Implement an age range slider and display the selected value. */}
                                            <Form.Label className="x-small">
                                                {ageRange === '1' || ageRange === 1
                                                    ? 'Less than 1 year old'
                                                    : `Less than ${ageRange} years old`}
                                            </Form.Label>
                                            <Form.Range 
                                                min={1} 
                                                max={10} 
                                                value={ageRange}
                                                step={1} 
                                                onChange={e => setAgeRange(e.target.value)}
                                                className="form-range-custom"
                                            />
                                        </Form.Group>
                                        {/* Task 8: Implement search button with onClick event to trigger search:*/}
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            onClick={handleSearch}
                                        >
                                            Search
                                        </Button>
                                    </Stack>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="p-2 text-center text-muted">
                            {searchResults.length === 1
                                ? `${searchResults.length} Gift found`
                                : `${searchResults.length} Gifts found`}
                        </Card.Footer>
                    </Card>
                </Col>
                {/*Task 5: Display search results and handle empty results with a message. */}
                <Col md={8}>
                    <Row className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map(searchResult => (
                                <Col key={searchResult.id} md={12} lg={6} className="d-flex align-items-stretch">
                                <Card key={searchResult.id} className="search-result-card mb-3">
                                    <Card.Img 
                                        variant="top"
                                        src={searchResult.image ? searchResult.image : "holder.js/100px180?text=No image available"}
                                        alt={searchResult.name}
                                        className="object-fit-cover image-placeholder"
                                    />
                                    <Card.Body>
                                        <Card.Title>{searchResult.name}</Card.Title>
                                            <Card.Text className="description-text">{searchResult.description.slice(0, 100)}</Card.Text>
                                    </Card.Body>
                                    <Card.Footer className="p-3">
                                        <Button variant="secondary" onClick={() => goToDetailsPage(searchResult.id)}>View More</Button>
                                    </Card.Footer>
                                </Card>
                                </Col>
                            ))
                            ) : (
                                <Alert variant="info">No gifts found. Please try again with different search criteria.</Alert>
                            )
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default SearchPage;
