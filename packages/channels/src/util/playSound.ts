import { PlayingSound, Sound } from '../types';
import { SoundChannel } from '../SoundChannel';

type PlaySoundOptions = {
  channel?: SoundChannel;
  volume?: number;
  fadeInTime?: number;
  loop?: boolean;
};

export const playSound = (
  context: AudioContext,
  destination: AudioNode,
  sound: Sound,
  { loop = false, volume = 1, channel }: PlaySoundOptions
): PlayingSound => {
  if (!sound.audioBuffer) {
    throw new Error(`Sound '${sound.name}' is not loaded`);
  }

  // create buffer source
  const bufferSourceNode = context.createBufferSource();
  bufferSourceNode.buffer = sound.audioBuffer;
  bufferSourceNode.loop = loop;

  // create gain
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(volume, 0);

  // connect nodes
  gainNode.connect(destination);
  bufferSourceNode.connect(gainNode);

  const playingSound: PlayingSound = {
    context,
    sound,
    bufferSourceNode,
    gainNode,
    channel,
    stop: () => {
      bufferSourceNode.stop(0);
    },
  };

  bufferSourceNode.start(0);
  return playingSound;
};
