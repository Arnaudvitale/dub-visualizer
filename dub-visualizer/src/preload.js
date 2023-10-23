
document.addEventListener('DOMContentLoaded', function() {
    var myVideo = document.getElementById('myVideo');
    var videoSelector = document.getElementById('videoSelector');
    var recordButton = document.getElementById('microphone');
    var recordText = document.getElementById('recordText');
    var unrecordedText = document.getElementById('recordText1');
    var mediaRecorder; // will be initialized with MediaRecorder instance
    var recordedChunks = [];

    videoSelector.addEventListener('change', function(event) {
        var file = event.target.files[0];
        var fileURL = URL.createObjectURL(file);

        myVideo.src = fileURL;
        myVideo.style.display = 'block';
        recordButton.style.display = 'block';
        unrecordedText.style.display = 'block';
    });

    // Function to start recording
    function startRecording(stream) {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = (event) => {
            // Reset previously recorded chunks
            recordedChunks = [];
            // Visual feedback for recording
            recordButton.style.backgroundColor = 'red';
        };

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = (event) => {
            // Create a blob from the recorded chunks
            const blob = new Blob(recordedChunks, {
                type: 'audio/wav' // or 'audio/mp3' depending on browser capabilities
            });

            // Create a link to download the audio
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'enregistrement.wav'; // or 'enregistrement.mp3'
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);

            // Reset visual feedback
            recordButton.style.backgroundColor = '';
        };

        // Start recording
        mediaRecorder.start();
    }

    recordButton.addEventListener('click', function() {
        // If we are not currently recording
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            // Request access to the microphone
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Start recording
                    myVideo.play();
                    recordText.style.display = 'block';
                    unrecordedText.style.display = 'none';
                    startRecording(stream);
                })
                .catch(err => {
                    console.error('Error trying to access microphone:', err);
                });
        } else {
            // Stop recording
            myVideo.pause();
            recordText.style.display = 'none';
            unrecordedText.style.display = 'block';
            mediaRecorder.stop();
        }
    });
});
