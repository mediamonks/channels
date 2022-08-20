import { CreateSound, OptionalChannel } from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';
import { Volume } from './util/Volume';
import { CreateSoundChannelOptions, SoundChannel } from './SoundChannel';
import { PlayingSound } from './PlayingSound';

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

  /**
   * Resumes the audioContext if it's in the suspended state.
   */
  public resumeContext() {
    return this.contextIsSuspended
      ? this.audioContext.resume()
      : Promise.resolve();
  }

  public get contextIsSuspended() {
    return this.audioContext.state === 'suspended';
  }

  /**
   * Loads all samples. (alias for sampleManager.loadAllSamples)
   * @param onProgress
   */
  public loadAllSounds(onProgress?: (value: number) => void) {
    return this.sampleManager.loadAllSamples(onProgress);
  }

  /**
   * Gets a list of all sounds. (alias for sampleManager.getAllSamples)
   */
  public getAllSounds() {
    return this.sampleManager.getAllSamples();
  }

  /**
   * Creates a new channel.
   * @param name
   * @param createSoundChannelOptions
   */
  public createChannel(
    name: string,
    createSoundChannelOptions: CreateSoundChannelOptions = {}
  ): SoundChannel {
    if (name === '') {
      throw new Error('Channel name cannot be blank');
    }
    if (this.channelsByName[name]) {
      throw new Error(`Channel with name '${name}' already exists`);
    }

    const channel = new SoundChannel(name, this, createSoundChannelOptions);

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
   * @param playingSound
   * @private
   */
  public removePlayingSound(playingSound: PlayingSound) {
    const index = this.playingSounds.indexOf(playingSound);
    if (index > -1) {
      this.playingSounds.splice(index, 1);
    } else {
      throw new Error(
        `Trying to remove a playing sound that is not listed: ${playingSound.sound.name}`
      );
    }
  }

  private getOptionalChannelByNameOrInstance(
    channel: OptionalChannel['channel']
  ): SoundChannel | undefined {
    if (typeof channel === 'string' && !this.channelsByName[channel]) {
      throw new Error(`Channel '${channel}' does not exist`);
    }
    return typeof channel === 'string' ? this.channelsByName[channel] : channel;
  }

  /**
   * Stop either all sounds or, when a channel name is supplied, all
   * sounds that are playing on a channel.
   * @param channelName
   */
  public stopAll({ channel }: OptionalChannel = {}) {
    const channelToStop = this.getOptionalChannelByNameOrInstance(channel);

    this.playingSounds
      .filter(({ channel }) =>
        channelToStop ? channel === channelToStop : true
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
    const optionalChannel = this.getOptionalChannelByNameOrInstance(channel);

    return optionalChannel?.volume || this.mainVolume;
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
   * @param playSoundOptions
   */
  public play(
    name: string,
    { channel, ...playSoundOptions }: PlaySoundOptions & OptionalChannel = {}
  ): PlayingSound {
    const sound = this.sampleManager.getSampleByName(name);
    if (!sound) {
      throw new Error(`Cannot find sound: '${name}`);
    }
    const channelForSound = this.getOptionalChannelByNameOrInstance(channel);

    const playingSound = new PlayingSound(
      this,
      sound,
      (channelForSound?.volume || this.mainVolume).input,
      channelForSound,
      playSoundOptions
    );

    this.playingSounds.push(playingSound);
    return playingSound;
  }
}
