type AudioControllerConfig = Partial<
  Pick<AudioController, 'volume' | 'playbackRate'>
>;

export class AudioController {
  ctx: AudioContext;
  audioBuffer: AudioBuffer | null = null;
  source: AudioBufferSourceNode | null = null;
  oscillator: OscillatorNode;
  gainNode: GainNode;
  duration: number = 0;
  volume: number = 1;
  frequency: number = 440;
  playbackTime: number = 0;
  isPlaying: boolean = false;
  startTimestamp: number = 0;
  playbackRate: number = 1;
  cb?: (isPlaying: boolean) => void;

  constructor(config?: AudioControllerConfig) {
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
    this.oscillator = this.ctx.createOscillator();
    this.oscillator.connect(this.gainNode);
    if (config) {
      Object.entries(config).forEach(
        ([key, value]) => (this[key as keyof AudioControllerConfig] = value)
      );
    }
  }

  initSource() {
    this.source = this.ctx.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.playbackRate.value = this.playbackRate;
    this.gainNode.gain.value = this.volume;
    this.source.connect(this.gainNode);
    this.oscillator.frequency.value = this.frequency;
    this.oscillator.connect(this.gainNode);
    this.source.onended = this.endOfPlayback;
  }

  endOfPlayback() {
    if (this.isPlaying) {
      this.playbackTime = 0;
    }
    this.isPlaying = false;
  }

  play() {
    if (!this.source) {
      return;
    }
    if (this.isPlaying) {
      return;
    }
    this.initSource();
    this.source.start(0, this.playbackTime);
    this.startTimestamp = Date.now();
    this.isPlaying = true;
    this.cb?.(true);
  }

  seek(playbackTime: number) {
    if (!this.audioBuffer) {
      return;
    }
    if (playbackTime > this.audioBuffer.duration) {
      return;
    }

    if (this.isPlaying) {
      this.stop();
      this.playbackTime = playbackTime;
      this.play();
    } else {
      this.playbackTime = playbackTime;
    }
  }

  pause() {
    this.stop(true);
  }

  stop(pause: boolean = false) {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this.source?.stop(0);
    this.playbackTime = pause
      ? (Date.now() - this.startTimestamp) / 1000 + this.playbackTime
      : 0;
    this.cb?.(false);
  }

  init(audioBuffer: AudioBuffer) {
    this.audioBuffer = audioBuffer;
    this.duration = audioBuffer.duration;
    this.source = this.ctx.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.ctx.destination);
  }

  changePlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  changeVolume(volume: number) {
    this.volume = volume;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  changeFrequency(frequency: number) {
    this.frequency = frequency;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  onPlayPauseChange = (cb: (isPlaying: boolean) => void) => {
    this.cb = cb;
  };

  onPlaybackTimeChange = (cb: (time: number) => void) => {
    setInterval(() => {
      if (!this.isPlaying) {
        return;
      }
      cb((Date.now() - this.startTimestamp) / 1000 + this.playbackTime);
    }, 300);
  };

  pauseOrResume() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}
