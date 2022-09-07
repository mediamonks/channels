import { tweenAudioParamToValue } from './util/fadeGain';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { CanConnectMediaElement, Effects, HasVolume } from './types';
import EventDispatcher from 'seng-event';
import { createVolumeNodesGraph } from './util/createVolumeNodesGraph';
import { PanningChangeEvent } from './event/PanningChangeEvent';

type VolumeNodeOptions = {
  volume?: number;
  fadeVolume?: number;
  panning?: number;
  effects?: Effects;
};

/**
 * Class that creates two gainNodes, one for the user to freely set,
 * one for applying fades.
 */
export class VolumeNodes implements CanConnectMediaElement {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  private readonly stereoPannerNode: StereoPannerNode;
  public readonly input: AudioNode;
  public readonly output: AudioNode;

  private volumeValueBeforeMute: number | undefined;

  constructor(
    readonly audioContext: AudioContext,
    private readonly eventDispatcher: EventDispatcher,
    private readonly changeEventTarget: HasVolume, // todo: better name for var and type?
    { volume = 1, fadeVolume = 1, effects, panning = 0 }: VolumeNodeOptions
  ) {
    const { fadeGainNode, volumeGainNode, input, output, stereoPannerNode } =
      createVolumeNodesGraph({
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
    this.stereoPannerNode.pan.value = panning;
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
        target: this.changeEventTarget,
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

  public connectMediaElement = (element: HTMLMediaElement) => {
    const mediaElementSource =
      this.audioContext.createMediaElementSource(element);
    mediaElementSource.connect(this.input);
  };

  public setPanning = (value: number) => {
    this.stereoPannerNode.pan.value = value;
    this.eventDispatcher.dispatchEvent(
      new PanningChangeEvent(PanningChangeEvent.types.PANNING_CHANGE, {
        target: this.changeEventTarget,
      })
    );
  };

  public getPanning = () => this.stereoPannerNode.pan.value;
}
