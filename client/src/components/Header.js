import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header brutalist-header">
            <h1 className="header-logo" data-text="ARKIV">ARKIV</h1>
            <nav className="nav">
                <Link to="/" className="nav-link">Explore</Link>
                <Link to="/upload" className="nav-link upload-link">+</Link>
            </nav>
        </header>
    );
};

export default Header;
