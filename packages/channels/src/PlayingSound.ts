import { Sound } from './types';
import { Channels } from './Channels';
import { SoundChannel } from './SoundChannel';
import { Volume, VolumeOptions } from './Volume';

type PlaySoundOptions = {
  //fadeInTime?: number;
  loop?: boolean;
} & VolumeOptions;

export class PlayingSound {
  private bufferSourceNode: AudioBufferSourceNode;
  public readonly volume: Volume;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode,
    public readonly channel?: SoundChannel,
    { loop = false, ...volumeOptions }: PlaySoundOptions = {}
  ) {
    if (!sound.audioBuffer) {
      throw new Error(`Sound '${sound.name}' is not loaded`);
    }

    // create buffer source
    this.bufferSourceNode = channelsInstance.audioContext.createBufferSource();
    this.bufferSourceNode.buffer = sound.audioBuffer;
    this.bufferSourceNode.loop = loop;

    // create and connect volume nodes
    this.volume = new Volume(channelsInstance.audioContext, volumeOptions);
    this.volume.output.connect(destination);
    this.bufferSourceNode.connect(this.volume.input);

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
    this.bufferSourceNode.stop(0);
  };
}
