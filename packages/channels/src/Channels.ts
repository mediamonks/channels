import { CreateSound, HasVolume, OptionalChannel } from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';
import { VolumeNodes } from './VolumeNodes';
import { CreateChannelOptions, Channel } from './Channel';
import { PlayingSound, PlaySoundOptions } from './PlayingSound';
import EventDispatcher from 'seng-event';
import { ChannelsEvent } from './event/ChannelsEvent';
import { getOptionalChannelByNameOrInstance } from './util/getOptionalChannelOrInstance';

type ConstructorProps = {
  soundsPath: string;
  soundsExtension: string;
  audioContext?: AudioContext;
  sounds?: Array<CreateSound>;
};

export class Channels extends EventDispatcher implements HasVolume {
  public readonly audioContext: AudioContext;
  private readonly channelsByName: Record<string, Channel> = {};
  private readonly playingSounds: Array<PlayingSound> = [];
  public readonly sampleManager: SampleManager;
  public readonly volumeNodes: VolumeNodes;

  constructor({
    audioContext,
    soundsExtension,
    soundsPath,
    sounds,
  }: ConstructorProps) {
    super();
    this.audioContext =
      audioContext ||
      new (window.AudioContext || (window as any).webkitAudioContext)();

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
    this.volumeNodes = new VolumeNodes(this, undefined);
    this.volumeNodes.output.connect(this.audioContext.destination);
  }

  /**
   * Resumes the audioContext if it's in the suspended state.
   */
  public resumeContext = () => {
    return this.contextIsSuspended
      ? this.audioContext.resume()
      : Promise.resolve();
  };

  /**
   * Check if the context is in the suspended state.
   */
  public get contextIsSuspended() {
    return this.audioContext.state === 'suspended';
  }

  /**
   * Loads all samples. (alias for sampleManager.loadAllSamples)
   * @param onProgress
   */
  public loadSounds = (onProgress?: (value: number) => void) => {
    return this.sampleManager.loadAllSamples(onProgress);
  };

  /**
   * Gets a list of all sounds. (alias for sampleManager.getAllSamples)
   */
  public getSounds = () => {
    return [...this.sampleManager.getAllSamples()];
  };

  /**
   * Get a list of the currently playing sounds.
   */
  public getPlayingSounds = () => {
    return [...this.playingSounds];
  };

  /**
   * Creates a new channel.
   * @param name
   * @param createChannelOptions
   */
  public createChannel = (
    name: string,
    createChannelOptions: CreateChannelOptions = {}
  ): Channel => {
    if (name === '') {
      throw new Error('Channel name cannot be blank');
    }
    if (this.channelsByName[name]) {
      throw new Error(`Channel with name '${name}' already exists`);
    }

    const channel = new Channel(name, this, createChannelOptions);

    this.channelsByName[name] = channel;

    this.dispatchEvent(new ChannelsEvent(ChannelsEvent.types.CHANNELS_CHANGE));

    return channel;
  };

  /**
   * Gets a list of all available channels.
   */
  public getChannels = (): Array<Channel> => {
    return Object.keys(this.channelsByName).map(
      channelName => this.channelsByName[channelName]
    );
  };

  /**
   * Removes a PlayingSound from the list.
   * @param playingSound
   * @private
   */
  public removePlayingSound = (playingSound: PlayingSound) => {
    const index = this.playingSounds.indexOf(playingSound);
    if (index > -1) {
      this.playingSounds.splice(index, 1);
      this.dispatchEvent(
        new ChannelsEvent(ChannelsEvent.types.PLAYING_SOUNDS_CHANGE)
      );
    } else {
      throw new Error(
        `Trying to remove a playing sound that is not listed: ${playingSound.sound.name}`
      );
    }
  };

  /**
   * Stop either all sounds or, when a channel name is supplied, all
   * sounds that are playing on a channel.
   * @param channelName
   */
  public stopAll = ({ channel }: OptionalChannel = {}) => {
    const channelToStop = getOptionalChannelByNameOrInstance(
      channel,
      this.channelsByName
    );

    this.playingSounds
      .filter(({ channel }) =>
        channelToStop ? channel === channelToStop : true
      )
      .forEach(playingSound => playingSound.stop());
  };

  /**
   * Get a channel by its name.
   * @param channelName
   */
  public getChannel = (channelName: string) => {
    const channel = this.channelsByName[channelName];

    if (!channel) {
      throw new Error(`Channel '${channelName}' does not exist`);
    }

    return channel;
  };

  /**
   * Gets the VolumeNodes instance for a channel or, when no channelName
   * is supplied, the one for the main output.
   * @param channel
   * @private
   */
  private getVolumeNodes = ({ channel }: OptionalChannel = {}): VolumeNodes => {
    const optionalChannel = getOptionalChannelByNameOrInstance(
      channel,
      this.channelsByName
    );

    return optionalChannel?.volumeNodes || this.volumeNodes;
  };

  /**
   * Gets the volume for a channel.
   * @param channelName
   */
  public getChannelVolume = (channelName: string) => {
    return this.getChannel(channelName).getVolume();
  };

  /**
   * Sets the volume for a channel.
   * @param channelName
   * @param value
   */
  public setChannelVolume = (channelName: string, value: number) => {
    this.getChannel(channelName).setVolume(value);
  };

  /**
   * Mutes a channel or the main output.
   * @param value
   * @param options
   */
  public setMute = (value: boolean, { channel }: OptionalChannel = {}) => {
    if (value) {
      this.getVolumeNodes({ channel }).mute();
    } else {
      this.getVolumeNodes({ channel }).unmute();
    }
  };

  /**
   * Play a sound. When no channel is supplied, it will be played directly
   * on the main output.
   * @param name
   * @param channel
   * @param playSoundOptions
   */
  public play = (
    name: string,
    { channel, ...playSoundOptions }: PlaySoundOptions & OptionalChannel = {}
  ): PlayingSound => {
    const sound = this.sampleManager.getSampleByName(name);
    if (!sound) {
      throw new Error(`Cannot find sound: '${name}`);
    }
    const channelForSound = getOptionalChannelByNameOrInstance(
      channel,
      this.channelsByName
    );

    const playingSound = new PlayingSound(
      this,
      sound,
      (channelForSound?.volumeNodes || this.volumeNodes).input,
      channelForSound,
      playSoundOptions
    );

    if (channelForSound?.type === 'monophonic') {
      this.stopAll({ channel });
    }

    this.playingSounds.push(playingSound);

    this.dispatchEvent(
      new ChannelsEvent(ChannelsEvent.types.PLAYING_SOUNDS_CHANGE)
    );

    return playingSound;
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
