import { tweenAudioParamToValue } from './util/fadeGain';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import {
  AnalyserSettings,
  CanConnectMediaElement,
  EffectsChain,
  HasVolume,
} from './types';
import EventDispatcher from 'seng-event';
import { createVolumeNodesGraph } from './util/createVolumeNodesGraph';
import { Analyser } from './Analyser';

type VolumeNodeOptions = {
  volume?: number;
  fadeVolume?: number;
  effectsChain?: EffectsChain;
  analyserSettings?: AnalyserSettings;
};

/**
 * Class that creates two gainNodes, one for the user to freely set,
 * one for applying fades.
 */
export class VolumeNodes implements CanConnectMediaElement {
  private readonly volumeGainNode: GainNode;
  private readonly fadeGainNode: GainNode;
  public readonly input: AudioNode;
  public readonly output: AudioNode;

  private volumeValueBeforeMute: number | undefined;
  private readonly analyser: Analyser | undefined;

  constructor(
    readonly audioContext: AudioContext,
    private readonly eventDispatcher: EventDispatcher,
    private readonly volumeTarget: HasVolume,
    {
      volume = 1,
      fadeVolume = 1,
      effectsChain,
      analyserSettings,
    }: VolumeNodeOptions
  ) {
    const { fadeGainNode, volumeGainNode, input, output, analyserNode } =
      createVolumeNodesGraph({
        audioContext,
        effectsChain,
        analyserSettings,
      });

    if (analyserNode) {
      this.analyser = new Analyser(
        analyserNode,
        analyserSettings?.fftSize || 1024
      );
    }

    this.volumeGainNode = volumeGainNode;
    this.fadeGainNode = fadeGainNode;
    this.input = input;
    this.output = output;

    this.setVolume(volume);

    this.fadeGainNode.gain.value = fadeVolume;
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

  public connectMediaElement = (element: HTMLMediaElement) => {
    const mediaElementSource =
      this.audioContext.createMediaElementSource(element);
    mediaElementSource.connect(this.input);
  };

  public getAnalyser = () => this.analyser;
}
