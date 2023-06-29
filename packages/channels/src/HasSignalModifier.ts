import EventDispatcher from 'seng-event';
import { SignalModifier } from './SignalModifier';
import { SignalModifierOptions } from './types';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { PanChangeEvent } from './event/PanChangeEvent';

export class HasSignalModifier extends EventDispatcher {
  protected readonly signalModifier: SignalModifier;

  constructor(audioContext: AudioContext, signalModifierOptions: SignalModifierOptions) {
    super();

    this.signalModifier = new SignalModifier(audioContext, signalModifierOptions);

    // redispatch events from signal modifier
    this.signalModifier.addEventListener(VolumeChangeEvent.types.VOLUME_CHANGE, (event) =>
      this.dispatchEvent(event.clone()),
    );
    this.signalModifier.addEventListener(PanChangeEvent.types.PAN_CHANGE, (event) =>
      this.dispatchEvent(event.clone()),
    );
  }

  public destruct = () => {
    this.signalModifier.removeAllEventListeners();
  };

  public fadeIn = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeIn(duration, onComplete);
  public fadeOut = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeOut(duration, onComplete);
  public mute = () => this.signalModifier.mute();
  public unmute = () => this.signalModifier.unmute();
  public getFadeVolume = () => this.signalModifier.getFadeVolume();
  public getVolume = () => this.signalModifier.getVolume();
  public setVolume = (value: number) => this.signalModifier.setVolume(value);
  public connectMediaElement = (element: HTMLMediaElement) =>
    this.signalModifier.connectMediaElement(element);
  public getPan = () => this.signalModifier.getPan();
  public setPan = (value: number) => this.signalModifier.setPan(value);
  public getInput = () => this.signalModifier.input;
}
