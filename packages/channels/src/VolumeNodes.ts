import { tweenAudioParamToValue } from './util/fadeGain';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { HasVolume } from './types';
import EventDispatcher from 'seng-event';

export type VolumeOptions = {
  initialVolume?: number;
  initialMuted?: boolean;
};

/*
VolumeTarget refers to the instance that contains the VolumeNodes
instance. This entity is sent along when dispatching VOLUME_CHANGE events
 */

export class VolumeNodes implements HasVolume {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  public readonly input: GainNode; // todo should be private?
  public readonly output: GainNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    readonly audioContext: AudioContext,
    private readonly eventDispatcher: EventDispatcher,
    private readonly volumeTarget: HasVolume,
    { initialVolume = 1, initialMuted = false }: VolumeOptions = {},
    initialFadeVolume = 1 // todo: shouldnt this be part of VolumeOptions?
  ) {
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

  public getFadeVolume(): number {
    return this.fadeGainNode.gain.value;
  }

  public getVolume(): number {
    return this.volumeGainNode.gain.value;
  }

  private dispatchVolumeChange() {
    this.eventDispatcher.dispatchEvent(
      new VolumeChangeEvent(VolumeChangeEvent.types.VOLUME_CHANGE, {
        target: this.volumeTarget,
      })
    );
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
    this.dispatchVolumeChange();

    this.volumeGainNode.gain.value = value;
  }

  public mute = () => {
    const volume = this.getVolume();
    if (volume > 0) {
      this.volumeValueBeforeMute = volume;
      this.volumeGainNode.gain.value = 0;

      this.dispatchVolumeChange();
    }
  };

  public unmute = () => {
    if (this.getVolume() === 0) {
      this.volumeGainNode.gain.value = this.volumeValueBeforeMute ?? 1;

      this.dispatchVolumeChange();
    }
  };

  public fadeOut = (duration: number, onComplete?: () => void) => {
    this.fadeTo(0, duration, onComplete);
  };

  public fadeIn = (duration: number, onComplete?: () => void) => {
    this.fadeTo(1, duration, onComplete);
  };
}
