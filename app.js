// Assuming the necessary modules are installed and imported
require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Global WebSocket variable
let globalWs = null;

// Proxy endpoint to handle WebSocket connections
app.post('/startWebSocket', (req, res) => {
    if (!globalWs || globalWs.readyState === WebSocket.CLOSED) {
        globalWs = new WebSocket('wss://api.play.ai/v1/talk/MemeBot-A3mJI50zVDObVmTaidESo');

        globalWs.on('open', () => {
            console.log('WebSocket Connected');
            globalWs.send(JSON.stringify({
                type: 'setup',
                apiKey: process.env.PLAY_AI_API_KEY,
                inputEncoding: 'media-container',
                outputFormat: 'mp3',
                outputSampleRate: 44100
            }));
            res.json({ message: "WebSocket setup initiated." }); // Send response immediately
        });

        globalWs.on('message', (data) => {
            console.log('Received message:', data.toString());
            // Extend this to handle specific message types (e.g., audioStream)
        });

        globalWs.on('close', () => {
            console.log('WebSocket Disconnected');
            globalWs = null;
        });

        globalWs.on('error', (error) => {
            console.error('WebSocket Error:', error);
            globalWs = null;
        });
    } else {
        res.json({ message: "WebSocket already active." });
    }
});

// Endpoint to send audio data to the WebSocket
app.post('/sendAudio', (req, res) => {
    if (globalWs && globalWs.readyState === WebSocket.OPEN) {
        const { base64Audio } = req.body;
        globalWs.send(JSON.stringify({ type: 'audioIn', data: base64Audio }));
        res.json({ message: "Audio sent successfully" });
    } else {
        res.status(500).json({ message: "WebSocket is not open or available." });
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
