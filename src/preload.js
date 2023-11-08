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
    const overlay = document.querySelector('.overlay');
    const overlayStyles = window.getComputedStyle(overlay);
    const lightThemeButton = document.getElementById('light-theme');
    const darkThemeButton = document.getElementById('dark-theme');
    const paramButton = document.getElementById('parameter');
    const closePopupButton = document.getElementById('close-btn-id');
    const bod = document.getElementById('bod');
    localStorage.setItem('theme', 'dark');

    // translations
    const translations = {
        "en": {
            "shortcuts_list": "Shortcuts list",
            "esc_close": "Esc - Close the shortcuts list",
            "r_record": "R - Record / Stop recording",
            "space_play_pause": "Spacebar - Play / Pause",
            "left_rewind": "Left Arrow - Rewind 1 second",
            "right_forward": "Right Arrow - Fast Forward 1 second",
            "up_end": "Up Arrow - Go to the end of the video",
            "down_beginning": "Down Arrow - Go to the beginning of the video",
            "shift_left_rewind": "Shift + Left Arrow - Rewind 0.1 second",
            "shift_right_forward": "Shift + Right Arrow - Fast Forward 0.1 second",
            "shift_r_record": "Shift + R - Go to the beginning of the video and start recording",
            "audio_device": "Select your audio devices",
            "audioInputDevice": "select a microphone",
            "audioOutputDevice": "select a headphone",
            "themeLight": "Light",
            "themeDark": "Dark",
            "params": "Settings",
            "vid-select": "Select a video",
            "recordTextOne": "click to record",
            "recordingText": "record in progress...",
        },
        "fr": {
            "shortcuts_list": "Liste des raccourcis",
            "esc_close": "Esc - Fermer la liste des raccourcis",
            "r_record": "R - Enregistrer / Arrêter l'enregistrement",
            "space_play_pause": "Barre d'espace - Lire/Pause",
            "left_rewind": "Flèche gauche - Rembobiner 1 seconde",
            "right_forward": "Flèche droite - Avancer rapide 1 seconde",
            "up_end": "Flèche haut - Aller à la fin de la vidéo",
            "down_beginning": "Flèche bas - Aller au début de la vidéo",
            "shift_left_rewind": "Shift + Flèche gauche - Rembobiner 0.1 secondes",
            "shift_right_forward": "Shift + Flèche droite - Avancer rapide 0.1 secondes",
            "shift_r_record": "Shift + R - Aller au début de la vidéo et commencer l'enregistrement",
            "audio_device": "Sélectionnez vos périphériques audio",
            "audioInputDevice": "sélectionnez un microphone",
            "audioOutputDevice": "sélectionnez un casque",
            "themeLight": "Clair",
            "themeDark": "Sombre",
            "params": "Paramètres",
            "vid-select": "Sélectionnez une vidéo",
            "recordTextOne": "cliquez pour enregistrer",
            "recordingText": "enregistrement en cours...",
        },
        "es": {
            "shortcuts_list": "Lista de atajos",
            "esc_close": "Esc - Cerrar la lista de atajos",
            "r_record": "R - Grabar / Detener la grabación",
            "space_play_pause": "Barra espaciadora - Reproducir / Pausa",
            "left_rewind": "Flecha izquierda - Rebobinar 1 segundo",
            "right_forward": "Flecha derecha - Avance rápido 1 segundo",
            "up_end": "Flecha arriba - Ir al final del video",
            "down_beginning": "Flecha abajo - Ir al principio del video",
            "shift_left_rewind": "Shift + Flecha izquierda - Rebobinar 0.1 segundos",
            "shift_right_forward": "Shift + Flecha derecha - Avance rápido 0.1 segundos",
            "shift_r_record": "Shift + R - Ir al principio del video y comenzar a grabar",
            "audio_device": "Seleccione sus dispositivos de audio",
            "audioInputDevice": "selecciona un micrófono",
            "audioOutputDevice": "selecciona un auricular",
            "themeLight": "Claro",
            "themeDark": "Oscuro",
            "params": "Ajustes",
            "vid-select": "Seleccione un video",
            "recordTextOne": "haga clic para grabar",
            "recordingText": "grabación en curso...",
        },
        "de": {
            "shortcuts_list": "Verknüpfungsliste",
            "esc_close": "Esc - Schließen Sie die Verknüpfungsliste",
            "r_record": "R - Aufnahme / Aufnahme beenden",
            "space_play_pause": "Leertaste - Wiedergabe / Pause",
            "left_rewind": "Linke Pfeiltaste - 1 Sekunde zurückspulen",
            "right_forward": "Rechte Pfeiltaste - 1 Sekunde schnell vor",
            "up_end": "Pfeil nach oben - Zum Ende des Videos gehen",
            "down_beginning": "Pfeil nach unten - Zum Anfang des Videos gehen",
            "shift_left_rewind": "Shift + Linke Pfeiltaste - 0,1 Sekunden zurückspulen",
            "shift_right_forward": "Shift + Rechte Pfeiltaste - 0,1 Sekunden schnell vor",
            "shift_r_record": "Shift + R - Zum Anfang des Videos gehen und Aufnahme starten",
            "audio_device": "Wählen Sie Ihre Audiogeräte aus",
            "audioInputDevice": "wähle ein Mikrofon",
            "audioOutputDevice": "wähle einen Kopfhörer",
            "themeLight": "Hell",
            "themeDark": "Dunkel",
            "params": "Einstellungen",
            "vid-select": "Wählen Sie ein Video aus",
            "recordTextOne": "klicken Sie, um aufzunehmen",
            "recordingText": "Aufnahme läuft...",
        },
        "it": {
            "shortcuts_list": "Elenco delle scorciatoie",
            "esc_close": "Esc - Chiudi l'elenco delle scorciatoie",
            "r_record": "R - Registra / Interrompi la registrazione",
            "space_play_pause": "Barra spaziatrice - Riproduci / Pausa",
            "left_rewind": "Freccia sinistra - Riavvolgi 1 secondo",
            "right_forward": "Freccia destra - Avanti veloce 1 secondo",
            "up_end": "Freccia su - Vai alla fine del video",
            "down_beginning": "Freccia giù - Vai all'inizio del video",
            "shift_left_rewind": "Shift + Freccia sinistra - Riavvolgi 0,1 secondi",
            "shift_right_forward": "Shift + Freccia destra - Avanti veloce 0,1 secondi",
            "shift_r_record": "Shift + R - Vai all'inizio del video e inizia la registrazione",
            "audio_device": "Seleziona i tuoi dispositivi audio",
            "audioInputDevice": "seleziona un microfono",
            "audioOutputDevice": "seleziona una cuffia",
            "themeLight": "Chiaro",
            "themeDark": "Scuro",
            "params": "Impostazioni",
            "vid-select": "Seleziona un video",
            "recordTextOne": "clicca per registrare",
            "recordingText": "registrazione in corso...",
        },
        "ru": {
            "shortcuts_list": "Список ярлыков",
            "esc_close": "Esc - Закрыть список ярлыков",
            "r_record": "R - Запись / Остановить запись",
            "space_play_pause": "Пробел - Воспроизвести / Пауза",
            "left_rewind": "Стрелка влево - Перемотать 1 секунду",
            "right_forward": "Стрелка вправо - Быстро вперед 1 секунду",
            "up_end": "Стрелка вверх - Перейти в конец видео",
            "down_beginning": "Стрелка вниз - Перейти в начало видео",
            "shift_left_rewind": "Shift + Стрелка влево - Перемотать 0,1 секунды",
            "shift_right_forward": "Shift + Стрелка вправо - Быстро вперед 0,1 секунды",
            "shift_r_record": "Shift + R - Перейти в начало видео и начать запись",
            "audio_device": "Выберите ваши ауд устройства",
            "audioInputDevice": "выберите микрофон",
            "audioOutputDevice": "выберите наушники",
            "themeLight": "Свет",
            "themeDark": "Темный",
            "params": "Настройки",
            "vid-select": "Выберите видео",
            "recordTextOne": "нажмите, чтобы записать",
            "recordingText": "идет запись...",
        },
      };

    /* functions */

    // Set default language to English
    function updateTexts(language) {
        document.querySelectorAll('[data-translate]').forEach(el => {
          const key = el.getAttribute('data-translate');
          el.textContent = translations[language][key];
        });
        // refresh audio devices
        populateAudioDevices();
    }
    updateTexts('en');

    // Function to populate the audio devices dropdowns
    function populateAudioDevices() {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            devices.forEach(device => {
                let option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || 'no name device';
                if (device.kind === 'audioinput') {
                    document.getElementById('audioInput').appendChild(option.cloneNode(true)); // cloneNode(true) to avoid the error "An attempt was made to reference a Node in a context where it does not exist."
                } else if (device.kind === 'audiooutput') {
                    document.getElementById('audioOutput').appendChild(option.cloneNode(true)); // cloneNode(true) to avoid the error "An attempt was made to reference a Node in a context where it does not exist."
                }
            });
        }).catch(error => {
            console.error("Error enumerating devices:", error);
        });
    }
    populateAudioDevices();

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
            // Get the selected audio input device
            var selectedAudioInputId = document.getElementById('audioInput').value;
            var selectedAudioOutputId = document.getElementById('audioOutput').value;
            if (selectedAudioInputId === "select a microphone" || selectedAudioInputId === "Sélectionnez un microphone") {
                selectedAudioInputId = undefined; // set to default microphone
            } else if (selectedAudioOutputId === "select a headphone" || selectedAudioOutputId === "Sélectionnez un casque") {
                selectedAudioOutputId = undefined; // set to default headphones
            }
            navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedAudioInputId ? { exact: selectedAudioInputId } : undefined
                }
            })
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
                if (event.shiftKey) {
                    myVideo.currentTime = 0;
                    toggleRecording();
                } else {
                    toggleRecording();
                }
                event.preventDefault();
                break;
            case 'Escape':
                if (overlayStyles.display === 'block') {
                    TogglePopup();
                }
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /* event listeners */

    // Event listener for language selection changes
    document.getElementById('language-select').addEventListener('change', function(event) {
        updateTexts(event.target.value);
    });

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
