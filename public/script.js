const apiUrl = window.env.API_URL || 'http://localhost:5000';

document.getElementById('downloadBtn').addEventListener('click', async () => {
	const videoUrl = document.getElementById('videoUrl').value.trim().toString();
	const message = document.getElementById('message');
	const loaderOverlay = document.getElementById('loader-overlay'); 

	// Validate URL
	if (!videoUrl || !videoUrl.startsWith('https://www.instagram.com')) {
		message.textContent = 'Please enter a valid Instagram video URL.';
		return;
	}

	try {
		// Show the loader overlay
		loaderOverlay.style.display = 'flex';
		message.textContent = '';
		// Pass the videoUrl as a query parameter
		const fullUrl = `https://instagram-reels-downloader-api.p.rapidapi.com/download?userId=25025320&url=${encodeURIComponent(
			videoUrl,
		)}`;

		const response = await fetch(fullUrl, {
			method: 'GET',
			headers: {
				'x-rapidapi-key': '12c2fa05b3mshccf8a4b3eb452ccp1380b7jsn71e1f5190176',
				'x-rapidapi-host': 'instagram-reels-downloader-api.p.rapidapi.com',
			},
		});


		// Check if the response is OK
		if (!response.ok) {
			throw new Error(`Server returned ${response.status}: ${response.statusText}`);
		}

		// Parse the response as JSON
		const data = await response.json();

		// Extract the video URL from the medias array
		if (!data.data.medias || data.data.medias.length === 0) {
			throw new Error('No video found in the response.');
		}

		const downloadedVideoUrl = data.data.medias[0].url;

		// Start download
		window.location.href = downloadedVideoUrl;
		message.textContent = 'Download started...';
	} catch (error) {
		message.textContent = 'An error occurred. Please try again.';
	} finally {
		// Hide the loader overlay (runs whether the request succeeds or fails)
		loaderOverlay.style.display = 'none';
	}
});
