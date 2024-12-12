import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFsb2tvayIsImEiOiJjbTQ0aWFzZGIwMWJiMmpwdmF5eW9scG00In0.37IMozXO5K0eot3fZU-KSw';

const Map = ({ geojsonData }) => {
    const mapContainer = useRef(null);
    const mapInstance = useRef(null);
    const [popupData, setPopupData] = useState(null); // Data for the popup

    useEffect(() => {
        if (!mapInstance.current) {
            mapInstance.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/aalokok/cm469v2sd00r701qr9jr47x3i',
                center: [0, 0],
                zoom: 1.5,
                projection: 'globe',
            });

            mapInstance.current.on('load', () => {
                mapInstance.current.addSource('markers', {
                    type: 'geojson',
                    data: geojsonData,
                });

                mapInstance.current.addLayer({
                    id: 'marker-layer',
                    type: 'circle',
                    source: 'markers',
                    paint: {
                        'circle-radius': 8,
                        'circle-color': 'yellow',
                    },
                });

                mapInstance.current.on('click', 'marker-layer', (e) => {
                    const properties = e.features[0].properties;

                    setPopupData({
                        owner: properties.owner,
                        story: properties.story,
                        date: properties.date,
                        photographer: properties.photographer,
                        country: properties.country,
                        equipment: properties.equipment,
                        image: properties.image, // Cloudinary/MongoDB image URL
                    });
                });

                mapInstance.current.on('mouseenter', 'marker-layer', () => {
                    mapInstance.current.getCanvas().style.cursor = 'pointer';
                });

                mapInstance.current.on('mouseleave', 'marker-layer', () => {
                    mapInstance.current.getCanvas().style.cursor = '';
                });
            });
        }

        if (mapInstance.current && mapInstance.current.isStyleLoaded()) {
            const source = mapInstance.current.getSource('markers');
            if (source) {
                source.setData(geojsonData);
            }
        }
    }, [geojsonData]);

    return (
        <div>
            <div ref={mapContainer} id="map" className="explore-map-container"></div>

            {popupData && (
                <div className="popup-side-panel">
                    <button
                        className="close-button"
                        onClick={() => {
                            setPopupData(null);
                        }}
                    >
                        &times;
                    </button>
                    <div className="popup-details">
                        <h3>{popupData.owner}</h3>
                        <p><strong>Story:</strong> {popupData.story}</p>
                        <p><strong>Date:</strong> {popupData.date}</p>
                        <p><strong>Country:</strong> {popupData.country}</p>
                        <p><strong>Photographer:</strong> {popupData.photographer}</p>
                        <p><strong>Equipment:</strong> {popupData.equipment}</p>
                        {popupData.image && (
                            <img
                                src={popupData.image}
                                alt="Popup"
                                className="popup-image"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
