import {
  CreateSound,
  PlayingSound,
  SoundChannel,
  SoundChannelType,
} from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';
import { playSound } from './util/playSound';

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

type PlayOptions = {
  channel?: string;
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
  // monoSound: boolean;
  // position: Array<number> | null = null,
};

export class Channels {
  public readonly context: AudioContext;
  public readonly channelsByName: Record<string, SoundChannel> = {};
  public readonly playingSounds: Array<PlayingSound> = [];
  public readonly sampleManager: SampleManager;
  public readonly mainGain: GainNode;

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

    // main gain is final node in audio graph
    this.mainGain = this.context.createGain();
    this.mainGain.connect(this.context.destination);
  }

  public loadAllSounds(onProgress?: (value: number) => void) {
    return this.sampleManager.loadAllSamples(onProgress);
  }

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

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(initialVolume, 0);
    gain.connect(this.mainGain);

    this.channelsByName[name] = {
      initialVolume,
      type,
      name,
      gain,
    };
  }

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

  public play(
    name: string,
    { channel: channelName, volume = 1, fadeInTime, loop }: PlayOptions = {}
  ): PlayingSound {
    const sound = this.sampleManager.getSampleByName(name);
    if (!sound) {
      throw new Error(`Cannot find sample '${name}`);
    }
    const channel = channelName ? this.channelsByName[channelName] : undefined;

    if (channelName && !channel) {
      throw new Error(`Channel '${channelName}' does not exist`);
    }

    // if (channel && channel.playingSamples.length > 0) {
    //   const alreadyPlaying = channel.playingSamples.find(
    //     playing => playing.sample.name === name
    //   );
    //   if (
    //     alreadyPlaying &&
    //     ((channel.isMonophonic && alreadyPlaying.bufferSource.loop && loop) ||
    //       monoSound)
    //   ) {
    //     // when on a monophonic channel, trying to play a looped sound that is already looping will result in no new sound being started (seemed handy)
    //     return alreadyPlaying;
    //   }
    // }

    const playingSound = playSound(
      this.context,
      channel?.gain || this.mainGain,
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

    // if (channel) {
    //   if (channel.isMonophonic) {
    //     channel.playingSamples.forEach((playingSample: PlayingSample) =>
    //       stopPlayingSample(playingSample, channel.monophonicFadeOutTime)
    //     );
    //   }
    //
    //   channel.playingSamples.push(playingSample);
    //
    //   playingSample.bufferSource.onended = () => {
    //     removePlayingSampleFromItsChannel(playingSample);
    //   };
    // }

    return playingSound;
  }
}
