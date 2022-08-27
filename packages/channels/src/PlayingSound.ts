import { HasVolume, PlaySoundOptions, Sound, StopSoundOptions } from './types';
import { Channels } from './Channels';
import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';

export class PlayingSound implements HasVolume {
  private readonly bufferSourceNode: AudioBufferSourceNode;
  private readonly startedAt: number;
  public readonly volumeNodes: VolumeNodes;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode,
    public readonly channel?: Channel,
    { loop = false, fadeInTime = 0, ...volumeOptions }: PlaySoundOptions = {}
  ) {
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
    this.volumeNodes = new VolumeNodes(
      channelsInstance.audioContext,
      channelsInstance,
      this,
      volumeOptions,
      fadeInTime > 0 ? 0 : 1 // when fading in, initial fade volume is 0
    );

    if (fadeInTime) {
      this.volumeNodes.fadeIn(fadeInTime);
    }

    this.volumeNodes.output.connect(destination);
    this.bufferSourceNode.connect(this.volumeNodes.input);

    this.bufferSourceNode.onended = () => {
      this.removePlayingSound();
    };

    this.startedAt = this.channelsInstance.audioContext.currentTime;
    this.bufferSourceNode.start(0);
  }

  private removePlayingSound = () => {
    this.channelsInstance.removePlayingSound(this);
  };

  public stop = ({ fadeOutTime, onStopped }: StopSoundOptions = {}) => {
    if (fadeOutTime !== undefined && fadeOutTime > 0) {
      // todo: add isStopping param that prevents further actions?
      this.volumeNodes.fadeOut(fadeOutTime, () => {
        this.bufferSourceNode.stop(0);
        onStopped?.();
      });
    } else {
      this.bufferSourceNode.stop(0);
      onStopped?.();
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
  HasVolume implementations
   */
  public fadeIn = (duration: number, onComplete?: () => void): void =>
    this.volumeNodes.fadeIn(duration, onComplete);
  public fadeOut = (duration: number, onComplete?: () => void): void =>
    this.volumeNodes.fadeOut(duration, onComplete);
  public mute = () => this.volumeNodes.mute();
  public unmute = () => this.volumeNodes.unmute();
  public getFadeVolume = () => this.volumeNodes.getFadeVolume();
  public getVolume = () => this.volumeNodes.getVolume();
  public setVolume = (value: number) => this.volumeNodes.setVolume(value);
}
