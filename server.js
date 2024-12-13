const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Mongoose Schema and Model
const MarkerSchema = new mongoose.Schema({
    owner: String,
    photographer: String,
    story: String,
    date: String,
    usage: String,
    email: String,
    equipment: String,
    image: String, // Image URL or base64 string
    location: {
        type: [Number], // [lng, lat]
        required: true,
    },
    country: String, // Country field
});

const Marker = mongoose.model('Marker', MarkerSchema);

// Routes

// Save a new marker
app.post('/api/markers', async (req, res) => {
    try {
        console.log('Received Data:', req.body); // Debugging
        const newMarker = new Marker(req.body);
        await newMarker.save();
        res.status(201).json({ message: 'Marker saved successfully!' });
    } catch (error) {
        console.error('Error saving marker data:', error);
        res.status(400).json({ error: 'Error saving marker data' });
    }
});

// Fetch all markers in GeoJSON format
app.get('/api/markers', async (req, res) => {
    try {
        const markers = await Marker.find();
        const geojsonData = {
            type: 'FeatureCollection',
            features: markers.map((marker) => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: marker.location, // [lng, lat]
                },
                properties: {
                    owner: marker.owner,
                    story: marker.story,
                    date: marker.date,
                    country: marker.country,
                    photographer: marker.photographer,
                    email: marker.email,
                    equipment: marker.equipment,
                    image: marker.image,
                },
            })),
        };
        res.status(200).json(geojsonData);
    } catch (error) {
        console.error('Error fetching marker data:', error);
        res.status(500).json({ error: 'Error fetching marker data' });
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
