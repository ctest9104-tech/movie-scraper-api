const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// This endpoint is what your React App (App.jsx) calls
app.get('/get-video', async (req, res) => {
    const { id, type, season, episode } = req.query;

    if (!id || !type) {
        return res.status(400).json({ error: "Missing ID or Type" });
    }

    try {
        // We use a provider that resolves TMDB IDs into direct streams.
        // For TV shows, we include season and episode. For movies, just the ID.
        const apiUrl = type === 'tv' 
            ? `https://api.vegamovies.dev/source/${id}/${season}/${episode}` 
            : `https://api.vegamovies.dev/source/${id}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.url) {
            // Success: Return the real HD stream URL to your frontend
            res.json({ url: data.url });
        } else {
            // Fallback: If the source isn't found
            res.status(404).json({ error: "Source not found for this title." });
        }
    } catch (error) {
        console.error("Backend Scraper Error:", error);
        res.status(500).json({ error: "The scraper is currently offline or sleeping." });
    }
});

app.listen(PORT, () => {
    console.log(`Scraper running on port ${PORT}`);
});
