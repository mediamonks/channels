import { CreateSound, OptionalChannel, PlayingSound } from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';
import { playSound } from './util/playSound';
import { Volume, VolumeOptions } from './util/Volume';
import { SoundChannel, SoundChannelType } from './SoundChannel';

type CreateChannelOptions = {
  type?: SoundChannelType;
} & VolumeOptions;

type ConstructorProps = {
  soundsPath: string;
  soundsExtension: string;
  audioContext?: AudioContext;
  sounds?: Array<CreateSound>;
};

type PlaySoundOptions = OptionalChannel & {
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export class Channels {
  public readonly audioContext: AudioContext;
  public readonly channelsByName: Record<string, SoundChannel> = {};
  public readonly playingSounds: Array<PlayingSound> = [];
  public readonly sampleManager: SampleManager;
  public readonly mainVolume: Volume;

  constructor({
    audioContext,
    soundsExtension,
    soundsPath,
    sounds,
  }: ConstructorProps) {
    this.audioContext = audioContext || new AudioContext();

    if (!this.audioContext) {
      throw new Error('Failed to create an AudioContext');
    }

    this.sampleManager = new SampleManager(
      this.audioContext,
      soundsPath,
      soundsExtension
    );

    if (sounds) {
      this.sampleManager.addSamples(sounds);
    }

    // everything connect to the main volume controls
    this.mainVolume = new Volume(this.audioContext);
    this.mainVolume.output.connect(this.audioContext.destination);
  }

  public loadAllSounds(onProgress?: (value: number) => void) {
    return this.sampleManager.loadAllSamples(onProgress);
  }

  /**
   * Creates a new channel.
   * @param name
   * @param type
   * @param volumeOptions
   */
  public createChannel(
    name: string,
    { type = 'monophonic', ...volumeOptions }: CreateChannelOptions = {}
  ) {
    if (name === '') {
      throw new Error('Channel name cannot be blank');
    }
    if (this.channelsByName[name]) {
      throw new Error(`Channel '${name}' already exists`);
    }

    const channel = new SoundChannel(name, this, type, volumeOptions);

    this.channelsByName[name] = channel;

    return channel;
  }

  /**
   * Gets a list of all available channels.
   */
  public getChannels(): Array<SoundChannel> {
    return Object.keys(this.channelsByName).map(
      channelName => this.channelsByName[channelName]
    );
  }

  /**
   * Removes a PlayingSound from the list.
   * @param sound
   * @private
   */
  private removePlayingSound(sound: PlayingSound) {
    const index = this.playingSounds.indexOf(sound);
    if (index > -1) {
      this.playingSounds.splice(index, 1);
    }
  }

  /**
   * Stop either all sounds or, when a channel name is supplied, all
   * sounds that are playing on a channel.
   * @param channelName
   */
  public stopAll({ channel: channelName }: OptionalChannel = {}) {
    if (channelName && !this.channelsByName[channelName]) {
      throw new Error(`Channel '${channelName}' does not exist`);
    }

    this.playingSounds
      .filter(({ channel }) =>
        channelName ? channel?.name === channelName : true
      )
      .forEach(playingSound => playingSound.stop());
  }

  /**
   * Get a channel by its name.
   * @param channelName
   */
  public getChannel(channelName: string) {
    const channel = this.channelsByName[channelName];

    if (!channel) {
      throw new Error(`Channel '${channelName}' does not exist`);
    }

    return channel;
  }

  /**
   * Gets the Volume instance for a channel or, when no channelName
   * is supplied, the one for the main output.
   * @param channel
   * @private
   */
  private getVolumeInstance({ channel }: OptionalChannel = {}): Volume {
    return channel ? this.getChannel(channel).volume : this.mainVolume;
  }

  public getVolume({ channel }: OptionalChannel = {}) {
    return this.getVolumeInstance({ channel }).volume;
  }

  public getIsMuted({ channel }: OptionalChannel = {}) {
    return this.getVolumeInstance({ channel }).isMuted;
  }

  /**
   * Sets the volume for either a channel or the main output.
   * @param value
   * @param options
   */
  public setVolume(value: number, { channel }: OptionalChannel = {}) {
    this.getVolumeInstance({ channel }).volume = value;
  }

  /**
   * Sets the mute value for either a channel or the main output.
   * @param value
   * @param options
   */
  public setMute(value: boolean, { channel }: OptionalChannel = {}) {
    this.getVolumeInstance({ channel }).isMuted = value;
  }

  /**
   * Play a sound. When no channel is supplied, it will be played directly
   * on the main output.
   * @param name
   * @param channel
   * @param volume
   * @param fadeInTime
   * @param loop
   */
  public play(
    name: string,
    {
      channel: channelName,
      volume = 1,
      fadeInTime,
      loop,
    }: PlaySoundOptions = {}
  ): PlayingSound {
    const sound = this.sampleManager.getSampleByName(name);
    if (!sound) {
      throw new Error(`Cannot find sample '${name}`);
    }
    const channel = channelName ? this.getChannel(channelName) : undefined;

    const playingSound = playSound(
      this.audioContext,
      (channel?.volume || this.mainVolume).input,
      sound,
      {
        channel,
        volume,
        fadeInTime,
        loop,
      }
    );

    playingSound.bufferSourceNode.onended = () => {
      this.removePlayingSound(playingSound);
    };

    this.playingSounds.push(playingSound);

    return playingSound;
  }
}
