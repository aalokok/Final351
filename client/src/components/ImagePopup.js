import React, { useState } from 'react';
import './ImagePopup.css';

const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

const ImagePopup = ({ marker, onClose }) => {
    const [selectedDecade, setSelectedDecade] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch Wikimedia images
    const fetchImage = async (country, decade) => {
        setLoading(true);
        setError(null);
        setImageUrl('');

        try {
            const query = `${country} ${decade || ''}`.trim();

            const response = await fetch(
                `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&generator=search&iiprop=url&gsrsearch=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            console.log('API Response:', data); // Debugging

            const pages = data.query?.pages;
            if (pages) {
                const firstImage = Object.values(pages)[0]?.imageinfo[0]?.url;
                setImageUrl(firstImage || 'https://via.placeholder.com/500');
            } else {
                throw new Error('No images found.');
            }
        } catch (err) {
            console.error('Error fetching image:', err);
            setError('No images found. Please try another query.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h1>{marker.title}</h1>
                <p>Select a decade to view images:</p>
                <div className="timeline">
                    {decades.map((decade) => (
                        <div
                            key={decade}
                            className={`timeline-item ${selectedDecade === decade ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedDecade(decade);
                                fetchImage(marker.title, decade);
                            }}
                        >
                            {decade}
                        </div>
                    ))}
                </div>
                {loading && <p>Loading image...</p>}
                {error && (
                    <div>
                        <p className="error">{error}</p>
                        <button onClick={() => fetchImage(marker.title, selectedDecade)}>
                            Try Again
                        </button>
                    </div>
                )}
                {imageUrl && (
                    <div className="image-container">
                        <img src={imageUrl} alt={`${marker.title} - ${selectedDecade}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePopup;
