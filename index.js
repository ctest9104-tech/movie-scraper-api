const express = require('express');
const cors = require('cors');
const app = express();

// Change '*' to your Vercel URL once deployed for better security
app.use(cors({ origin: '*' }));

app.get('/scrape', async (req, res) => {
  const { id, type } = req.query;

  try {
    // 1. Logic to find the video source (e.g., searching a direct provider)
    // Replace this placeholder with a real scraper or a call to a movie database indexer
    const rawVideoSource = "https://example-provider.com/api/video/" + id; 
    
    // 2. Logic to filter out CAM streams
    // We check the filename/metadata for keywords like "CAM", "TS", or "HDCAM"
    const isCam = /cam|ts|hdcam|telesync/i.test(rawVideoSource);
    
    if (isCam) {
      return res.status(404).json({ error: "Only CAM version available. Skipping." });
    }

    // 3. Return the clean high-quality .m3u8 link
    res.json({ url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", quality: "1080p" });
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Scraper running on port ${PORT}`));
