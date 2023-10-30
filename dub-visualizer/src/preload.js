document.addEventListener('DOMContentLoaded', function() {
    var myVideo = document.getElementById('myVideo');
    var videoSelector = document.getElementById('videoSelector');
    var recordButton = document.getElementById('microphone');
    var recordText = document.getElementById('recordText');
    var unrecordedText = document.getElementById('recordText1');
    var mediaRecorder; // will be initialized with MediaRecorder instance
    var recordedChunks = [];
    // themes
    const settingsButton = document.getElementById('settings-button');
    const themeOptions = document.getElementById('theme-options');
    const lightThemeButton = document.getElementById('light-theme');
    const darkThemeButton = document.getElementById('dark-theme');
    const paramButton = document.getElementById('parameter');
    const closePopupButton = document.getElementById('close-btn-id');
    const bod = document.getElementById('bod');
    localStorage.setItem('theme', 'dark');

    /* functions */

    // Function to toggle the theme options menu
    function toggleThemeOptions() {
        if (themeOptions.classList.contains('hidden')) {
            themeOptions.classList.remove('hidden');
            themeOptions.style.right = '60px';
        } else {
            themeOptions.classList.add('hidden');
            themeOptions.style.right = '-600px';
        }
        addRotateAnimation(settingsButton);
    }

    // Function to toggle the popup
    function TogglePopup() {
        document.getElementById('popup-1').classList.toggle('active');
    }

    // Function to add a fade-in animation to an element
    function addFadeInAnimation(element) {
        element.classList.add('fade-in');
        element.addEventListener('animationend', () => {
            element.classList.remove('fade-in');
        });
    }

    // Function to add a rotate animation to an element
    function addRotateAnimation(element) {
        element.classList.add('rotate');
        element.addEventListener('animationend', () => {
            element.classList.remove('rotate');
        });
    }

    function stopRecording() {
        // Stop recording
        myVideo.pause();
        recordText.style.display = 'none';
        unrecordedText.style.display = 'block';
        addFadeInAnimation(unrecordedText);
        recordButton.style.border = '1px solid black';
        recordButton.style.filter = 'invert(0%)';
        mediaRecorder.stop();
    }

    // Function to toggle recording
    function toggleRecording() {
        // If we are not currently recording
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            // Request access to the microphone
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Start recording
                    myVideo.play();
                    recordText.style.display = 'block';
                    unrecordedText.style.display = 'none';
                    addFadeInAnimation(recordText);
                    startRecording(stream);
                })
                .catch(err => {
                    console.error('Error trying to access microphone:', err);
                });
        } else {
            stopRecording();
        }
    }

    // Function to start recording
    function startRecording(stream) {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = (event) => {
            // Reset previously recorded chunks
            recordedChunks = [];
            // Visual feedback for recording
            recordButton.style.border = 'none';
            if (localStorage.getItem('theme') === 'dark') {
                recordButton.style.filter = 'invert(100%)';
            } else if (localStorage.getItem('theme') === 'light') {
                recordButton.style.filter = 'none';
            }
        };

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = (event) => {
            // Create a blob from the recorded chunks
            const blob = new Blob(recordedChunks, {
                type: 'audio/wav'
            });

            // Create a link to download the audio
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'enregistrement.wav';
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);

            // Reset visual feedback
            recordButton.style.backgroundColor = '';
        };

        // Start recording
        mediaRecorder.start();
    }

    // Function to handle video selection
    function videoSelection(event) {
        var file = event.target.files[0];
        var fileURL = URL.createObjectURL(file);

        myVideo.src = fileURL;
        myVideo.style.display = 'block';
        recordButton.style.display = 'block';
        unrecordedText.style.display = 'block';
        addFadeInAnimation(myVideo);
    }

    // Function to handle key presses
    function handleKeyPress(event) {
        switch(event.code) {
            case 'ArrowLeft':
                if (event.shiftKey) {
                    myVideo.currentTime = Math.max(myVideo.currentTime - 0.1, 0);
                } else {
                    myVideo.currentTime = Math.max(myVideo.currentTime - 1, 0);
                }
                myVideo.pause();
                break;
            case 'ArrowRight':
                if (event.shiftKey) {
                    myVideo.currentTime = Math.min(myVideo.currentTime + 0.1, myVideo.duration);
                } else {
                    myVideo.currentTime = Math.min(myVideo.currentTime + 1, myVideo.duration);
                }
                myVideo.pause();
                break;
            case 'Space':
                if (myVideo.paused) {
                    myVideo.play();
                } else {
                    myVideo.pause();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                myVideo.currentTime = myVideo.duration;
                event.preventDefault();
                break;
            case 'ArrowDown':
                myVideo.currentTime = 0;
                myVideo.pause();
                event.preventDefault();
                break;
            case 'KeyR':
                toggleRecording();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /* event listeners */
    videoSelector.addEventListener('change', function(event) {
        videoSelection(event);
    });

    myVideo.addEventListener('ended', function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopRecording();
            myVideo.currentTime = 0;
        }
    });

    settingsButton.addEventListener('click', function() {
        addRotateAnimation(settingsButton);
        toggleThemeOptions();
    });

    lightThemeButton.addEventListener('click', function() {
        bod.style.background = 'white';
        recordText.style.color = 'gray';
        unrecordedText.style.color = 'gray';
        localStorage.setItem('theme', 'light');
        toggleThemeOptions();
    });

    paramButton.addEventListener('click', function() {
        if (myVideo.play) {
            myVideo.pause();
        }
        toggleThemeOptions();
        TogglePopup();
    });

    closePopupButton.addEventListener('click', function() {
        TogglePopup();
    });

    darkThemeButton.addEventListener('click', function() {
        bod.style.background = 'linear-gradient(90deg, #1E1E1E 0%, #2D2D2D 100%)';
        recordText.style.color = 'white';
        unrecordedText.style.color = 'white';
        localStorage.setItem('theme', 'dark');
        toggleThemeOptions();
    });

    // Handle clicks on the record button
    recordButton.addEventListener('click', function() {
        toggleRecording();
    });
    // Handle key presses
    window.addEventListener('keydown', handleKeyPress);
});
