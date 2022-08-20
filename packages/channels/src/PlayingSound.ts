import { Sound } from './types';
import { Channels } from './Channels';
import { SoundChannel } from './SoundChannel';

type PlaySoundOptions = {
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export class PlayingSound {
  private bufferSourceNode: AudioBufferSourceNode;

  constructor(
    private readonly channelsInstance: Channels,
    public readonly sound: Sound,
    private readonly destination: AudioNode,
    public readonly channel?: SoundChannel,
    { volume = 1, loop = false }: PlaySoundOptions = {}
  ) {
    if (!sound.audioBuffer) {
      throw new Error(`Sound '${sound.name}' is not loaded`);
    }

    // create buffer source
    this.bufferSourceNode = channelsInstance.audioContext.createBufferSource();
    this.bufferSourceNode.buffer = sound.audioBuffer;
    this.bufferSourceNode.loop = loop;

    // create gain
    const gainNode = channelsInstance.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, 0);

    // connect nodes
    gainNode.connect(destination);
    this.bufferSourceNode.connect(gainNode);

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
