import EventDispatcher from 'seng-event';
import { SignalModifier } from './SignalModifier';
import { SignalModifierOptions } from './types';

export class HasSignalModifier extends EventDispatcher {
  protected readonly signalModifier: SignalModifier;

  constructor(
    audioContext: AudioContext,
    signalModifierOptions: SignalModifierOptions
  ) {
    super();

    this.signalModifier = new SignalModifier(
      audioContext,
      signalModifierOptions
    );
  }

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
