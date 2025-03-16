import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
	res.send('Instagram Reels Downloader API');
});

// API endpoint for downloading Instagram reels
app.get('/download-reels', async (req, res) => {
	const { url } = req.query; // Get URL from the query parameters
	console.log('URL:', url);

	// Validate URL
	if (!url || !url.startsWith('https://www.instagram.com')) {
		return res.status(400).json({ success: false, message: 'A valid Instagram URL is required.' });
	}

	try {
		const options = {
			method: 'GET',
			url: 'https://instagram-reels-downloader-api.p.rapidapi.com/download',
			params: {
				url: url,
			},
			headers: {
				'x-rapidapi-key': '12c2fa05b3mshccf8a4b3eb452ccp1380b7jsn71e1f5190176',
				'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com',
			},
		};

		// Make the request to RapidAPI
		const response = await axios(options);

		// Debugging: Log the full response
		console.log('API Response:', JSON.stringify(response.data, null, 2));

		// Extract the video URL from the medias array
		if (!response.data.data.medias || response.data.data.medias.length === 0) {
			return res.status(404).json({ success: false, message: 'No video found in the response.' });
		}

		const videoUrl = response.data.data.medias[0].url;

		// Send the video URL back to the client
		res.json({ success: true, videoUrl: videoUrl });
	} catch (error) {
		console.error('Error:', error.response ? error.response.data : error.message);
		res.status(500).json({ success: false, message: 'Failed to fetch reels.' });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
