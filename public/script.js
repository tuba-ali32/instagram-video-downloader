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
		const fullUrl = `${apiUrl}/api/download-reels?url=${encodeURIComponent(videoUrl)}`;
console.log(fullUrl)
		const response = await fetch(fullUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include', 
			withCredentials: true,
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
