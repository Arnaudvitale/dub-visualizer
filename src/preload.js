document.addEventListener('DOMContentLoaded', function() {
    var myVideo = document.getElementById('myVideo');
    var videoSelector = document.getElementById('videoSelector');
    var recordButton = document.getElementById('microphone');
    var recordText = document.getElementById('recordText');
    var unrecordedText = document.getElementById('recordText1');
    var mediaRecorder; // will be initialized with MediaRecorder instance
    var recordedChunks = [];
    var activeStream = null; // active microphone stream
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
    if (localStorage.getItem('theme') === 'light') {
        bod.classList.add('light');
    }

    // translations
    const translations = {
        "en": {
            "shortcuts_list": "Shortcuts list",
            "esc_close": "Esc - Close the shortcuts list",
            "r_record": "R - Record / Stop recording",
            "f_fullscreen": "F - Toggle fullscreen",
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
            "f_fullscreen": "F - Basculer en plein écran",
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
            "f_fullscreen": "F - Alternar pantalla completa",
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
            "f_fullscreen": "F - Vollbild umschalten",
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
            "f_fullscreen": "F - Passa a schermo intero",
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
            "f_fullscreen": "F - Переключить полноэкранный режим",
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

    // Encode an AudioBuffer as a WAV ArrayBuffer (PCM 16-bit little-endian)
    function audioBufferToWav(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const bitDepth = 16;
        const channels = [];
        for (let i = 0; i < numChannels; i++) {
            channels.push(audioBuffer.getChannelData(i));
        }
        const numSamples = channels[0].length;
        const dataLength = numSamples * numChannels * (bitDepth / 8);
        const buffer = new ArrayBuffer(44 + dataLength);
        const view = new DataView(buffer);

        function writeStr(offset, str) {
            for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        }

        writeStr(0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        writeStr(8, 'WAVE');
        writeStr(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
        view.setUint16(32, numChannels * (bitDepth / 8), true);
        view.setUint16(34, bitDepth, true);
        writeStr(36, 'data');
        view.setUint32(40, dataLength, true);

        let offset = 44;
        for (let i = 0; i < numSamples; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const s = Math.max(-1, Math.min(1, channels[ch][i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                offset += 2;
            }
        }
        return buffer;
    }

    // Function to populate the audio devices dropdowns
    function populateAudioDevices() {
        const audioInputEl = document.getElementById('audioInput');
        const audioOutputEl = document.getElementById('audioOutput');
        // Clear previous options (keep first disabled placeholder)
        while (audioInputEl.options.length > 1) audioInputEl.remove(1);
        while (audioOutputEl.options.length > 1) audioOutputEl.remove(1);

        navigator.mediaDevices.enumerateDevices().then(devices => {
            devices.forEach(device => {
                let option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || 'no name device';
                if (device.kind === 'audioinput') {
                    audioInputEl.appendChild(option.cloneNode(true));
                } else if (device.kind === 'audiooutput') {
                    audioOutputEl.appendChild(option.cloneNode(true));
                }
            });
        }).catch(error => {
            console.error("Error enumerating devices:", error);
        });
    }

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

    // Function to toggle fullscreen mode
    function toggleFullScreen() {
        if (myVideo.src) { // Check if there's a video source
            if (!document.fullscreenElement) {
                // If not in fullscreen, enter fullscreen for the video element
                myVideo.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else {
                // If in fullscreen, exit fullscreen
                document.exitFullscreen();
            }
        }
    }

    function stopRecording() {
        // Stop recording
        myVideo.pause();
        recordText.style.display = 'none';
        unrecordedText.style.display = 'block';
        addFadeInAnimation(unrecordedText);
        recordButton.classList.remove('recording');
        mediaRecorder.stop();
        // Release microphone
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
            activeStream = null;
        }
    }

    // Function to toggle recording
    function toggleRecording() {
        // If we are not currently recording
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            // Get the selected audio input device
            var selectedAudioInputId = document.getElementById('audioInput').value;
            // Empty string means the placeholder is selected (no device chosen) → use default
            var useDefaultInput = !selectedAudioInputId || selectedAudioInputId.trim() === '';
            navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: useDefaultInput ? undefined : { exact: selectedAudioInputId }
                }
            })
            .then(stream => {
                activeStream = stream;
                // Start recording
                myVideo.play();
                recordText.style.display = 'flex';
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
        // Create the MediaRecorder instance
        const options = { mimeType: 'audio/webm' };
        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.onstart = (event) => {
            // Reset previously recorded chunks
            recordedChunks = [];
            // Visual feedback for recording
            recordButton.classList.add('recording');
        };

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async (event) => {
            // Create a blob from the recorded chunks
            const blob = new Blob(recordedChunks, {
                type: 'audio/webm; codecs=opus'
            });

            try {
                // Convert WebM/Opus to WAV via Web Audio API
                const arrayBuffer = await blob.arrayBuffer();
                const audioContext = new AudioContext();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                await audioContext.close();

                const wavBuffer = audioBufferToWav(audioBuffer);
                const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

                const url = URL.createObjectURL(wavBlob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = url;
                a.download = 'enregistrement.wav';
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Erreur lors de la conversion en WAV, téléchargement en WebM :', err);
                // Fallback : download as webm
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                a.href = url;
                a.download = 'enregistrement.webm';
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }

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
            case 'KeyF':
                toggleFullScreen();
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
        bod.classList.add('light');
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
        bod.classList.remove('light');
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
