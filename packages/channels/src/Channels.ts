import {
  CreateSound,
  PlayingSound,
  SoundChannel,
  SoundChannelType,
  VolumeControls,
} from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';
import { playSound } from './util/playSound';
import { createVolumeNodes } from './util/createVolumeNodes';

type AddChannelOptions = {
  initialVolume?: number;
  type?: SoundChannelType;
};

type ConstructorProps = {
  soundsPath: string;
  soundsExtension: string;
  audioContext?: AudioContext;
  sounds?: Array<CreateSound>;
};

type OptionalChannelOptions = {
  channel?: string;
};

type PlayOptions = OptionalChannelOptions & {
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export class Channels {
  public readonly context: AudioContext;
  public readonly channelsByName: Record<string, SoundChannel> = {};
  public readonly playingSounds: Array<PlayingSound> = [];
  public readonly sampleManager: SampleManager;
  public readonly mainVolumeControls: VolumeControls;

  constructor({
    audioContext,
    soundsExtension,
    soundsPath,
    sounds,
  }: ConstructorProps) {
    this.context = audioContext || new AudioContext();

    if (!this.context) {
      throw new Error('Failed to create an AudioContext');
    }

    this.sampleManager = new SampleManager(
      this.context,
      soundsPath,
      soundsExtension
    );

    if (sounds) {
      this.sampleManager.addSamples(sounds);
    }

    // everything connect to the main volume controls
    this.mainVolumeControls = createVolumeNodes(this.context);
    this.mainVolumeControls.output.connect(this.context.destination);
  }

  public loadAllSounds(onProgress?: (value: number) => void) {
    return this.sampleManager.loadAllSamples(onProgress);
  }

  /**
   * Creates a new channel.
   * @param name
   * @param initialVolume
   * @param type
   */
  public addChannel(
    name: string,
    { initialVolume = 1, type = 'polyphonic' }: AddChannelOptions = {}
  ) {
    if (name === '') {
      throw new Error('Channel name cannot be blank');
    }
    if (this.channelsByName[name]) {
      throw new Error(`Channel '${name}' already exists`);
    }

    const volumeControls = createVolumeNodes(this.context);
    volumeControls.volume.gain.setValueAtTime(initialVolume, 0);
    volumeControls.output.connect(this.mainVolumeControls.input);

    this.channelsByName[name] = {
      initialVolume,
      type,
      name,
      volumeControls,
    };
  }

  /**
   * Gets a list of all available channels.
   */
  public getChannels(): Array<SoundChannel> {
    const channelNames = Object.keys(this.channelsByName);
    return channelNames.map(channelName => this.channelsByName[channelName]);
  }

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
  public stopAll({ channel: channelName }: OptionalChannelOptions = {}) {
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
   * Gets VolumeControls for a channel or, when no channelName is supplied,
   * the main output's VolumeControls.
   * @param channelName
   * @private
   */
  private getVolumeControls(channelName?: string) {
    return channelName
      ? this.getChannel(channelName).volumeControls
      : this.mainVolumeControls;
  }

  public getVolume(channelName?: string) {
    return this.getVolumeControls(channelName).volume.gain.value;
  }

  public getMute(channelName?: string) {
    return !this.getVolumeControls(channelName).mute.gain.value;
  }

  /**
   * Sets the volume for either a channel or the main output.
   * @param value
   * @param options
   */
  public setVolume(value: number, options: OptionalChannelOptions = {}) {
    this.setVolumeOrMuteGain(value, 'volume', options);
  }

  /**
   * Sets the mute value for either a channel or the main output.
   * @param value
   * @param options
   */
  public setMute(value: boolean, options: OptionalChannelOptions = {}) {
    this.setVolumeOrMuteGain(value ? 0 : 1, 'mute', options);
  }

  /**
   * Sets the value for either the volume of mute gain.
   * @param value
   * @param type
   * @param channelName
   * @private
   */
  private setVolumeOrMuteGain(
    value: number,
    type: 'volume' | 'mute',
    { channel: channelName }: OptionalChannelOptions = {}
  ) {
    const volumeControls = this.getVolumeControls(channelName);
    (type === 'volume'
      ? volumeControls.volume
      : volumeControls.mute
    ).gain.setValueAtTime(value, 0);
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
    { channel: channelName, volume = 1, fadeInTime, loop }: PlayOptions = {}
  ): PlayingSound {
    const sound = this.sampleManager.getSampleByName(name);
    if (!sound) {
      throw new Error(`Cannot find sample '${name}`);
    }
    const channel = channelName ? this.getChannel(channelName) : undefined;

    const playingSound = playSound(
      this.context,
      (channel?.volumeControls || this.mainVolumeControls).input,
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
