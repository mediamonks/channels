import { tweenAudioParamToValue } from './util/fadeGain';

export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

export class VolumeNodes {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  public readonly input: GainNode; // todo should be private?
  public readonly output: GainNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    private readonly audioContext: AudioContext,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {}
  ) {
    this.volumeGainNode = audioContext.createGain();
    this.fadeGainNode = audioContext.createGain();

    this.volume = initialVolume;

    if (initialMuted) {
      this.mute();
    }

    // set up the graph: volume -> fade -> mute
    this.volumeGainNode.connect(this.fadeGainNode);

    // define input and output
    this.input = this.volumeGainNode;
    this.output = this.fadeGainNode;
  }

  public fadeTo(value: number, duration: number, onComplete?: () => void) {
    tweenAudioParamToValue(this.fadeGainNode.gain, value, duration, onComplete);
  }

  public get fadeVolume(): number {
    return this.fadeGainNode.gain.value;
  }

  public get volume(): number {
    return this.volumeGainNode.gain.value;
  }

  public set volume(value: number) {
    if (value < 0) {
      throw new Error('Cannot set negative volume');
    }
    if (value === this.volumeGainNode.gain.value) {
      return;
    }
    if (value === 0) {
      // setting volume to 0 means muting it. setting volumeValueBeforeMute to
      // 1 so if we would hit unmute, it would go back to full
      this.volumeValueBeforeMute = 1;
    } else {
      this.volumeValueBeforeMute = undefined;
    }
    this.volumeGainNode.gain.value = value;
  }

  public mute() {
    if (this.volume > 0) {
      this.volumeValueBeforeMute = this.volume;
      this.volumeGainNode.gain.value = 0;
    }
  }

  public unmute() {
    if (this.volume === 0) {
      this.volumeGainNode.gain.value = this.volumeValueBeforeMute ?? 1;
    }
  }
}
