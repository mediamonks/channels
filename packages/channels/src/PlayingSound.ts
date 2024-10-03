import { PlaySoundOptions, Sound, StopSoundOptions } from './types';
import { Channels } from './Channels';
import { Channel } from './Channel';
import { HasSignalModifier } from './HasSignalModifier';

/**
 * Represents a playing sound.
 */
export class PlayingSound extends HasSignalModifier {
  public readonly bufferSourceNode: AudioBufferSourceNode;
  private readonly startedAt: number;
  private readonly startTimeOffset: number;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode, // todo not used? why is this here
    public readonly channel?: Channel,
    {
      loop = false,
      fadeInTime = 0,
      volume,
      effects,
      pan,
      startTimeOffset = 0,
    }: Omit<PlaySoundOptions, 'channel'> = {},
  ) {
    super(channelsInstance.audioContext, {
      volume,
      fadeVolume: fadeInTime > 0 ? 0 : 1, // when fading in, initial fade volume is 0
      effects,
      pan,
    });

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

    this.signalModifier.output.connect(destination);
    this.bufferSourceNode.connect(this.signalModifier.input);

    this.bufferSourceNode.onended = this.onEnded;

    this.startedAt = this.channelsInstance.audioContext.currentTime;
    this.startTimeOffset = startTimeOffset;
    this.bufferSourceNode.start(0, this.startTimeOffset);

    if (fadeInTime) {
      this.signalModifier.fadeIn(fadeInTime);
    }
  }

  private onEnded = () => {
    this.channelsInstance.removePlayingSound(this);
    this.destruct();
  };

  public stop = (stopSoundOptions: StopSoundOptions = {}) => {
    const mergedOptions = Object.assign(
      this.channel?.defaultPlayStopOptions || {},
      stopSoundOptions,
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
    return this.getCurrentTime() / this.sound.audioBuffer.duration;
  };

  /**
   * Gets the current time of the playing sound (in seconds).
   */
  public getCurrentTime = () => {
    return this.channelsInstance.audioContext.currentTime - this.startedAt + this.startTimeOffset;
  };
}
