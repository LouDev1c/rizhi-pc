class RizhiPcmCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const processorOptions = options.processorOptions || {};
    this.targetSampleRate = processorOptions.targetSampleRate;
    this.frameSize = Math.max(1, Math.round(this.targetSampleRate * (processorOptions.frameDurationMs || 100) / 1000));
    this.sourceBuffer = new Float32Array(0);
    this.sourcePosition = 0;
    this.frame = new Float32Array(this.frameSize);
    this.frameOffset = 0;
    this.port.onmessage = (event) => {
      if (event.data && event.data.type === 'flush') {
        this.emitFrame();
        this.port.postMessage({ type: 'flushed' });
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0] || [];
    output.forEach((channel) => channel.fill(0));
    const input = inputs[0] || [];
    if (!input.length || !input[0] || !input[0].length) return true;

    const mono = this.downmixToMono(input);
    if (sampleRate === this.targetSampleRate) this.appendOutput(mono);
    else this.resampleAndAppend(mono);
    return true;
  }

  downmixToMono(channels) {
    if (channels.length === 1) return new Float32Array(channels[0]);
    const mono = new Float32Array(channels[0].length);
    for (let sampleIndex = 0; sampleIndex < mono.length; sampleIndex += 1) {
      let total = 0;
      for (let channelIndex = 0; channelIndex < channels.length; channelIndex += 1) total += channels[channelIndex][sampleIndex] || 0;
      mono[sampleIndex] = total / channels.length;
    }
    return mono;
  }

  resampleAndAppend(samples) {
    const combined = new Float32Array(this.sourceBuffer.length + samples.length);
    combined.set(this.sourceBuffer);
    combined.set(samples, this.sourceBuffer.length);
    const sourceSamplesPerOutput = sampleRate / this.targetSampleRate;
    while (this.sourcePosition + 1 < combined.length) {
      const left = Math.floor(this.sourcePosition);
      const mix = this.sourcePosition - left;
      this.appendOutputSample(combined[left] * (1 - mix) + combined[left + 1] * mix);
      this.sourcePosition += sourceSamplesPerOutput;
    }
    const consumed = Math.min(Math.floor(this.sourcePosition), combined.length);
    this.sourceBuffer = combined.slice(consumed);
    this.sourcePosition -= consumed;
  }

  appendOutput(samples) {
    for (let index = 0; index < samples.length; index += 1) this.appendOutputSample(samples[index]);
  }

  appendOutputSample(sample) {
    this.frame[this.frameOffset] = sample;
    this.frameOffset += 1;
    if (this.frameOffset === this.frame.length) this.emitFrame();
  }

  emitFrame() {
    if (!this.frameOffset) return;
    const frame = this.frame.slice(0, this.frameOffset);
    this.frameOffset = 0;
    this.port.postMessage({ type: 'frame', samples: frame }, [frame.buffer]);
  }
}

registerProcessor('rizhi-pcm-capture', RizhiPcmCaptureProcessor);
