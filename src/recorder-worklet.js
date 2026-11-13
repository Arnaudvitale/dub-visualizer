// Forwards raw PCM blocks from the microphone to the renderer, untouched.
class RecorderProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input && input.length > 0) {
            this.port.postMessage(input.map(channel => channel.slice()));
        }
        return true;
    }
}

registerProcessor('recorder-processor', RecorderProcessor);
