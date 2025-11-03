import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">GiftLink</a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"></button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {/* Task 1: Add links to Home and Gifts below*/}
                        <li className="nav-item">
                            <a className="nav-link" href="/home.html">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="/app">Gifts</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
