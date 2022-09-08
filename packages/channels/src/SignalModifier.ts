import { tweenAudioParamToValue } from './util/fadeGain';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { SignalModifierOptions } from './types';
import EventDispatcher from 'seng-event';
import { PanChangeEvent } from './event/PanChangeEvent';
import { createSignalModifierGraph } from './util/createSignalModifierGraph';

/**
 * Represents a chain of nodes to apply volume changes, panning or effects.
 * Is used on the main output, on a channel and on  a playing sound.
 */
export class SignalModifier extends EventDispatcher {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  private readonly stereoPannerNode: StereoPannerNode;
  public readonly input: AudioNode;
  public readonly output: AudioNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    readonly audioContext: AudioContext,
    { volume = 1, fadeVolume = 1, effects, pan = 0 }: SignalModifierOptions
  ) {
    super();
    const { fadeGainNode, volumeGainNode, input, output, stereoPannerNode } =
      createSignalModifierGraph({
        audioContext,
        effects,
      });

    this.volumeGainNode = volumeGainNode;
    this.fadeGainNode = fadeGainNode;
    this.stereoPannerNode = stereoPannerNode;
    this.input = input;
    this.output = output;

    this.setVolume(volume);

    this.fadeGainNode.gain.value = fadeVolume;
    this.stereoPannerNode.pan.value = pan;
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

  private dispatchVolumeChange(volume: number) {
    this.dispatchEvent(
      new VolumeChangeEvent(VolumeChangeEvent.types.VOLUME_CHANGE, {
        volume,
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
    this.dispatchVolumeChange(value);

    this.volumeGainNode.gain.value = value;
  }

  public mute = () => {
    const volume = this.getVolume();
    if (volume > 0) {
      this.volumeValueBeforeMute = volume;
      this.volumeGainNode.gain.value = 0;

      this.dispatchVolumeChange(0);
    }
  };

  public unmute = () => {
    if (this.getVolume() === 0) {
      const value = this.volumeValueBeforeMute ?? 1;
      this.volumeGainNode.gain.value = value;

      this.dispatchVolumeChange(value);
    }
  };

  public fadeOut = (duration: number, onComplete?: () => void) => {
    this.fadeTo(0, duration, onComplete);
  };

  public fadeIn = (duration: number, onComplete?: () => void) => {
    this.fadeTo(1, duration, onComplete);
  };

  public connectMediaElement = (element: HTMLMediaElement) => {
    const mediaElementSource =
      this.audioContext.createMediaElementSource(element);
    mediaElementSource.connect(this.input);
  };

  public setPan = (value: number) => {
    if (value < -1 || value > 1) {
      throw new Error(
        'Panning value can not be smaller than -1 or larger than 1.'
      );
    }
    this.stereoPannerNode.pan.value = value;
    this.dispatchEvent(
      new PanChangeEvent(PanChangeEvent.types.PAN_CHANGE, {
        pan: value,
      })
    );
  };

  public getPan = () => this.stereoPannerNode.pan.value;
}
