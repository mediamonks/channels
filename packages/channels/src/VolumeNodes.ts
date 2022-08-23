import { tweenAudioParamToValue } from './util/fadeGain';

export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

export class VolumeNodes {
  public readonly volumeGainNode: GainNode;
  public readonly fadeGainNode: GainNode;
  public readonly input: GainNode;
  public readonly output: GainNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    private readonly audioContext: AudioContext,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {}
  ) {
    this.volumeGainNode = audioContext.createGain();
    this.fadeGainNode = audioContext.createGain();

    this.volume = initialVolume;
    this.isMuted = initialMuted;

    // set up the graph: volume -> fade -> mute
    this.volumeGainNode.connect(this.fadeGainNode);

    // define input and output
    this.input = this.volumeGainNode;
    this.output = this.fadeGainNode;
  }

  public fadeOut(duration: number, onComplete?: () => void) {
    this.fadeTo(0, duration, onComplete);
  }

  public fadeIn(duration: number, onComplete?: () => void) {
    this.fadeTo(1, duration, onComplete);
  }

  public fadeTo(value: number, duration: number, onComplete?: () => void) {
    tweenAudioParamToValue(this.fadeGainNode.gain, value, duration, onComplete);
  }

  public get volume(): number {
    return this.volumeGainNode.gain.value;
  }

  public set volume(value: number) {
    if (value < 0) {
      throw new Error('Cannot set negative volume');
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

  public get isMuted(): boolean {
    return this.volume === 0;
  }

  public set isMuted(value: boolean) {
    if (value) {
      // mute
      if (this.isMuted) {
        // already muted
      } else {
        // muting when volume > 0
        this.volumeValueBeforeMute = this.volumeGainNode.gain.value;
        this.volumeGainNode.gain.value = 0;
      }
    } else {
      // unmute
      if (!this.isMuted) {
        // already unmuted
      } else {
        this.volumeGainNode.gain.value = this.volumeValueBeforeMute ?? 1;
        this.volumeValueBeforeMute = undefined;
      }
    }
  }
}
