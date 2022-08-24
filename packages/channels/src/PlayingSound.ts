import { Sound } from './types';
import { Channels } from './Channels';
import { Channel } from './Channel';
import { VolumeNodes, VolumeOptions } from './VolumeNodes';

export type PlaySoundOptions = {
  loop?: boolean;
  fadeInTime?: number;
} & VolumeOptions;

export type StopSoundOptions = {
  fadeOutTime?: number;
  onStopped?: () => void; // todo: rename onComplete?
};

export class PlayingSound {
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

  private removePlayingSound() {
    this.channelsInstance.removePlayingSound(this);
  }

  // arrow notation to bind 'this', in case sound.stop is passed as a handler todo: fix this better?
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
  public getProgress() {
    return (
      ((this.channelsInstance.audioContext.currentTime - this.startedAt) /
        this.sound.audioBuffer.duration) %
      1
    );
  }
}
