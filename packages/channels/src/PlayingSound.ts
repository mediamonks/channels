import {
  HasSignalModifier,
  PlaySoundOptions,
  Sound,
  StopSoundOptions,
} from './types';
import { Channels } from './Channels';
import { Channel } from './Channel';
import { SignalModifier } from './SignalModifier';

/**
 * Represents a playing sound.
 */
export class PlayingSound implements HasSignalModifier {
  private readonly bufferSourceNode: AudioBufferSourceNode;
  private readonly startedAt: number;
  public readonly signalModifier: SignalModifier;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode,
    public readonly channel?: Channel,
    playSoundOptions: Omit<PlaySoundOptions, 'channel'> = {}
  ) {
    const {
      loop = false,
      fadeInTime = 0,
      volume,
      effects,
      pan,
    } = playSoundOptions;

    if (!sound.audioBuffer) {
      // todo: check how/if this works, audioBuffer seems to always exist on Sound/ISample
      throw new Error(`Sound '${sound.name}' is not loaded`);
    }

    if (fadeInTime < 0) {
      throw new Error('fadeInTime can not be negative');
    }

    // create buffer source
    this.bufferSourceNode = channelsInstance.audioContext.createBufferSource();
    this.bufferSourceNode.buffer = sound.audioBuffer;
    this.bufferSourceNode.loop = loop;

    // create and connect volume nodes
    this.signalModifier = new SignalModifier(
      channelsInstance.audioContext,
      channelsInstance,
      this,
      {
        volume,
        fadeVolume: fadeInTime > 0 ? 0 : 1, // when fading in, initial fade volume is 0
        effects,
        pan,
      }
    );

    this.signalModifier.output.connect(destination);
    this.bufferSourceNode.connect(this.signalModifier.input);

    this.bufferSourceNode.onended = () => {
      this.removePlayingSound();
    };

    this.startedAt = this.channelsInstance.audioContext.currentTime;
    this.bufferSourceNode.start(0);

    if (fadeInTime) {
      this.signalModifier.fadeIn(fadeInTime);
    }
  }

  private removePlayingSound = () => {
    this.channelsInstance.removePlayingSound(this);
  };

  public stop = (stopSoundOptions: StopSoundOptions = {}) => {
    const mergedOptions = Object.assign(
      this.channel?.defaultPlayStopOptions || {},
      stopSoundOptions
    );

    const { fadeOutTime } = mergedOptions;

    if (fadeOutTime !== undefined && fadeOutTime > 0) {
      // todo: add isStopping param that prevents further actions?
      this.signalModifier.fadeOut(fadeOutTime, () => {
        this.bufferSourceNode.stop(0);
      });
    } else {
      this.bufferSourceNode.stop(0);
    }
  };

  /**
   * Gets the current progress of the playing sound (between 0 and 1)
   */
  public getProgress = () => {
    return (
      ((this.channelsInstance.audioContext.currentTime - this.startedAt) /
        this.sound.audioBuffer.duration) %
      1
    );
  };

  /*
  HasSignalModifier implementations
   */
  public fadeIn = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeIn(duration, onComplete);
  public fadeOut = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeOut(duration, onComplete);
  public mute = () => this.signalModifier.mute();
  public unmute = () => this.signalModifier.unmute();
  public getFadeVolume = () => this.signalModifier.getFadeVolume();
  public getVolume = () => this.signalModifier.getVolume();
  public setVolume = (value: number) => this.signalModifier.setVolume(value);
  public getPan = () => this.signalModifier.getPan();
  public setPan = (value: number) => this.signalModifier.setPan(value);
}
