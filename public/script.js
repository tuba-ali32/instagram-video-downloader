import "dotenv/config"
document.getElementById('downloadBtn').addEventListener('click', async () => {
	const videoUrl = document.getElementById('videoUrl').value.trim(); // Trim whitespace
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
		const apiUrl = `${process.env.REACT_APP_API_URL}/download-reels?url=${encodeURIComponent(videoUrl)}`;

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		console.log('Response:', response); 

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
	} catch (error) {
		message.textContent = 'An error occurred. Please try again.';
		console.error('Error:', error); 
	}
});
