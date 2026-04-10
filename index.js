const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/get-video', async (req, res) => {
    const { id, type, season, episode } = req.query;

    if (!id || !type) {
        return res.status(400).json({ error: "Missing ID or Type" });
    }

    try {
        // Updated provider link for 2026
        const apiUrl = type === 'tv' 
            ? `https://api.vegamovies.dev/source/${id}/${season}/${episode}` 
            : `https://api.vegamovies.dev/source/${id}`;

        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error('Provider down');
        
        const data = await response.json();

        if (data && data.url) {
            res.json({ url: data.url });
        } else {
            res.status(404).json({ error: "No HD sources found for this title." });
        }
    } catch (error) {
        console.error("Backend Error:", error);
        // This is the message you are seeing in the frontend
        res.status(500).json({ error: "The server is waking up... wait 30 seconds." });
    }
});

app.listen(PORT, () => {
    console.log(`Scraper running on port ${PORT}`);
});
