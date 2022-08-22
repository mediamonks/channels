import { Sound } from './types';
import { Channels } from './Channels';
import { SoundChannel } from './SoundChannel';
import { VolumeNodes, VolumeOptions } from './VolumeNodes';

export type PlaySoundOptions = {
  fadeOutTime?: number;
  loop?: boolean;
} & VolumeOptions;

export class PlayingSound {
  private readonly bufferSourceNode: AudioBufferSourceNode;
  public readonly volumeNodes: VolumeNodes;
  public readonly fadeOutTime: number | undefined;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode,
    public readonly channel?: SoundChannel,
    { loop = false, fadeOutTime, ...volumeOptions }: PlaySoundOptions = {}
  ) {
    if (!sound.audioBuffer) {
      throw new Error(`Sound '${sound.name}' is not loaded`);
    }

    if (typeof fadeOutTime === 'number') {
      if (fadeOutTime < 0) {
        throw new Error('fadeOutTime should be 0 or larger');
      }
      this.fadeOutTime = fadeOutTime;
    }

    // create buffer source
    this.bufferSourceNode = channelsInstance.audioContext.createBufferSource();
    this.bufferSourceNode.buffer = sound.audioBuffer;
    this.bufferSourceNode.loop = loop;

    // create and connect volume nodes
    this.volumeNodes = new VolumeNodes(
      channelsInstance.audioContext,
      volumeOptions
    );
    this.volumeNodes.output.connect(destination);
    this.bufferSourceNode.connect(this.volumeNodes.input);

    this.bufferSourceNode.onended = () => {
      this.removePlayingSound();
    };

    this.bufferSourceNode.start(0);
  }

  private removePlayingSound() {
    this.channelsInstance.removePlayingSound(this);
  }

  // arrow notation to bind 'this', in case sound.stop is passed as a handler todo: fix this better?
  public stop = () => {
    if (this.fadeOutTime !== undefined && this.fadeOutTime !== 0) {
      // todo: add isStopping param that prevents further actions?
      this.volumeNodes.fadeOut(this.fadeOutTime, () =>
        this.bufferSourceNode.stop(0)
      );
    } else {
      this.bufferSourceNode.stop(0);
    }
  };
}
