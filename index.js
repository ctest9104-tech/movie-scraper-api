const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allows your Vercel frontend to talk to this API

app.get('/get-video', async (req, res) => {
  const { id, type } = req.query;
  
  // LOGIC: This is where you'd put your scraping logic.
  // For now, we return a high-quality test stream.
  // In a real scenario, you'd fetch from your source here.
  const mockStream = {
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    quality: "1080p",
    isCam: false
  };

  if (mockStream.isCam) {
    return res.status(404).json({ error: "High quality not available yet." });
  }

  res.json(mockStream);
});

const PORT = process.env.PORT || 10000; // Render uses port 10000 by default
app.listen(PORT, () => console.log(`Scraper active on port ${PORT}`));
