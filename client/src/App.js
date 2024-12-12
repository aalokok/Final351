import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Map from './components/Map';
import UploadForm from './components/UploadForm';
import './App.css';

// Example GeoJSON data
const geojsonData = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-74.0060, 40.7128], // [lng, lat]
            },
            properties: {
                title: 'New York',
            },
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [2.3522, 48.8566], // [lng, lat]
            },
            properties: {
                title: 'Paris',
            },
        },
    ],
};

function App() {
    const [geojsonData, setGeojsonData] = useState({
        type: 'FeatureCollection',
        features: [],
    });

    // Fetch GeoJSON data from the backend
    const fetchGeoJSON = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/markers');
            const data = await response.json();
            setGeojsonData(data);
        } catch (error) {
            console.error('Error fetching GeoJSON data:', error);
        }
    };

    useEffect(() => {
        fetchGeoJSON(); // Fetch marker data when the app loads
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Map geojsonData={geojsonData} />} />
                <Route
                    path="/upload"
                    element={<UploadForm onMarkerAdded={fetchGeoJSON} />}
                />
            </Routes>
        </Router>
    );
}

export default App;

