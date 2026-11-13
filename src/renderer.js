document.addEventListener('DOMContentLoaded', function() {
    const myVideo = document.getElementById('myVideo');
    const videoSelector = document.getElementById('videoSelector');
    const recordButton = document.getElementById('microphone');
    const recordText = document.getElementById('recordText');
    const unrecordedText = document.getElementById('recordText1');
    const audioInputEl = document.getElementById('audioInput');
    const audioOutputEl = document.getElementById('audioOutput');
    const languageSelect = document.getElementById('language-select');
    const toast = document.getElementById('toast');
    // themes
    const settingsButton = document.getElementById('settings-button');
    const themeOptions = document.getElementById('theme-options');
    const popup = document.getElementById('popup-1');
    const lightThemeButton = document.getElementById('light-theme');
    const darkThemeButton = document.getElementById('dark-theme');
    const paramButton = document.getElementById('parameter');
    const closePopupButton = document.getElementById('close-btn-id');
    const bod = document.getElementById('bod');

    // recording state: 'idle' | 'starting' | 'recording'
    let recordState = 'idle';
    let recorder = null; // { stream, context, source, node, chunks, channels }
    let currentVideoUrl = null;
    let currentVideoName = 'recording';
    let currentLanguage = 'en';
    let toastTimer = null;

    // localStorage can be unavailable; never let it break the app
    function loadSetting(key) {
        try { return localStorage.getItem(key); } catch (err) { return null; }
    }
    function saveSetting(key, value) {
        try { localStorage.setItem(key, value); } catch (err) { /* ignore */ }
    }

    if (loadSetting('theme') === 'light') {
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

    // error messages shown to the user
    const errorTexts = {
        "en": {
            "mic_error": "Unable to access the microphone. Check that it is plugged in and allowed.",
            "record_error": "The recording could not be saved.",
            "output_error": "Unable to use this audio output.",
        },
        "fr": {
            "mic_error": "Impossible d'accéder au microphone. Vérifiez qu'il est branché et autorisé.",
            "record_error": "L'enregistrement n'a pas pu être sauvegardé.",
            "output_error": "Impossible d'utiliser cette sortie audio.",
        },
        "es": {
            "mic_error": "No se puede acceder al micrófono. Compruebe que está conectado y autorizado.",
            "record_error": "No se pudo guardar la grabación.",
            "output_error": "No se puede usar esta salida de audio.",
        },
        "de": {
            "mic_error": "Kein Zugriff auf das Mikrofon. Prüfen Sie, ob es angeschlossen und erlaubt ist.",
            "record_error": "Die Aufnahme konnte nicht gespeichert werden.",
            "output_error": "Diese Audioausgabe kann nicht verwendet werden.",
        },
        "it": {
            "mic_error": "Impossibile accedere al microfono. Verifica che sia collegato e autorizzato.",
            "record_error": "Impossibile salvare la registrazione.",
            "output_error": "Impossibile usare questa uscita audio.",
        },
        "ru": {
            "mic_error": "Нет доступа к микрофону. Проверьте, что он подключен и разрешен.",
            "record_error": "Не удалось сохранить запись.",
            "output_error": "Не удалось использовать этот аудиовыход.",
        },
    };

    /* functions */

    function showError(key) {
        toast.textContent = errorTexts[currentLanguage][key] || errorTexts.en[key];
        toast.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 5000);
    }

    function updateTexts(language) {
        if (!translations[language]) language = 'en';
        currentLanguage = language;
        document.documentElement.lang = language;
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.textContent = translations[language][key];
        });
    }

    // Encode raw PCM blocks as a WAV ArrayBuffer (PCM 16-bit little-endian).
    // chunks: array of blocks, each block being one Float32Array per channel.
    function encodeWav(chunks, numChannels, sampleRate) {
        const bytesPerSample = 2;
        let numSamples = 0;
        for (const block of chunks) numSamples += block[0].length;
        const dataLength = numSamples * numChannels * bytesPerSample;
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
        view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
        view.setUint16(32, numChannels * bytesPerSample, true);
        view.setUint16(34, bytesPerSample * 8, true);
        writeStr(36, 'data');
        view.setUint32(40, dataLength, true);

        let offset = 44;
        for (const block of chunks) {
            const frames = block[0].length;
            for (let i = 0; i < frames; i++) {
                for (let ch = 0; ch < numChannels; ch++) {
                    const channel = block[ch] || block[0];
                    const s = Math.max(-1, Math.min(1, channel[i]));
                    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    offset += 2;
                }
            }
        }
        return buffer;
    }

    // "my video.mp4" -> "my video_2026-01-31_14-05-09.wav"
    function buildFileName() {
        const pad = n => String(n).padStart(2, '0');
        const d = new Date();
        const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
            `_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
        return `${currentVideoName}_${stamp}.wav`;
    }

    function downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // let the download start before releasing the blob
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    // Route the video sound to the selected output device
    function applyAudioOutput() {
        if (typeof myVideo.setSinkId !== 'function') return;
        myVideo.setSinkId(audioOutputEl.value || '').catch(err => {
            console.error('Error selecting audio output:', err);
            showError('output_error');
        });
    }

    // Fill the audio device dropdowns, keeping the current / saved selection
    async function populateAudioDevices() {
        let devices;
        try {
            devices = await navigator.mediaDevices.enumerateDevices();
        } catch (err) {
            console.error('Error enumerating devices:', err);
            return;
        }
        const fill = (select, kind, storageKey) => {
            const wanted = select.value || loadSetting(storageKey) || '';
            // keep the first option: it is the disabled placeholder
            while (select.options.length > 1) select.remove(1);
            let index = 0;
            devices.filter(device => device.kind === kind).forEach(device => {
                index++;
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `#${index}`;
                select.appendChild(option);
            });
            const exists = wanted !== '' && Array.from(select.options).some(o => o.value === wanted);
            select.value = exists ? wanted : '';
        };
        fill(audioInputEl, 'audioinput', 'audioInput');
        fill(audioOutputEl, 'audiooutput', 'audioOutput');
        if (audioOutputEl.value) applyAudioOutput();
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
        popup.classList.toggle('active');
    }

    // Function to add a fade-in animation to an element
    function addFadeInAnimation(element) {
        element.classList.add('fade-in');
        element.addEventListener('animationend', () => {
            element.classList.remove('fade-in');
        }, { once: true });
    }

    // Function to add a rotate animation to an element
    function addRotateAnimation(element) {
        element.classList.add('rotate');
        element.addEventListener('animationend', () => {
            element.classList.remove('rotate');
        }, { once: true });
    }

    function hasVideo() {
        return currentVideoUrl !== null;
    }

    // Function to toggle fullscreen mode
    function toggleFullScreen() {
        if (!hasVideo()) return;
        if (!document.fullscreenElement) {
            myVideo.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function setRecordingUi(isRecording) {
        recordText.style.display = isRecording ? 'flex' : 'none';
        unrecordedText.style.display = isRecording ? 'none' : 'block';
        addFadeInAnimation(isRecording ? recordText : unrecordedText);
        recordButton.classList.toggle('recording', isRecording);
    }

    // Release the microphone and the audio graph
    async function releaseRecorder(rec) {
        try { rec.source.disconnect(); } catch (err) { /* ignore */ }
        try { rec.node.disconnect(); } catch (err) { /* ignore */ }
        rec.stream.getTracks().forEach(track => track.stop());
        try { await rec.context.close(); } catch (err) { /* ignore */ }
        rec.node.port.onmessage = null;
    }

    // Capture the microphone as raw PCM (no lossy codec in between)
    async function startRecording() {
        if (recordState !== 'idle' || !hasVideo()) return;
        recordState = 'starting';
        let stream = null;
        let context = null;
        try {
            const deviceId = audioInputEl.value;
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    // voice processing damages a dubbing take: keep the raw signal
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                }
            });
            context = new AudioContext({ latencyHint: 'interactive' });
            await context.audioWorklet.addModule('recorder-worklet.js');

            const settings = stream.getAudioTracks()[0].getSettings();
            const channels = Math.min(Math.max(settings.channelCount || 1, 1), 2);
            const source = context.createMediaStreamSource(stream);
            const node = new AudioWorkletNode(context, 'recorder-processor', {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                channelCount: channels,
                channelCountMode: 'explicit',
            });
            const chunks = [];
            node.port.onmessage = event => chunks.push(event.data);
            source.connect(node);
            // the processor outputs silence; connecting it keeps the graph pulled
            node.connect(context.destination);

            recorder = { stream, context, source, node, chunks, channels };
            recordState = 'recording';
            setRecordingUi(true);
            // device labels are only exposed once the microphone has been granted
            populateAudioDevices();
            myVideo.play().catch(err => console.error('Error playing video:', err));
        } catch (err) {
            console.error('Error trying to access microphone:', err);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (context) context.close().catch(() => {});
            recorder = null;
            recordState = 'idle';
            showError('mic_error');
        }
    }

    async function stopRecording() {
        if (recordState !== 'recording') return;
        const rec = recorder;
        recorder = null;
        recordState = 'idle';
        myVideo.pause();
        setRecordingUi(false);
        const sampleRate = rec.context.sampleRate;
        await releaseRecorder(rec);
        try {
            if (rec.chunks.length === 0) throw new Error('no audio captured');
            const wavBuffer = encodeWav(rec.chunks, rec.channels, sampleRate);
            downloadBlob(new Blob([wavBuffer], { type: 'audio/wav' }), buildFileName());
        } catch (err) {
            console.error('Error saving the recording:', err);
            showError('record_error');
        }
    }

    // Function to toggle recording
    function toggleRecording() {
        if (recordState === 'idle') {
            startRecording();
        } else if (recordState === 'recording') {
            stopRecording();
        }
    }

    // Function to handle video selection
    function videoSelection(event) {
        const file = event.target.files[0];
        if (!file) return; // dialog cancelled
        if (recordState === 'recording') stopRecording();
        if (currentVideoUrl) URL.revokeObjectURL(currentVideoUrl);

        currentVideoUrl = URL.createObjectURL(file);
        currentVideoName = file.name.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]/g, '_') || 'recording';
        myVideo.src = currentVideoUrl;
        myVideo.style.display = 'block';
        recordButton.style.display = 'block';
        unrecordedText.style.display = 'block';
        addFadeInAnimation(myVideo);
    }

    function seekBy(delta) {
        const duration = Number.isFinite(myVideo.duration) ? myVideo.duration : 0;
        myVideo.currentTime = Math.min(Math.max(myVideo.currentTime + delta, 0), duration);
        myVideo.pause();
    }

    // Function to handle key presses
    function handleKeyPress(event) {
        if (event.code === 'Escape') {
            if (popup.classList.contains('active')) {
                TogglePopup();
                event.preventDefault();
            }
            return;
        }
        // leave the keyboard to form controls, system shortcuts and the open popup
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const target = event.target instanceof Element ? event.target : null;
        if (target && target.closest('select, textarea, input:not([type="file"])')) return;
        if (target && target.closest('button') && event.code === 'Space') return;
        if (popup.classList.contains('active') || !hasVideo()) return;

        switch (event.code) {
            case 'ArrowLeft':
                seekBy(event.shiftKey ? -0.1 : -1);
                event.preventDefault();
                break;
            case 'ArrowRight':
                seekBy(event.shiftKey ? 0.1 : 1);
                event.preventDefault();
                break;
            case 'Space':
                if (myVideo.paused) {
                    myVideo.play().catch(err => console.error('Error playing video:', err));
                } else {
                    myVideo.pause();
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
                if (Number.isFinite(myVideo.duration)) myVideo.currentTime = myVideo.duration;
                event.preventDefault();
                break;
            case 'ArrowDown':
                myVideo.currentTime = 0;
                myVideo.pause();
                event.preventDefault();
                break;
            case 'KeyR':
                if (event.repeat) break;
                if (event.shiftKey && recordState === 'idle') {
                    myVideo.currentTime = 0;
                }
                toggleRecording();
                event.preventDefault();
                break;
            case 'KeyF':
                if (event.repeat) break;
                toggleFullScreen();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    /* event listeners */

    languageSelect.addEventListener('change', function(event) {
        updateTexts(event.target.value);
        saveSetting('language', event.target.value);
    });

    audioInputEl.addEventListener('change', function() {
        saveSetting('audioInput', audioInputEl.value);
    });

    audioOutputEl.addEventListener('change', function() {
        saveSetting('audioOutput', audioOutputEl.value);
        applyAudioOutput();
    });

    navigator.mediaDevices.addEventListener('devicechange', populateAudioDevices);

    videoSelector.addEventListener('change', videoSelection);

    myVideo.addEventListener('ended', function() {
        if (recordState === 'recording') {
            stopRecording();
            myVideo.currentTime = 0;
        }
    });

    settingsButton.addEventListener('click', toggleThemeOptions);

    lightThemeButton.addEventListener('click', function() {
        bod.classList.add('light');
        saveSetting('theme', 'light');
        toggleThemeOptions();
    });

    darkThemeButton.addEventListener('click', function() {
        bod.classList.remove('light');
        saveSetting('theme', 'dark');
        toggleThemeOptions();
    });

    paramButton.addEventListener('click', function() {
        if (!myVideo.paused && recordState !== 'recording') {
            myVideo.pause();
        }
        toggleThemeOptions();
        TogglePopup();
    });

    closePopupButton.addEventListener('click', TogglePopup);

    recordButton.addEventListener('click', toggleRecording);

    window.addEventListener('keydown', handleKeyPress);

    /* startup */

    const savedLanguage = loadSetting('language');
    if (savedLanguage && translations[savedLanguage]) {
        languageSelect.value = savedLanguage;
    }
    updateTexts(languageSelect.value);
    populateAudioDevices();
});
