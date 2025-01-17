const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/convert-mp3', async (req, res) => {
    const videoURL = req.body.videoURL;

    if (!videoURL) {
        return res.render('index', { success: false, message: 'Please enter a YouTube URL' });
    }

    // Extract video ID from URL
    const videoID = extractVideoID(videoURL);
    if (!videoID) {
        return res.render('index', { success: false, message: 'Invalid YouTube URL' });
    }

    try {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === 'ok') {
            return res.render('index', { success: true, song_title: fetchResponse.title, song_link: fetchResponse.link });
        } else {
            return res.render('index', { success: false, message: fetchResponse.msg });
        }
    } catch (error) {
        return res.render('index', { success: false, message: 'An error occurred while processing your request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Function to extract video ID from YouTube URL
function extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=|.+\/videos\/|.+\/videos\/|.+\/videos\/|.+\/videos\/)?([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
