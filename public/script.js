const apiUrl = window.env.API_URL || 'http://localhost:5000';

document.getElementById('downloadBtn').addEventListener('click', async () => {
	const videoUrl = document.getElementById('videoUrl').value.trim().toString();
	const message = document.getElementById('message');

	console.log('Video URL:', videoUrl); // Debugging
	console.log('Message element:', message); // Debugging

	// Validate URL
	if (!videoUrl || !videoUrl.startsWith('https://www.instagram.com')) {
		message.textContent = 'Please enter a valid Instagram video URL.';
		return;
	}

	try {
		// Pass the videoUrl as a query parameter
		const fullUrl = `https://instagram-reels-downloader-api.p.rapidapi.com/download?userId=25025320&url=${encodeURIComponent(
			videoUrl,
		)}`;
		console.log(fullUrl);
		const response = await fetch(fullUrl, {
			method: 'GET',
			url: 'https://instagram-reels-downloader-api.p.rapidapi.com/download',
			params: {
				userId: '25025320',
				url: videoUrl,
			},

			headers: {
				'x-rapidapi-key': '12c2fa05b3mshccf8a4b3eb452ccp1380b7jsn71e1f5190176' ,
				'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com',
			},
		});

		console.log('Response:', response);

		// Make the request to RapidAPI

		// Debugging: Log the full response
		console.log('API Response:', JSON.stringify(response.data, null, 2));

		// Extract the video URL from the medias array
		if (!response.data.data.medias || response.data.data.medias.length === 0) {
			return res.status(404).json({ success: false, message: 'No video found in the response.' });
		}

		const downloadedVideoUrl = response.data.data.medias[0].url;

		// Send the video URL back to the client
		res.json({ success: true, videoUrl: downloadedVideoUrl });
	} catch (error) {
		console.error('Error:', error.response ? error.response.data : error.message);
		console.log(error);
		// res.status(500).json({ success: false, message: 'Failed to fetch reels.', error });
		if (!response.ok) {
			throw new Error(`Server returned ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		console.log('Data:', data);

		if (data.success) {
			// Start download
			window.location.href = data.videoUrl;
			message.textContent = 'Download started...';
		} else {
			message.textContent = data.message || 'Failed to download the video.';
		}
	}
});
