import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
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
        }
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/gifts/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}

                            <div className="card-body">

                                {/* // Task 5: Display gift image or placeholder */}
                                {/* // Write your code below this line */}

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift image or placeholder */}
                                {/* // Write your code below this line */}
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
