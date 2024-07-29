const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Utility function to extract video ID from YouTube URL
const extractVideoID = (url) => {
    if (!url) return null;

    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:v\/|embed\/|watch\?v=|watch\?v%3D)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    return match ? match[1] : null;
};

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/convert-mp3', async (req, res) => {
    const url = req.body.url; // Changed from videoID to url
    const videoID = extractVideoID(url);

    if (!url || !videoID) {
        return res.render('index', { success: false, message: 'Please enter a valid YouTube URL' });
    }

    try {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.API_KEY,
                'x-rapidapi-host': process.env.API_HOST,
            },
        });

        if (!fetchAPI.ok) {
            throw new Error(`HTTP error! Status: ${fetchAPI.status}`);
        }

        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === 'ok') {
            return res.render('index', {
                success: true,
                song_title: fetchResponse.title,
                song_link: fetchResponse.link,
            });
        } else {
            return res.render('index', { success: false, message: fetchResponse.msg });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.render('index', { success: false, message: 'An error occurred while processing your request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
