document.getElementById('startButton').addEventListener('click', function() {
    fetch('/startWebSocket', { method: 'POST' })
        .then(response => response.text()) // Change from .json() to .text() if the response is plain text
        .then(data => {
            console.log('Received data:', data);
            updateStatus('WebSocket initiated by server');
        })
        .catch(error => console.error('Error:', error));
});


document.getElementById('stopButton').addEventListener('click', function() {
    // This should also be managed through a server endpoint if needed
    fetch('/stopWebSocket', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log('Server stopped WebSocket:', data);
            updateStatus('Disconnected');
        })
        .catch(error => console.error('Error:', error));
});

function updateStatus(status) {
    document.getElementById('status').textContent = status;
}

document.getElementById('sendAudioButton').addEventListener('click', function() {
    const file = document.getElementById('audioInput').files[0];
    if (!file) {
        alert('Please select an audio file first.');
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64Audio = reader.result.split(',')[1]; // Get base64 part
        fetch('/sendAudio', {
            method: 'POST',
            body: JSON.stringify({ base64Audio: base64Audio }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Audio sent to WebSocket:', data);
        })
        .catch(error => console.error('Error sending audio:', error));
    };
    reader.onerror = (error) => {
        console.error('Error reading file:', error);
    };
});

