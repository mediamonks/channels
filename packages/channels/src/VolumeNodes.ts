import { tweenAudioParamToValue } from './util/fadeGain';
import EventDispatcher from 'seng-event';
import { VolumeNodesEvent } from './event/VolumeNodesEvent';

export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

export class VolumeNodes extends EventDispatcher {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  public readonly input: GainNode; // todo should be private?
  public readonly output: GainNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    private readonly audioContext: AudioContext,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {},
    initialFadeVolume = 1
  ) {
    super();

    this.volumeGainNode = audioContext.createGain();
    this.fadeGainNode = audioContext.createGain();

    this.setVolume(initialVolume);

    if (initialMuted) {
      this.mute();
    }

    this.fadeGainNode.gain.value = initialFadeVolume;

    // set up the graph: volume -> fade -> mute
    this.volumeGainNode.connect(this.fadeGainNode);

    // define input and output
    this.input = this.volumeGainNode;
    this.output = this.fadeGainNode;
  }

  public fadeTo = (
    value: number,
    duration: number,
    onComplete?: () => void
  ) => {
    tweenAudioParamToValue(this.fadeGainNode.gain, value, duration, onComplete);
  };

  public get fadeVolume(): number {
    return this.fadeGainNode.gain.value;
  }

  public getVolume(): number {
    return this.volumeGainNode.gain.value;
  }

  public setVolume(value: number) {
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
    this.dispatchEvent(
      new VolumeNodesEvent(VolumeNodesEvent.types.VOLUME_CHANGED)
    );
    this.volumeGainNode.gain.value = value;
  }

  public mute = () => {
    const volume = this.getVolume();
    if (volume > 0) {
      this.volumeValueBeforeMute = volume;
      this.volumeGainNode.gain.value = 0;
    }
  };

  public unmute = () => {
    if (this.getVolume() === 0) {
      this.volumeGainNode.gain.value = this.volumeValueBeforeMute ?? 1;
    }
  };

  public fadeOut = (duration: number, onComplete?: () => void) => {
    this.fadeTo(0, duration, onComplete);
  };

  public fadeIn = (duration: number, onComplete?: () => void) => {
    this.fadeTo(1, duration, onComplete);
  };
}
