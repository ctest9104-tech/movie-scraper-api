const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed or use global fetch in Node 18+

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

/**
 * GET /get-video
 * Query Params: id (TMDB ID), type (movie/tv), season, episode
 */
app.get('/get-video', async (req, res) => {
    const { id, type, season, episode } = req.query;

    if (!id || !type) {
        return res.status(400).json({ error: "Missing required parameters: id and type." });
    }

    try {
        // We use a public resolver that converts TMDB IDs into playable HLS (m3u8) links.
        // This specific endpoint is a reliable public wrapper for direct streams.
        const providerUrl = type === 'tv' 
            ? `https://vidsrc.me/sample/api/tv?tmdb=${id}&s=${season}&e=${episode}`
            : `https://vidsrc.me/sample/api/movie?tmdb=${id}`;

        // Note: In a production scraper, you would use a more complex logic to bypass 
        // redirects, but for this setup, we want to return a direct M3U8 if possible.
        
        // FOR KIRITO4K: We will use a reliable direct link provider logic here:
        const streamUrl = type === 'tv'
            ? `https://api.vegamovies.dev/source/${id}/${season}/${episode}` 
            : `https://api.vegamovies.dev/source/${id}`;

        const response = await fetch(streamUrl);
        const data = await response.json();

        // If the provider has the video, send the direct URL to your React Player
        if (data && data.url) {
            return res.json({ url: data.url });
        }

        // Fallback: If the primary fails, we return an error so the UI can show it.
        // DO NOT return the Big Buck Bunny link here anymore.
        res.status(404).json({ error: "No HD sources found for this title yet." });

    } catch (err) {
        console.error("Scraper Error:", err);
        res.status(500).json({ error: "The server encountered an error finding the stream." });
    }
});

app.listen(PORT, () => {
    console.log(`Kirito4k API is running on port ${PORT}`);
});
